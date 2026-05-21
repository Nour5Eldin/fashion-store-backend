import mongoose, { Document, Schema } from "mongoose";
import { OrderStatus } from "../types/enum";

export interface IOrderProduct {
    productId: mongoose.Types.ObjectId;
    name: string;
    price: number;
    quantity: number;
    image: string;
}
export interface IStatusLog {
    status: OrderStatus;
    changedAt: Date;
    changedBy: mongoose.Types.ObjectId;
    note?: string;
}
export interface IOrder extends Document {
    userId: mongoose.Types.ObjectId;
    address: string;
    phoneNumber: string;
    totalPrice: number;
    status: OrderStatus;
    products: IOrderProduct[];
    statusLog: IStatusLog[];
    refundRequested: boolean;
    refundReason?: string;
    refundStatus?: "pending" | "approved" | "refused";
    createdAt: Date;
    updatedAt: Date;
}
const orderProductSchema = new Schema<IOrderProduct>(
    {
        productId: {
            type: Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true, min: 1 },
        image: { type: String, required: true },
    },
    { _id: false }
)
const statusLogSchema = new Schema<IStatusLog>(
    {
        status: {
            type: String,
            enum: Object.values(OrderStatus),
            required: true,
        },
        changedAt: {
            type: Date,
            default: Date.now,
        },
        changedBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        note: { type: String },
    },
    { _id: false }
);
const orderSchema = new Schema<IOrder>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        address: {
            type: String,
            required: [true, "Delivery address is required"],
            minlength: [10, "Address must be at least 10 characters"],
        },

        phoneNumber: {
            type: String,
            required: [true, "Phone number is required"],
            match: [
                /^\+[1-9]\d{6,14}$/,
                "Invalid phone number format. Include country code (e.g. +",
            ],
        },

        totalPrice: {
            type: Number,
            required: true,
            min: 0,
        },

        status: {
            type: String,
            enum: Object.values(OrderStatus),
            default: OrderStatus.PENDING,
        },
        products: {
            type: [orderProductSchema],
            required: true,
            validate: {
                validator: (v: IOrderProduct[]) => v.length > 0,
                message: "Order must contain at least one product",
            },
        },

        statusLog: {
            type: [statusLogSchema],
            default: [],
        },

        refundRequested: {
            type: Boolean,
            default: false,
        },

        refundReason: {
            type: String,
            minlength: [20, "Refund reason must be at least 20 characters"],
        },

        refundStatus: {
            type: String,
            enum: ["pending", "approved", "refused"],
        },
    },
    {
        timestamps: true,
        toJSON: {
            transform: (_doc, ret: Record<string, unknown>) => {
                ret["__v"] = undefined;
                return ret;
            },
        }
    }
)
orderSchema.index({ userId: 1, createdAt: -1 });
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ status: 1, createdAt: -1 });

export const Order = mongoose.model<IOrder>("Order", orderSchema);