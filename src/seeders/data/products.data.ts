/**
 * @description Products data
 * SRS: مفيش season/gender field على الـ product
 * الـ gender بيجي من اسم الـ subcategory
 * الـ seasonal بيجي من الـ category isActive
 */
export const productsData = [

  // ══════════════════════════════════════════════════════════════════════════
  // T-SHIRTS
  // ══════════════════════════════════════════════════════════════════════════

  // Men's T-Shirts
  {
    name:        "Classic White Tee",
    description: "A timeless white t-shirt crafted from 100% organic cotton. Perfect for any casual occasion. Features a crew neck and relaxed fit.",
    price:       199,
    stock:       50,
    category:    "T-Shirts",
    subcategory: "Men's T-Shirts",
    isActive:    true,
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500",
      "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?w=500",
    ],
  },
  {
    name:        "Navy Essential Tee",
    description: "Soft navy blue t-shirt with a relaxed fit. A wardrobe essential for every man. Made from premium cotton blend.",
    price:       179,
    stock:       3,   // Low stock demo
    category:    "T-Shirts",
    subcategory: "Men's T-Shirts",
    isActive:    true,
    images: [
      "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?w=500",
    ],
  },
  {
    name:        "Graphic Print Tee",
    description: "Bold graphic print t-shirt for men. Express your unique style with this eye-catching contemporary design.",
    price:       229,
    stock:       0,   // Out of stock demo
    category:    "T-Shirts",
    subcategory: "Men's T-Shirts",
    isActive:    true,
    images: [
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=500",
    ],
  },

  // Women's T-Shirts
  {
    name:        "Women's Crop Top",
    description: "Stylish crop top perfect for casual outings. Lightweight fabric with a flattering cut.",
    price:       159,
    stock:       45,
    category:    "T-Shirts",
    subcategory: "Women's T-Shirts",
    isActive:    true,
    images: [
      "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=500",
      "https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?w=500",
    ],
  },
  {
    name:        "Striped Casual Top",
    description: "Playful striped top in navy and white. A French-inspired essential that pairs with everything.",
    price:       149,
    stock:       55,
    category:    "T-Shirts",
    subcategory: "Women's T-Shirts",
    isActive:    true,
    images: [
      "https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?w=500",
    ],
  },

  // Kids T-Shirts
  {
    name:        "Kids Colorful Tee",
    description: "Fun and colorful t-shirt for kids. Soft, durable fabric perfect for active play.",
    price:       99,
    stock:       60,
    category:    "T-Shirts",
    subcategory: "Kids T-Shirts",
    isActive:    true,
    images: [
      "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=500",
    ],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // JEANS
  // ══════════════════════════════════════════════════════════════════════════

  // Men's Jeans
  {
    name:        "Slim Fit Dark Jeans",
    description: "Premium slim fit jeans in a classic dark wash. Versatile and stylish for any occasion.",
    price:       549,
    stock:       30,
    category:    "Jeans",
    subcategory: "Men's Jeans",
    isActive:    true,
    images: [
      "https://images.unsplash.com/photo-1542272604-787c3835535d?w=500",
      "https://images.unsplash.com/photo-1475178626620-a4d074967452?w=500",
    ],
  },
  {
    name:        "Straight Cut Blue Jeans",
    description: "Classic straight cut jeans in medium blue wash. Comfortable all-day wear with a timeless silhouette.",
    price:       499,
    stock:       25,
    category:    "Jeans",
    subcategory: "Men's Jeans",
    isActive:    true,
    images: [
      "https://images.unsplash.com/photo-1475178626620-a4d074967452?w=500",
    ],
  },

  // Women's Jeans
  {
    name:        "High Waist Skinny Jeans",
    description: "Flattering high waist skinny jeans in classic blue. A wardrobe staple for every woman.",
    price:       549,
    stock:       32,
    category:    "Jeans",
    subcategory: "Women's Jeans",
    isActive:    true,
    images: [
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500",
    ],
  },
  {
    name:        "Wide Leg White Jeans",
    description: "Chic wide leg jeans in bright white. Sophisticated and comfortable for any occasion.",
    price:       599,
    stock:       18,
    category:    "Jeans",
    subcategory: "Women's Jeans",
    isActive:    true,
    images: [
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500",
    ],
  },

  // Kids Jeans
  {
    name:        "Kids Denim Jeans",
    description: "Durable denim jeans for active kids. Reinforced stitching for extra longevity.",
    price:       199,
    stock:       45,
    category:    "Jeans",
    subcategory: "Kids Jeans",
    isActive:    true,
    images: [
      "https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=500",
    ],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // DRESSES
  // ══════════════════════════════════════════════════════════════════════════

  // Women's Dresses
  {
    name:        "Floral Wrap Dress",
    description: "Elegant floral wrap dress with a flattering silhouette. Perfect for any occasion from brunch to dinner.",
    price:       649,
    stock:       35,
    category:    "Dresses",
    subcategory: "Women's Dresses",
    isActive:    true,
    images: [
      "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=500",
      "https://images.unsplash.com/photo-1550639525-c97d455acf70?w=500",
    ],
  },
  {
    name:        "Little Black Dress",
    description: "The timeless LBD. Versatile, elegant, and effortlessly chic. A must-have for every wardrobe.",
    price:       799,
    stock:       2,   // Low stock demo
    category:    "Dresses",
    subcategory: "Women's Dresses",
    isActive:    true,
    images: [
      "https://images.unsplash.com/photo-1550639525-c97d455acf70?w=500",
    ],
  },
  {
    name:        "Boho Maxi Dress",
    description: "Flowing boho maxi dress in earthy tones. Light and breezy fabric perfect for warm days.",
    price:       599,
    stock:       28,
    category:    "Dresses",
    subcategory: "Women's Dresses",
    isActive:    true,
    images: [
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=500",
    ],
  },

  // Girls Dresses
  {
    name:        "Girls Floral Dress",
    description: "Sweet floral dress for little girls. Soft, breathable fabric with an easy-to-wear design.",
    price:       299,
    stock:       35,
    category:    "Dresses",
    subcategory: "Girls Dresses",
    isActive:    true,
    images: [
      "https://images.unsplash.com/photo-1518831959646-742c3a14ebf9?w=500",
    ],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // JACKETS
  // ══════════════════════════════════════════════════════════════════════════

  // Men's Jackets
  {
    name:        "Casual Denim Jacket",
    description: "Classic denim jacket with a modern fit. Layer it over anything for an effortlessly cool look.",
    price:       749,
    stock:       20,
    category:    "Jackets",
    subcategory: "Men's Jackets",
    isActive:    true,
    images: [
      "https://images.unsplash.com/photo-1523205771623-e0faa4d2813d?w=500",
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500",
    ],
  },
  {
    name:        "Bomber Jacket",
    description: "Sleek bomber jacket in olive green. A versatile outerwear piece perfect for cooler days.",
    price:       899,
    stock:       15,
    category:    "Jackets",
    subcategory: "Men's Jackets",
    isActive:    true,
    images: [
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500",
    ],
  },

  // Women's Jackets
  {
    name:        "Women's Leather Jacket",
    description: "Edgy faux leather jacket for a bold, confident look. Pairs perfectly with jeans or dresses.",
    price:       999,
    stock:       10,
    category:    "Jackets",
    subcategory: "Women's Jackets",
    isActive:    true,
    images: [
      "https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=500",
    ],
  },

  // Kids Jackets
  {
    name:        "Kids Denim Jacket",
    description: "Mini denim jacket for stylish little ones. Pairs with everything in their wardrobe.",
    price:       349,
    stock:       25,
    category:    "Jackets",
    subcategory: "Kids Jackets",
    isActive:    true,
    images: [
      "https://images.unsplash.com/photo-1471286174890-9c112ac5f9a3?w=500",
    ],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // FORMAL
  // ══════════════════════════════════════════════════════════════════════════

  {
    name:        "Classic Black Suit",
    description: "Impeccably tailored black suit. Make a powerful statement at any formal occasion.",
    price:       2499,
    stock:       10,
    category:    "Formal",
    subcategory: "Men's Formal",
    isActive:    true,
    images: [
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=500",
      "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=500",
    ],
  },
  {
    name:        "Navy Blue Blazer",
    description: "Sharp navy blazer that transitions seamlessly from office to evening occasions.",
    price:       1299,
    stock:       12,
    category:    "Formal",
    subcategory: "Men's Formal",
    isActive:    true,
    images: [
      "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=500",
    ],
  },
  {
    name:        "Women's Formal Blazer",
    description: "Elegant women's blazer in classic black. Power dressing at its finest.",
    price:       1099,
    stock:       14,
    category:    "Formal",
    subcategory: "Women's Formal",
    isActive:    true,
    images: [
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=500",
    ],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // SHORTS
  // ══════════════════════════════════════════════════════════════════════════

  {
    name:        "Men's Linen Shorts",
    description: "Breathable linen shorts in beige. Lightweight and comfortable for warm days.",
    price:       299,
    stock:       40,
    category:    "Shorts",
    subcategory: "Men's Shorts",
    isActive:    true,
    images: [
      "https://images.unsplash.com/photo-1591195853828-11db59a44f43?w=500",
    ],
  },
  {
    name:        "Women's Denim Shorts",
    description: "Classic denim shorts with a flattering high waist. Perfect for casual summer days.",
    price:       279,
    stock:       38,
    category:    "Shorts",
    subcategory: "Women's Shorts",
    isActive:    true,
    images: [
      "https://images.unsplash.com/photo-1591195853828-11db59a44f43?w=500",
    ],
  },
  {
    name:        "Kids Denim Shorts",
    description: "Durable denim shorts for active kids. Reinforced knees for extra durability during play.",
    price:       179,
    stock:       50,
    category:    "Shorts",
    subcategory: "Kids Shorts",
    isActive:    true,
    images: [
      "https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=500",
    ],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // SWEATERS
  // ══════════════════════════════════════════════════════════════════════════

  {
    name:        "Chunky Knit Sweater",
    description: "Cozy chunky knit sweater in warm oatmeal. Winter comfort at its absolute best.",
    price:       699,
    stock:       20,
    category:    "Sweaters",
    subcategory: "Men's Sweaters",
    isActive:    true,
    images: [
      "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=500",
    ],
  },
  {
    name:        "Women's Cable Knit Sweater",
    description: "Elegant cable knit sweater in cream. Soft, warm, and incredibly stylish.",
    price:       649,
    stock:       25,
    category:    "Sweaters",
    subcategory: "Women's Sweaters",
    isActive:    true,
    images: [
      "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=500",
    ],
  },
  {
    name:        "Kids Knit Sweater",
    description: "Warm and soft knit sweater for kids. Available in fun colors for little ones.",
    price:       349,
    stock:       30,
    category:    "Sweaters",
    subcategory: "Kids Sweaters",
    isActive:    true,
    images: [
      "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=500",
    ],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // COATS
  // ══════════════════════════════════════════════════════════════════════════

  {
    name:        "Men's Wool Coat",
    description: "Luxurious wool blend coat in camel. Warm, elegant, and timeless for cold winters.",
    price:       1899,
    stock:       8,
    category:    "Coats",
    subcategory: "Men's Coats",
    isActive:    true,
    images: [
      "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=500",
    ],
  },
  {
    name:        "Women's Trench Coat",
    description: "Classic trench coat in beige. Timeless elegance that never goes out of style.",
    price:       1599,
    stock:       12,
    category:    "Coats",
    subcategory: "Women's Coats",
    isActive:    true,
    images: [
      "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=500",
    ],
  },
  {
    name:        "Kids Puffer Coat",
    description: "Warm puffer coat for kids. Lightweight insulation keeps little ones cozy all winter.",
    price:       599,
    stock:       20,
    category:    "Coats",
    subcategory: "Kids Coats",
    isActive:    true,
    images: [
      "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=500",
    ],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // ACTIVEWEAR
  // ══════════════════════════════════════════════════════════════════════════

  {
    name:        "Men's Training Shorts",
    description: "High-performance training shorts with moisture-wicking technology. Built for intense workouts.",
    price:       349,
    stock:       45,
    category:    "Activewear",
    subcategory: "Men's Activewear",
    isActive:    true,
    images: [
      "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=500",
    ],
  },
  {
    name:        "Women's Yoga Pants",
    description: "High-performance yoga pants with four-way stretch. Perfect for yoga, pilates, or everyday wear.",
    price:       449,
    stock:       50,
    category:    "Activewear",
    subcategory: "Women's Activewear",
    isActive:    true,
    images: [
      "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=500",
    ],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // SUMMER COLLECTION (Admin يشغّلها في الصيف)
  // ══════════════════════════════════════════════════════════════════════════

  {
    name:        "Linen Summer Shirt",
    description: "Breathable linen shirt in sky blue. Your perfect companion for hot summer days.",
    price:       399,
    stock:       60,
    category:    "Summer Collection",
    subcategory: "Men's Summer",
    isActive:    true,
    images: [
      "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=500",
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500",
    ],
  },
  {
    name:        "Men's Swim Shorts",
    description: "Quick-dry swim shorts in vibrant tropical print. Ready for the beach or pool.",
    price:       249,
    stock:       55,
    category:    "Summer Collection",
    subcategory: "Men's Summer",
    isActive:    true,
    images: [
      "https://images.unsplash.com/photo-1591195853828-11db59a44f43?w=500",
    ],
  },
  {
    name:        "Women's Summer Dress",
    description: "Light and airy summer dress in floral print. The ultimate warm-weather essential.",
    price:       499,
    stock:       40,
    category:    "Summer Collection",
    subcategory: "Women's Summer",
    isActive:    true,
    images: [
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=500",
      "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=500",
    ],
  },
  {
    name:        "Women's Linen Shorts",
    description: "Relaxed linen shorts in white. Cool and effortlessly chic for summer days.",
    price:       299,
    stock:       45,
    category:    "Summer Collection",
    subcategory: "Women's Summer",
    isActive:    true,
    images: [
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500",
    ],
  },
  {
    name:        "Kids Summer Set",
    description: "Matching summer set for kids. Comfortable, colorful, and easy to wear all day.",
    price:       249,
    stock:       35,
    category:    "Summer Collection",
    subcategory: "Kids Summer",
    isActive:    true,
    images: [
      "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=500",
    ],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // WINTER COLLECTION (inactive — Admin يشغّلها في الشتاء)
  // ══════════════════════════════════════════════════════════════════════════

  {
    name:        "Men's Thermal Hoodie",
    description: "Warm thermal hoodie perfect for cold winter days. Fleece-lined interior for maximum comfort.",
    price:       599,
    stock:       30,
    category:    "Winter Collection",
    subcategory: "Men's Winter",
    isActive:    false, // ← Admin يشغّله في الشتاء
    images: [
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=500",
    ],
  },
  {
    name:        "Women's Puffer Vest",
    description: "Stylish puffer vest in rose gold. Warm without the bulk, perfect layering piece.",
    price:       699,
    stock:       22,
    category:    "Winter Collection",
    subcategory: "Women's Winter",
    isActive:    false,
    images: [
      "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=500",
    ],
  },
  {
    name:        "Kids Winter Jacket",
    description: "Super warm winter jacket for kids. Water-resistant outer shell with cozy inner lining.",
    price:       799,
    stock:       18,
    category:    "Winter Collection",
    subcategory: "Kids Winter",
    isActive:    false,
    images: [
      "https://images.unsplash.com/photo-1471286174890-9c112ac5f9a3?w=500",
    ],
  },
];