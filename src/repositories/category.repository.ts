import { Category, ICategory } from "../models/category.model";
import { Subcategory, ISubcategory } from "../models/subcategory.model";
import { BaseRepository } from "./base.repository";

export class CategoryRepository extends BaseRepository<ICategory> {
    constructor() {
        super(Category);
    }
    async getActiveCategories(): Promise<ICategory[]> {
        return this.findMany(
            { isDeleted: false, isActive: true },
            { sort: { title: 1 } }
        );
    }

    async softDelete(categoryId: string): Promise<ICategory | null> {
        const [category] = await Promise.all([
            this.updateById(categoryId, { isDeleted: true, isActive: false }),
            Subcategory.updateMany(
                { categoryId, isDeleted: false },
                { isDeleted: true, isActive: false }
            ),
        ]);
        return category;
    }

    async toggleActive(
        categoryId: string,
        isActive: boolean
    ): Promise<ICategory | null> {
        const [category] = await Promise.all([
            this.updateById(categoryId, { isActive }),
            Subcategory.updateMany({ categoryId }, { isActive }),
        ]);
        return category;
    }
    async updateCategory(
        id: string,
        data: Partial<ICategory>
    ): Promise<ICategory | null> {
        const category = await Category.findById(id);
        if (!category) return null;
        Object.assign(category, data);
        return category.save();
    }
    async getCategoriesWithSubs() {
      return Category.find({ isDeleted: false, isActive: true })
        .select('_id title slug')
        .populate({
          path: 'subcategories',
          match: { isDeleted: false, isActive: true },
          select: '_id title slug',
        })
        .lean({ virtuals: true });
    }

    // New method: fetch only selected top‑level categories (e.g., Men, Women) with their subcategories
    async getHeaderCategories(titles: string[]) {
      return Category.find({
        title: { $in: titles.map(t => new RegExp(`^${t}$`, 'i')) },
        isDeleted: false,
        isActive: true,
      })
        .select('_id title slug')
        .populate({
          path: 'subcategories',
          match: { isDeleted: false, isActive: true },
          select: '_id title slug',
        })
        .lean({ virtuals: true });
    }
}

export class SubcategoryRepository extends BaseRepository<ISubcategory> {
    constructor() {
        super(Subcategory);
    }

    async getByCategoryId(categoryId: string): Promise<ISubcategory[]> {
        return this.findMany(
            { categoryId, isDeleted: false, isActive: true },
            { sort: { title: 1 } }
        );
    }
    async updateCategory(
        id: string,
        data: Partial<ICategory>
    ): Promise<ICategory | null> {
        const category = await Category.findById(id);
        if (!category) return null;
        Object.assign(category, data);
        return category.save();
    }
    
}

export const categoryRepository = new CategoryRepository();
