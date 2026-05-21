import mongoose, { Document, Schema } from "mongoose";
export interface IReview extends Document {
    productId: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    stars: number;
    comment: string;
    images: string[];      
    isVerified: boolean;        
    isApproved: boolean;     
    createdAt: Date;
    updatedAt: Date;
}

const reviewSchema = new Schema<IReview>(
    {
        productId: {
            type: Schema.Types.ObjectId,
            ref: "Product",
            required: true,
            index: true,
        },

        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        stars: {
            type: Number,
            required: [true, "Star rating is required."],
            min: [1, "Minimum rating is 1."],
            max: [5, "Maximum rating is 5."],
        },

        comment: {
            type: String,
            required: [true, "Comment is required."],
            trim: true,
            minlength: [10, "Comment must be at least 10 characters."],
            maxlength: [1000, "Comment must not exceed 1000 characters."],
        },
        images: {
            type: [String],
            default: [],
            validate: {
                validator: (v: string[]) => v.length <= 3,
                message: "Maximum 3 images per review.",
            },
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        isApproved: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
        toJSON: {
            virtuals: true,
            transform: (_doc, ret: Record<string, unknown>) => {
                ret["__v"] = undefined;
                return ret;
            },
        },
    }
);

reviewSchema.index({ productId: 1, createdAt: -1 });
reviewSchema.index({ productId: 1, stars: 1 });
// reviewSchema.index({ userId: 1 });

reviewSchema.index(
    { productId: 1, userId: 1 },
    { unique: true }
);

export const Review = mongoose.model<IReview>("Review", reviewSchema);