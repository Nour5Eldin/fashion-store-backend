import mongoose, { Document, Schema } from "mongoose";

export interface ICartItem extends Document {
  userId: mongoose.Types.ObjectId;
  productId: mongoose.Types.ObjectId;
  quantity: number;
  price: number;       
  totalPrice: number; 
  isPriceChanged: boolean;
  createdAt: Date;
  updatedAt: Date;
}
const cartItemSchema = new Schema<ICartItem>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        productId: {
            type: Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
            min: [1, "Quantity must be at least 1"],
            default: 1,
        },
        price: {
            type: Number,
            required: true,
            min: 0,
        },
        totalPrice: {
            type: Number,
            required: true,
            min: 0,
        },
        isPriceChanged: {
            type: Boolean,
            default: false,
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
cartItemSchema.index({ userId: 1, productId: 1 }, { unique: true });
cartItemSchema.pre<ICartItem>("save", function() {
  this.totalPrice = this.price * this.quantity;
});
export const CartItem = mongoose.model<ICartItem>("CartItem", cartItemSchema);