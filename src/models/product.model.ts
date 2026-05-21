import mongoose, { Document, Schema } from "mongoose";
import { generateSlug, makeUniqueSlug } from "../utils/slug.utils";

export interface IProduct extends Document {
    name: string;
    slug: string;
    description: string;
    price: number;
    images: string[];
    mainImage: string;
    stock: number;
    categoryId: mongoose.Types.ObjectId;
    subCategoryId: mongoose.Types.ObjectId;
    isActive: boolean;
    isDeleted: boolean;
    totalSold: number;
    createdAt: Date;
    updatedAt: Date;
}
const productSchema = new Schema<IProduct>(
    {
        name: {
            type: String,
            required: [true, "Product name is required"],
            trim: true,
            minlength: [3, "Name must at least 3 characters"],
            maxlength: [100, "Name must not exceed 100 characters"],
        },
        slug: {
            type: String,
            unique: true,
            lowercase: true,
            trim: true,
        },
        description: {
            type: String,
            required: [true, "Description is required"],
            trim: true
        },
        price: {
            type: Number,
            required: [true, "Price is required"],
            min: [0.01, "Price must be greater than 0"],
        },
        images: {
            type: [String],
            required: true,
            validate: {
                validator: (v: string[]) => v.length >= 1 && v.length <= 5,
                message: "Product must have bettween 1 and 5 images"
            },
        },
        mainImage: {
            type: String,
            required: [true, "Main image is required"],
        },
        stock: {
            type: Number,
            required: [true, "Stock is required"],
            min: [0, "Stock cannot be negative"],
            default: 0,
        },
        categoryId: {
            type: Schema.Types.ObjectId,
            ref: "Category",
            required: [true, "Category is required"],
            index: true,
        },
        subCategoryId: {
            type: Schema.Types.ObjectId,
            ref: "Subcategory",
            required: [true, "Subcategory is required"],
            index: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
        totalSold: {
            type: Number,
            default: 0,
            min: 0,
        },
    }
)
productSchema.index({ slug: 1 }, { unique: true });
productSchema.index({ isDeleted: 1, isActive: 1 });
productSchema.index({ categoryId: 1, subCategoryId: 1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ totalSold: -1 });
productSchema.index({ price: 1 });
productSchema.index({ name: "text", description: "text" });
productSchema.pre<IProduct>("save", async function () {
    if (!this.isModified("name") && this.slug) return;

    const baseSlug = generateSlug(this.name);

    const existing = await Product.findOne({
        slug: baseSlug,
        _id: { $ne: this._id },
    });

    this.slug = existing ? makeUniqueSlug(baseSlug) : baseSlug;
});
export const Product = mongoose.model<IProduct>("Product", productSchema);