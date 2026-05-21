import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { categoryRepository, subcategoryRepository } from "../repositories";
import { ApiError } from "../utils/ApiError";
import { getParam } from "../utils/request.utils";

export class CategoryController {

    getCategories = asyncHandler(async (req: Request, res: Response) => {
        const categories = await categoryRepository.getActiveCategories();
        res.status(200).json(ApiResponse.ok(categories));
    });
    getHeaderCategories = asyncHandler(async (req: Request, res: Response) => {
        const titlesParam = req.query.titles as string;
        const titles = titlesParam ? titlesParam.split(',') : [];
        const categories = await categoryRepository.getHeaderCategories(titles);
        res.status(200).json(ApiResponse.ok(categories));
    });
    getAdminCategories = asyncHandler(async (req: Request, res: Response) => {
        const result = await categoryRepository.paginate(
            {},
            { sort: { createdAt: -1 }, page: Number(req.query.page || 1) }
        );
        res.status(200).json(ApiResponse.ok(result));
    });
    createCategory = asyncHandler(async (req: Request, res: Response) => {
        const category = await categoryRepository.create(req.body);
        res.status(201).json(
            ApiResponse.created(category, "Category created successfully.")
        );
    });
    updateCategory = asyncHandler(async (req: Request, res: Response) => {
        const category = await categoryRepository.updateCategory(
            getParam(req.params.id),
            req.body
        );
        if (!category) throw ApiError.notFound("Category not found.");

        res.status(200).json(
            ApiResponse.ok(category, "Category updated successfully.")
        );
    });
    deleteCategory = asyncHandler(async (req: Request, res: Response) => {
        const category = await categoryRepository.softDelete(getParam(req.params.id));
        if (!category) throw ApiError.notFound("Category not found.");

        res.status(200).json(
            ApiResponse.ok(null, "Category deleted successfully.")
        );
    });
    toggleActive = asyncHandler(async (req: Request, res: Response) => {
        const { isActive } = req.body;
        const category = await categoryRepository.toggleActive(
            getParam(req.params.id),
            isActive
        );
        if (!category) throw ApiError.notFound("Category not found.");

        res.status(200).json(
            ApiResponse.ok(
                category,
                `Category ${isActive ? "activated" : "deactivated"} successfully.`
            )
        );
    });
    getSubcategories = asyncHandler(async (req: Request, res: Response) => {
        const { categoryId } = req.query;
        if (!categoryId) {
            res.status(400).json(
                ApiResponse.badRequest("categoryId is required.")
            );
            return;
        }

        const subcategories = await subcategoryRepository.getByCategoryId(
            categoryId as string
        );
        res.status(200).json(ApiResponse.ok(subcategories));
    });
    createSubcategory = asyncHandler(async (req: Request, res: Response) => {
        const subcategory = await subcategoryRepository.create(req.body);
        res.status(201).json(
            ApiResponse.created(subcategory, "Subcategory created successfully.")
        );
    });
    updateSubcategory = asyncHandler(async (req: Request, res: Response) => {
        const subcategory = await subcategoryRepository.updateSubcategory(
            getParam(req.params.id),
            req.body
        );
        if (!subcategory) throw ApiError.notFound("Subcategory not found.");

        res.status(200).json(
            ApiResponse.ok(subcategory, "Subcategory updated successfully.")
        );
    });
    deleteSubcategory = asyncHandler(async (req: Request, res: Response) => {
        const subcategory = await subcategoryRepository.updateById(
            getParam(req.params.id),
            { isDeleted: true, isActive: false }
        );
        if (!subcategory) throw ApiError.notFound("Subcategory not found.");

        res.status(200).json(
            ApiResponse.ok(null, "Subcategory deleted successfully.")
        );
    });
   getCategoriesWithSubs = asyncHandler(async (req, res) => {
  const result = await categoryRepository.getCategoriesWithSubs();
  res.status(200).json(ApiResponse.ok(result));
});
}

export const categoryController = new CategoryController();