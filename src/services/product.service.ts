import { ApiError } from "../utils/ApiError";
import { productRepository, ProductFilters } from "../repositories/product.repository";
import { categoryRepository } from "../repositories/category.repository";
import { cartRepository } from "../repositories/cart.repository";
import { IProduct } from "../models/product.model";
import { cloudinary } from "../config/cloudinary";
import { subcategoryRepository } from "../repositories";
import mongoose from "mongoose";

export interface CreateProductDTO {
    name: string;
    description: string;
    price: number;
    stock: number;
    categoryId: string;
    subCategoryId: string;
    isActive?: boolean;
    imagePath: string[];
}
export interface UpdateProductDTO {
    name?: string;
    description?: string;
    price?: number;
    stock?: number;
    categoryId?: mongoose.Types.ObjectId | string;
    subCategoryId?: mongoose.Types.ObjectId | string;
    isActive?: boolean;
    imagePath?: string[];
}
export class ProductService {
    async getProducts(filters: ProductFilters) {
        return productRepository.getProducts(filters);
    }
    async getProductBySlug(slug: string): Promise<IProduct> {
        const product = await productRepository.findOne({
            slug,
            isDeleted: false,
            isActive: true,
        });

        if (!product) {
            throw ApiError.notFound("Product not found.");
        }

        return product;
    }
    async getProductById(id: string): Promise<IProduct> {
        const product = await productRepository.findById(id);

        if (!product || product.isDeleted) {
            throw ApiError.notFound("Product not found.");
        }

        return product;
    }
    async getNewArrivals(limit = 8): Promise<IProduct[]> {
        return productRepository.getNewArrivals(limit);
    }
    async getBestSellers(limit = 8): Promise<IProduct[]> {
        return productRepository.getBestSellers(limit);
    }
    async getRelatedProducts(
        subCategoryId: string,
        excludeId: string
    ): Promise<IProduct[]> {
        return productRepository.getRelatedProducts(subCategoryId, excludeId);
    }


    async createProduct(dto: CreateProductDTO): Promise<IProduct> {

        const category = await categoryRepository.findById(dto.categoryId);
        if (!category || category.isDeleted) {
            throw ApiError.notFound("Category not found.");
        }
        const subcategory = await subcategoryRepository.findById(dto.subCategoryId);
        if (!subcategory || subcategory.isDeleted) {
            throw ApiError.notFound("Subcategory not found.");
        }

        if (subcategory.categoryId.toString() !== dto.categoryId) {
            throw ApiError.badRequest(
                "Subcategory does not belong to the selected category."
            );
        }
        const uploadedImages = await Promise.all(
            dto.imagePath.map(path =>
                cloudinary.uploader.upload(path, {
                    folder: "fashion-store/products",
                    transformation: [{ quality: "auto", fetch_format: "auto" }],
                })
            )
        );
        const imageUrls = uploadedImages.map(r => r.secure_url);

        return productRepository.create({
            name: dto.name,
            description: dto.description,
            price: dto.price,
            stock: dto.stock,
            categoryId: dto.categoryId as unknown as typeof category._id,
            subCategoryId: dto.subCategoryId as unknown as typeof subcategory._id,
            isActive: dto.isActive ?? true,
            images: imageUrls,
            mainImage: imageUrls[0],
        });
    }
    async updateProduct(
        id: string,
        dto: UpdateProductDTO
    ): Promise<IProduct> {

        const product = await productRepository.findById(id);
        if (!product || product.isDeleted) {
            throw ApiError.notFound("Product not found.");
        }
        let imageUrls: string[] | undefined;
        if (dto.imagePath && dto.imagePath.length > 0) {
            const uploadResults = await Promise.all(
                dto.imagePath.map(path =>
                    cloudinary.uploader.upload(path, {
                        folder: "fashion-store/products",
                        transformation: [{ quality: "auto", fetch_format: "auto" }],
                    })
                )
            );
            imageUrls = uploadResults.map(r => r.secure_url);
        }
        if (dto.price && dto.price !== product.price) {
            await cartRepository.flagPriceChanged(id);
        }
        const finalData: Partial<IProduct> = {};

        if (dto.name) finalData.name = dto.name;
        if (dto.description) finalData.description = dto.description;
        if (dto.price) finalData.price = dto.price;
        if (dto.stock !== undefined) finalData.stock = dto.stock;
        if (dto.isActive !== undefined) finalData.isActive = dto.isActive;
        if (imageUrls) {
            finalData.images = imageUrls;
            finalData.mainImage = imageUrls[0]
        };

        if (dto.categoryId) {
            finalData.categoryId = new mongoose.Types.ObjectId(
                dto.categoryId as string
            ) as unknown as typeof product.categoryId;
        }

        if (dto.subCategoryId) {
            finalData.subCategoryId = new mongoose.Types.ObjectId(
                dto.subCategoryId as string
            ) as unknown as typeof product.subCategoryId;
        }

        const updated = await productRepository.updateProduct(id, finalData);
        if (!updated) throw ApiError.notFound("Product not found.");

        return updated;
    }
    async softDeleteProduct(id: string): Promise<void> {
        const product = await productRepository.findById(id);
        if (!product) throw ApiError.notFound("Product not found.");

        await productRepository.updateById(id, { isDeleted: true });
    }
    async toggleActive(id: string, isActive: boolean): Promise<IProduct> {
        const product = await productRepository.findById(id);
        if (!product || product.isDeleted) {
            throw ApiError.notFound("Product not found.");
        }

        const updated = await productRepository.updateById(id, { isActive });
        if (!updated) throw ApiError.notFound("Product not found.");

        return updated;
    }
    async getAdminProducts(filters: {
        categoryId?: string;
        subCategoryId?: string;
        isActive?: boolean;
        isDeleted?: boolean;
        page?: number;
        limit?: number;
    }) {
        const filter: Record<string, unknown> = {};

        if (filters.categoryId) filter["categoryId"] = filters.categoryId;
        if (filters.subCategoryId) filter["subCategoryId"] = filters.subCategoryId;
        if (filters.isActive !== undefined) filter["isActive"] = filters.isActive;
        if (filters.isDeleted !== undefined) filter["isDeleted"] = filters.isDeleted;

        return productRepository.paginate(filter, {
            page: filters.page,
            limit: filters.limit || 20,
            sort: { createdAt: -1 },
            populate: ["categoryId", "subCategoryId"],
        });
    }
    async getLowStockProducts(): Promise<IProduct[]> {
        return productRepository.getLowStockProducts();
    }
}

export const productService = new ProductService();