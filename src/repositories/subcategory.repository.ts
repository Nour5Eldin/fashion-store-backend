import { ISubcategory, Subcategory } from "../models/subcategory.model";
import { BaseRepository } from "./base.repository";

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
    async updateSubcategory(
        id: string,
        data: Partial<ISubcategory>
    ): Promise<ISubcategory | null> {
        const subcategory = await Subcategory.findById(id);
        if (!subcategory) return null;
        Object.assign(subcategory, data);
        return subcategory.save();
    }

}
export const subcategoryRepository = new SubcategoryRepository();