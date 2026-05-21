import mongoose, { Document, Schema } from "mongoose";
import { generateSlug, makeUniqueSlug } from "../utils/slug.utils";


export interface ICategory extends Document{
    title: string;
    slug: string;
    isActive: boolean;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}
const categorySchema = new Schema<ICategory>(
    {
        title: {
            type: String,
            required: [true, "Category title is required"],
            trim: true,
            minlength: [3, "Title must be at least 3 characters"],
            maxlength: [60, "Title must not exceed 60 characters"],
            unique: true
        },
        slug: {
            type: String,
            unique: true,
            lowercase: true,
            trim: true,
            index: true
        },
        isActive: {
            type: Boolean,
            default: true
        },
        isDeleted: {
            type: Boolean,
            default: false,
        }
    },
    {
        timestamps: true,
        toJSON: {
            transform: (_doc, ret: Record<string , unknown>) => {
                ret["__v"] = undefined;
                return ret;
            },
        },
    }
)
categorySchema.index({ slug: 1 }, { unique: true });
categorySchema.index({ isDeleted: 1, isActive: 1 });


categorySchema.pre<ICategory>("save", async function () {
    if (!this.isModified("title") && this.title) return;
    const baseSlug = generateSlug(this.title);
    const existing = await Category.findOne({
    slug: baseSlug,
    _id: { $ne: this._id },
    });
    this.slug = existing ? makeUniqueSlug(baseSlug) : baseSlug;
})

categorySchema.virtual('subcategories', {
  ref: 'Subcategory',
  localField: '_id',
  foreignField: 'categoryId',
});

export const Category = mongoose.model<ICategory>("Category", categorySchema);