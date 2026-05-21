import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { productService } from "../services/product.service";
import { getParam } from "../utils/request.utils";

export class ProductController {
    getProducts = asyncHandler(async (req: Request, res: Response) => {
        const filters = {
            categoryId: req.query.categoryId as string,
            subCategoryId: req.query.subCategoryId as string,
            minPrice: req.query.minPrice ? Number(req.query.minPrice) : undefined,
            maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined,
            search: req.query.search as string,
            page: req.query.page ? Number(req.query.page) : 1,
            limit: req.query.limit ? Number(req.query.limit) : 20,
            sortBy: req.query.sortBy as "newest" | "price_asc" | "price_desc" | "best_sellers",
            isSale: req.query.filter === 'sale' ? true : undefined,
        };

        const result = await productService.getProducts(filters);
        res.status(200).json(ApiResponse.ok(result));
    });

    getNewArrivals = asyncHandler(async (req: Request, res: Response) => {
        const limit = req.query.limit ? Number(req.query.limit) : 8;
        const result = await productService.getNewArrivals(limit);
        res.status(200).json(ApiResponse.ok(result));
    });

    getBestSellers = asyncHandler(async (req: Request, res: Response) => {
        const limit = req.query.limit ? Number(req.query.limit) : 8;
        const result = await productService.getBestSellers(limit);
        res.status(200).json(ApiResponse.ok(result));
    });

    getProductBySlug = asyncHandler(async (req: Request, res: Response) => {
        const product = await productService.getProductBySlug(getParam(req.params.slug));
        res.status(200).json(ApiResponse.ok(product));
    });
    getRelatedProducts = asyncHandler(async (req: Request, res: Response) => {
        const product = await productService.getProductBySlug(getParam(req.params.slug));
        const related = await productService.getRelatedProducts(
            product.subCategoryId.toString(),
            product._id.toString()
        );
        res.status(200).json(ApiResponse.ok(related));
    });
    getAdminProducts = asyncHandler(async (req: Request, res: Response) => {
        const filters = {
            categoryId: req.query.categoryId as string,
            subCategoryId: req.query.subCategoryId as string,
            isActive: req.query.isActive !== undefined
                ? req.query.isActive === "true" : undefined,
            isDeleted: req.query.isDeleted !== undefined
                ? req.query.isDeleted === "true" : undefined,
            page: req.query.page ? Number(req.query.page) : 1,
            limit: req.query.limit ? Number(req.query.limit) : 20,
        };

        const result = await productService.getAdminProducts(filters);
        res.status(200).json(ApiResponse.ok(result));
    });

    createProduct = asyncHandler(async (req: Request, res: Response) => {
        const files = req.files as Express.Multer.File[];
        if (!files || files.length === 0) {
            res.status(400).json(ApiResponse.badRequest("Product image is required."));
            return;
        }

        const product = await productService.createProduct({
            ...req.body,
            imagePath: files.map(f => f.path),
        });

        res.status(201).json(
            ApiResponse.created(product, "Product created successfully.")
        );
    });
    updateProduct = asyncHandler(async (req: Request, res: Response) => {
        const files = req.files as Express.Multer.File[];
    const dto = {
      ...req.body,
      ...(files && files.length > 0 ? { imagePath: files.map(f => f.path) } : {}),
    };

    const product = await productService.updateProduct(getParam(req.params.id), dto);
    res.status(200).json(
      ApiResponse.ok(product, "Product updated successfully.")
    );
     });
    deleteProduct = asyncHandler(async (req: Request, res: Response) => {
    await productService.softDeleteProduct(getParam(req.params.id));
    res.status(200).json(
      ApiResponse.ok(null, "Product deleted successfully.")
    );
  });

    toggleActive = asyncHandler(async (req: Request, res: Response) => {
    const { isActive } = req.body;
    const product = await productService.toggleActive(getParam(req.params.id), isActive);
    res.status(200).json(
      ApiResponse.ok(product, `Product ${isActive ? "activated" : "deactivated"}.`)
    );
    });
     getLowStock = asyncHandler(async (req: Request, res: Response) => {
    const products = await productService.getLowStockProducts();
    res.status(200).json(ApiResponse.ok(products));
     });
    
}
export const productController = new ProductController();