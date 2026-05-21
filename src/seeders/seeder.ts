import "dotenv/config";
import mongoose from "mongoose";
import { connectDB } from "../config/database";

import { User } from "../models/user.model";
import { Category } from "../models/category.model";
import { Subcategory } from "../models/subcategory.model";
import { Product } from "../models/product.model";
import { Testimonial } from "../models/testimonial.model";
import { Order } from "../models/order.model";
import { CartItem } from "../models/cart.model";
import { Address } from "../models/address.model";
import { Review } from "../models/review.model";
import { HomeSlide } from "../models/home-slide.model";
import { SiteConfig } from "../models/site-config.model";

import { categoriesData } from "./data/categories.data";
import { subcategoriesData } from "./data/subcategories.data";
import { productsData } from "./data/products.data";
import { usersData } from "./data/users.data";
import { testimonialsData } from "./data/testimonials.data";
import { OrderStatus } from "../types/enum";

class Seeder {

  // ─── Clear ────────────────────────────────────────────────────────────────
  async clearAll(): Promise<void> {
    console.log("🗑️  Clearing all collections...");
    await Promise.all([
      User.deleteMany({}),
      Category.deleteMany({}),
      Subcategory.deleteMany({}),
      Product.deleteMany({}),
      Testimonial.deleteMany({}),
      Order.deleteMany({}),
      CartItem.deleteMany({}),
      Address.deleteMany({}),
      Review.deleteMany({}),
      HomeSlide.deleteMany({}),
      SiteConfig.deleteMany({}),
    ]);
    console.log("All collections cleared.\n");
  }

  // ─── Users ────────────────────────────────────────────────────────────────
  async seedUsers(): Promise<Map<string, mongoose.Types.ObjectId>> {
    console.log("Seeding users...");
    const userMap = new Map<string, mongoose.Types.ObjectId>();

    for (const data of usersData) {
      const user = await User.create(data as any);
      userMap.set(user.mobile, user._id as mongoose.Types.ObjectId);
    }

    console.log(`${usersData.length} users created.`);
    return userMap;
  }

  // ─── Categories ───────────────────────────────────────────────────────────
  async seedCategories(): Promise<Map<string, mongoose.Types.ObjectId>> {
    console.log("📂 Seeding categories...");
    const categoryMap = new Map<string, mongoose.Types.ObjectId>();

    for (const data of categoriesData) {
      const category = await Category.create(data);
      categoryMap.set(category.title, category._id as mongoose.Types.ObjectId);
    }

    console.log(`${categoriesData.length} categories created.`);
    return categoryMap;
  }

  // ─── Subcategories ────────────────────────────────────────────────────────
  async seedSubcategories(
    categoryMap: Map<string, mongoose.Types.ObjectId>
  ): Promise<Map<string, mongoose.Types.ObjectId>> {
    console.log("📁 Seeding subcategories...");
    const subcategoryMap = new Map<string, mongoose.Types.ObjectId>();

    for (const data of subcategoriesData) {
      const categoryId = categoryMap.get(data.category);
      if (!categoryId) {
        console.warn(` Category not found: ${data.category}`);
        continue;
      }

      const subcategory = await Subcategory.create({
        title: data.title,
        categoryId,
        isActive: data.isActive,
        isDeleted: false,
      });

      subcategoryMap.set(
        `${data.category}||${data.title}`,
        subcategory._id as mongoose.Types.ObjectId
      );
    }

    console.log(`${subcategoriesData.length} subcategories created.`);
    return subcategoryMap;
  }

  // ─── Products ─────────────────────────────────────────────────────────────
  async seedProducts(
    categoryMap: Map<string, mongoose.Types.ObjectId>,
    subcategoryMap: Map<string, mongoose.Types.ObjectId>
  ): Promise<void> {
    console.log(" Seeding products...");

    // totalSold values للـ Best Sellers feature
    const totalSoldValues = [
      45, 3, 0, 40, 35,    // T-Shirts Men + Women + Kids
      30, 25, 32, 18, 22,    // Jeans
      35, 2, 28, 20,        // Dresses
      22, 18, 15, 12,        // Jackets
      10, 8, 6,             // Formal
      38, 30, 25,            // Shorts
      20, 18, 15,            // Sweaters
      8, 12, 10,            // Coats
      42, 50,                // Activewear
      55, 48, 44, 40, 35,    // Summer Collection
      0, 0, 0,             // Winter Collection (inactive)
    ];

    let index = 0;
    for (const prod of productsData) {
      const categoryId = categoryMap.get(prod.category);
      const subCategoryId = subcategoryMap.get(`${prod.category}||${prod.subcategory}`);

      if (!categoryId || !subCategoryId) {
        console.warn(`⚠️  Skipping: ${prod.name} — category/subcategory not found`);
        index++;
        continue;
      }

      await Product.create({
        name: prod.name,
        description: prod.description,
        price: prod.price,
        stock: prod.stock,
        images: prod.images,
        mainImage: prod.images[0],
        categoryId,
        subCategoryId,
        isActive: prod.isActive,
        isDeleted: false,
        totalSold: totalSoldValues[index] || 0,
      });

      index++;
    }

    console.log(` ${productsData.length} products created.`);
  }

