import mongoose, { Document, Schema } from "mongoose";
import { TestimonialStatus } from "../types/enum";

export interface ITestimonial extends Document {
    userId: mongoose.Types.ObjectId;
    comment: string;
    stars: number;
    status: TestimonialStatus;
    isApproved: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const testimonialSchema = new Schema<ITestimonial>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        comment: {
            type: String,
            required: [true, "Comment is required"],
            trim: true,
            minlength: [10, "Comment must be at least 10 characters"],
            maxlength: [500, "Comment must not exceed 500 characters"],
        },

        stars: {
            type: Number,
            required: [true, "Star rating is required"],
            min: [1, "Minimum rating is 1"],
            max: [5, "Maximum rating is 5"],
        },

        status: {
            type: String,
            enum: Object.values(TestimonialStatus),
            default: TestimonialStatus.PENDING,
        },
        isApproved: {
            type: Boolean,
            default: false,
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
testimonialSchema.index({ status: 1, createdAt: -1 });
testimonialSchema.index({ stars: 1 });
testimonialSchema.index({ isApproved: 1 });

testimonialSchema.index(
  { userId: 1, status: 1 },
  {
    unique: true,
    partialFilterExpression: {
      status: { $in: ["pending", "approved"] },
    },
  }
);
testimonialSchema.pre<ITestimonial>("save", function () {
  this.isApproved = this.status === TestimonialStatus.APPROVED;
});

export const Testimonial = mongoose.model<ITestimonial>(
  "Testimonial",
  testimonialSchema
);