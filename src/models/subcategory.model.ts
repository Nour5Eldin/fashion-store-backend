import { boolean } from "joi";
import mongoose, { Document, Schema } from "mongoose";
import { generateSlug, makeUniqueSlug } from "../utils/slug.utils";

export interface ISubcategory extends Document {
    title: string;
    slug: string;
    categoryId: mongoose.Types.ObjectId;
    isActive: boolean;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}
const subcategorySchema = new Schema<ISubcategory>(
    {
        title: {
            type: String,
            required: [true, "Subcategory title is required"],
            trim: true,
            minlength: [3, "Title must be least 3 characters"],
            maxlength: [60, "Title must not exceed 60 characters"],
        },
        slug: {
            type: String,
            unique: true,
            lowercase: true,
            trim: true,
            index: true,
        },
        categoryId: {
            type: Schema.Types.ObjectId,
            ref: "Category",
            required: [true, "Category is required"],
            index: true,
        },
        isActive: {
            type: Boolean,
            default: true
        },
        isDeleted: {
            type: Boolean,
            default: false
        },
    },
    {
        timestamps: true,
        toJSON: {
            transform: (_doc, ret: Record<string, unknown>) => {
                ret["__v"] = undefined;
                return ret;
            },
        },
    },
)
subcategorySchema.index({ slug: 1 }, { unique: true });
subcategorySchema.index({ categoryId: 1, isDeleted: 1, isActive: 1 });
subcategorySchema.index({ title: 1, categoryId: 1 }, { unique: true });

subcategorySchema.pre<ISubcategory>("save", async function () {
    if (!this.isModified("title") && this.slug) return;
    const baseSlug = generateSlug(this.title);
    const existing = await Subcategory.findOne({
        slug: baseSlug,
        _id: { $ne: this._id },
    })
    this.slug = existing ? makeUniqueSlug(baseSlug) : baseSlug
})
export const Subcategory = mongoose.model<ISubcategory>(
    "Subcategory",
    subcategorySchema
);