  // ─── Addresses ────────────────────────────────────────────────────────────
  async seedAddresses(
    userMap: Map<string, mongoose.Types.ObjectId>
  ): Promise<void> {
    console.log("📍 Seeding addresses...");

    const userId1 = userMap.get("+201111111111");
    const userId2 = userMap.get("+201222222222");
    const userId3 = userMap.get("+201333333333");

    if (userId1) {
      await Address.create({ userId: userId1, label: "home", addressText: "123 Nile Street, Zamalek, Cairo, Egypt", isDefault: true } as any);
      await Address.create({ userId: userId1, label: "work", addressText: "456 Tahrir Square, Downtown Cairo, Egypt", isDefault: false } as any);
    }

    if (userId2) {
      await Address.create({ userId: userId2, label: "home", addressText: "789 Alexandria Corniche, Alexandria, Egypt", isDefault: true, } as any);
    }

    if (userId3) {
      await Address.create({ userId: userId3, label: "home", addressText: "321 Maadi Ring Road, Cairo, Egypt", isDefault: true, } as any);
    }

    console.log(" Addresses created.");
  }

  // ─── Orders ───────────────────────────────────────────────────────────────
  async seedOrders(
    userMap: Map<string, mongoose.Types.ObjectId>,
    productDocs: any[]
  ): Promise<void> {
    console.log(" Seeding orders...");

    const userId1 = userMap.get("+201111111111");
    const userId2 = userMap.get("+201333333333");

    if (!userId1 || productDocs.length < 5) {
      console.warn("  Not enough data for orders.");
      return;
    }

    // Order 1 — Received (لمراجعات الـ reviews لاحقاً)
    await Order.create({
      userId: userId1,
      address: "123 Nile Street, Zamalek, Cairo, Egypt",
      phoneNumber: "+201111111111",
      totalPrice: productsData[0].price + productsData[6].price,
      status: OrderStatus.RECEIVED,
      products: [
        {
          productId: productDocs[0]._id,
          name: productsData[0].name,
          price: productsData[0].price,
          quantity: 1,
          image: productsData[0].images[0],
        },
        {
          productId: productDocs[6]._id,
          name: productsData[6].name,
          price: productsData[6].price,
          quantity: 1,
          image: productsData[6].images[0],
        },
      ],
      statusLog: [
        { status: OrderStatus.PENDING, changedAt: new Date(Date.now() - 7 * 86400000), changedBy: userId1 },
        { status: OrderStatus.PREPARING, changedAt: new Date(Date.now() - 6 * 86400000), changedBy: userId1 },
        { status: OrderStatus.SHIPPED, changedAt: new Date(Date.now() - 5 * 86400000), changedBy: userId1 },
        { status: OrderStatus.RECEIVED, changedAt: new Date(Date.now() - 4 * 86400000), changedBy: userId1 },
      ],
    });

    // Order 2 — Pending
    await Order.create({
      userId: userId1,
      address: "123 Nile Street, Zamalek, Cairo, Egypt",
      phoneNumber: "+201111111111",
      totalPrice: productsData[18].price,
      status: OrderStatus.PENDING,
      products: [
        {
          productId: productDocs[18]._id,
          name: productsData[18].name,
          price: productsData[18].price,
          quantity: 1,
          image: productsData[18].images[0],
        },
      ],
      statusLog: [
        { status: OrderStatus.PENDING, changedAt: new Date(), changedBy: userId1 },
      ],
    });

    // Order 3 — Shipped (userId2)
    if (userId2 && productDocs[11] && productDocs[12]) {
      await Order.create({
        userId: userId2,
        address: "321 Maadi Ring Road, Cairo, Egypt",
        phoneNumber: "+201333333333",
        totalPrice: productsData[11].price + productsData[12].price,
        status: OrderStatus.SHIPPED,
        products: [
          {
            productId: productDocs[11]._id,
            name: productsData[11].name,
            price: productsData[11].price,
            quantity: 1,
            image: productsData[11].images[0],
          },
          {
            productId: productDocs[12]._id,
            name: productsData[12].name,
            price: productsData[12].price,
            quantity: 2,
            image: productsData[12].images[0],
          },
        ],
        statusLog: [
          { status: OrderStatus.PENDING, changedAt: new Date(Date.now() - 2 * 86400000), changedBy: userId2 },
          { status: OrderStatus.PREPARING, changedAt: new Date(Date.now() - 1 * 86400000), changedBy: userId2 },
          { status: OrderStatus.SHIPPED, changedAt: new Date(), changedBy: userId2 },
        ],
      });
    }

    console.log("✅ 3 orders created.");
  }

