import mongoose, { Document, Schema } from "mongoose";

export interface IHomeSlide extends Document {
    image: string;
    label: string;
    title: string;
    description: string;
    cta: string;
    link: string;
    order: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const homeSlideSchema = new Schema<IHomeSlide>(
    {
        image: {
            type: String,
            required: [true, "Slide image URL is required"],
            trim: true,
        },
        label: {
            type: String,
            required: [true, "Slide label is required"],
            trim: true,
        },
        title: {
            type: String,
            required: [true, "Slide title is required"],
            trim: true,
        },
        description: {
            type: String,
            required: [true, "Slide description is required"],
            trim: true,
        },
        cta: {
            type: String,
            required: [true, "Slide CTA text is required"],
            trim: true,
        },
        link: {
            type: String,
            required: [true, "Slide Link URL/path is required"],
            trim: true,
        },
        order: {
            type: Number,
            default: 0,
        },
        isActive: {
            type: Boolean,
            default: true,
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
    }
);

homeSlideSchema.index({ isActive: 1, order: 1 });

export const HomeSlide = mongoose.model<IHomeSlide>("HomeSlide", homeSlideSchema);
