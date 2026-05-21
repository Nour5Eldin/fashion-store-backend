import { Product, IProduct } from "../models/product.model";
import { BaseRepository } from "./base.repository"

export interface ProductFilters {
    categoryId?: string;
    subCategoryId?: string;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
    page?: number;
    limit?: number;
    sortBy?: "newest" | "price_asc" | "price_desc" | "best_sellers";
    isSale?: boolean;
}

export class ProductRepository extends BaseRepository<IProduct> {
    constructor() {
        super(Product);
    }
    private buildFilter(filters: ProductFilters): Record<string, unknown> {
        const query: Record<string, unknown> = {
            isDeleted: false,
            isActive: true,
        };

        if (filters.categoryId) query["categoryId"] = filters.categoryId;
        if (filters.subCategoryId) query["subCategoryId"] = filters.subCategoryId;
        if (filters.isSale) {
            query["discountPrice"] = {$gt: 0};
        }
        if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
            const price: Record<string, number> = {};
            if (filters.minPrice !== undefined) price["$gte"] = filters.minPrice;
            if (filters.maxPrice !== undefined) price["$lte"] = filters.maxPrice;
            query["price"] = price;
        }

        if (filters.search) {
            query["$text"] = { $search: filters.search };
        }

        return query;
    }

    private buildSort(
        sortBy?: string
    ): Record<string, 1 | -1> {
        const sorts: Record<string, Record<string, 1 | -1>> = {
            newest: { createdAt: -1 },
            price_asc: { price: 1 },
            price_desc: { price: -1 },
            best_sellers: { totalSold: -1 },
        };
        return sorts[sortBy || "newest"] || { createdAt: -1 };
    }

    async getProducts(filters: ProductFilters) {
        const filter = this.buildFilter(filters);
        const sort = this.buildSort(filters.sortBy);

        return this.paginate(filter, {
            page: filters.page,
            limit: filters.limit || 20,
            sort,
            populate: ["categoryId", "subCategoryId"],
        });
    }

    async getNewArrivals(limit = 8): Promise<IProduct[]> {
        return this.findMany(
            { isDeleted: false, isActive: true },
            { sort: { createdAt: -1 }, limit }
        );
    }
    async getBestSellers(limit = 8): Promise<IProduct[]> {
        return this.findMany(
            { isDeleted: false, isActive: true },
            { sort: { totalSold: -1 }, limit }
        );
    }
    async getRelatedProducts(
        subCategoryId: string,
        excludeId: string,
        limit = 6
    ): Promise<IProduct[]> {
        return this.findMany(
            {
                subCategoryId,
                _id: { $ne: excludeId },
                isDeleted: false,
                isActive: true,
            },
            { limit, sort: { createdAt: -1 } }
        );
    }
    async getLowStockProducts(): Promise<IProduct[]> {
        return this.findMany(
            { stock: { $lte: 3, $gt: 0 }, isDeleted: false },
            { sort: { stock: 1 } }
        );
    }
    async incrementTotalSold(
        productId: string,
        quantity: number
    ): Promise<void> {
        await this.updateById(productId, {
            $inc: { totalSold: quantity },
        });
    }
    async decrementStock(
        productId: string,
        quantity: number
    ): Promise<IProduct | null> {
        return this.updateOne(
            {
                _id: productId,
                stock: { $gte: quantity },
            },
            { $inc: { stock: -quantity } }
        );
    }
    async incrementStock(
        productId: string,
        quantity: number
    ): Promise<void> {
        await this.updateById(productId, {
            $inc: { stock: quantity },
        });
    }
    async getTopProducts(limit = 10): Promise<IProduct[]> {
        return this.findMany(
            { isDeleted: false },
            { sort: { totalSold: -1 }, limit }
        );
    }
    async updateProduct(
        id: string,
        data: Partial<IProduct>
    ): Promise<IProduct | null> {
        const product = await Product.findById(id);
        if (!product) return null;
        Object.assign(product, data);
        return product.save();
    }
}


export const productRepository = new ProductRepository();