  // ─── Testimonials ─────────────────────────────────────────────────────────
  async seedTestimonials(
    userMap: Map<string, mongoose.Types.ObjectId>
  ): Promise<void> {
    console.log(" Seeding testimonials...");

    for (const data of testimonialsData) {
      const userId = userMap.get(data.userMobile);
      if (!userId) continue;

      await Testimonial.create({
        userId,
        comment: data.comment,
        stars: data.stars,
        status: data.status,
        isApproved: data.status === "approved",
      } as any);
    }

    console.log(`${testimonialsData.length} testimonials created.`);
  }

  // ─── Reviews ──────────────────────────────────────────────────────────────
  async seedReviews(
    userMap: Map<string, mongoose.Types.ObjectId>,
    productDocs: any[]
  ): Promise<void> {
    console.log(" Seeding product reviews...");

    const userId1 = userMap.get("+201111111111");
    const userId2 = userMap.get("+201222222222");
    const userId3 = userMap.get("+201333333333");

    if (!userId1 || productDocs.length < 5) return;

    const reviewsData = [
      {
        userId: userId1,
        productIdx: 0,
        stars: 5,
        comment: "Excellent quality! The fabric is super soft and the fit is perfect. Highly recommended!",
        isVerified: true,
      },
      {
        userId: userId2,
        productIdx: 0,
        stars: 4,
        comment: "Great t-shirt, very comfortable. The color is exactly as shown.",
        isVerified: false,
      },
      {
        userId: userId3,
        productIdx: 6,
        stars: 5,
        comment: "Best jeans I have ever bought! Perfect slim fit and great material.",
        isVerified: true,
      },
      {
        userId: userId1,
        productIdx: 11,
        stars: 5,
        comment: "Beautiful dress! Got so many compliments. The floral pattern is gorgeous.",
        isVerified: true,
      },
      {
        userId: userId2,
        productIdx: 18,
        stars: 4,
        comment: "Great suit, very well tailored. Looks sharp and professional.",
        isVerified: false,
      },
    ];

    for (const review of reviewsData) {
      if (!productDocs[review.productIdx]) continue;
      await Review.create({
        productId: productDocs[review.productIdx]._id,
        userId: review.userId,
        stars: review.stars,
        comment: review.comment,
        images: [],
        isVerified: review.isVerified,
        isApproved: true,
      });
    }

    console.log("Product reviews created.");
  }

  // ─── Content Management ───────────────────────────────────────────────────
  async seedContent(): Promise<void> {
    console.log("🖥️  Seeding home slides & campaign configs...");

    await HomeSlide.create([
      {
        image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1400",
        label: "Women's Collection",
        title: "Elevate Your Everyday",
        description: "Our latest minimalist silhouettes designed for the modern lifestyle.",
        cta: "SHOP WOMEN",
        link: "/products",
        order: 1,
        isActive: true
      },
      {
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1400",
        label: "Men's Collection",
        title: "Refined Tailoring",
        description: "Bridging traditional craftsmanship and contemporary silhouette.",
        cta: "SHOP MEN",
        link: "/products",
        order: 2,
        isActive: true
      }
    ]);

    await SiteConfig.create({
      campaignTag: "LIMITED EDITION",
      campaignTitle: "Summer Collection 2026",
      campaignDescription: "Discover the essence of summer with our meticulously curated pieces, crafted for sun-drenched days and warm evenings.",
      campaignBtnText: "EXPLORE CAMPAIGN",
      campaignBtnLink: "/products"
    });

    console.log("Dynamic content seeded successfully.");
  }

  // ─── Run ──────────────────────────────────────────────────────────────────
  async run(): Promise<void> {
    const isReset = process.argv.includes("--reset");

    try {
      await connectDB();
      console.log("\n🌱 Starting seeder...\n");

      if (isReset) await this.clearAll();

      const userMap = await this.seedUsers();
      const categoryMap = await this.seedCategories();
      const subcategoryMap = await this.seedSubcategories(categoryMap);
      await this.seedProducts(categoryMap, subcategoryMap);

      const productDocs = await Product.find({}).lean().exec();

      await this.seedAddresses(userMap);
      await this.seedOrders(userMap, productDocs);
      await this.seedTestimonials(userMap);
      await this.seedReviews(userMap, productDocs);
      await this.seedContent();

      console.log("\n Seeding completed successfully!\n");
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log("Demo Credentials:");
      console.log("   Admin:  +201000000000 / Admin@1234");
      console.log("   User 1: +201111111111 / User@1234");
      console.log("   User 2: +201222222222 / User@1234");
      console.log("   User 3: +201333333333 / User@1234");
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log("\n Data Summary:");
      console.log(`   Categories:    ${categoriesData.length}`);
      console.log(`   Subcategories: ${subcategoriesData.length}`);
      console.log(`   Products:      ${productsData.length}`);
      console.log(`   Users:         ${usersData.length}`);
      console.log(`   Orders:        3`);
      console.log(`   Testimonials:  ${testimonialsData.length}`);
      console.log(`   Reviews:       5\n`);

    } catch (error) {
      console.error("Seeding failed:", error);
      process.exit(1);
    } finally {
      await mongoose.disconnect();
      process.exit(0);
    }
  }
}

new Seeder().run();