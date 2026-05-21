import mongoose, { Document, Schema } from "mongoose";
import { AddressLabel } from "../types/enum";

export interface IAddress extends Document{
    userId: mongoose.Types.ObjectId;
    label: AddressLabel;
    addressText: string;
    isDefault: boolean;
    createdAt: Date;
    updatedAt: Date;
}
const addressSchema = new Schema<IAddress>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        label: {
            type: String,
            enum: Object.values(AddressLabel),
            required: [true, "Address label is required"],
        },
        addressText: {
            type: String,
            required: [true, "Address text is required"],
            trim: true,
            minLength: [10, "Address must be at least 10 characters"],
        },
        isDefault: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
    }
);
addressSchema.index({ userId: 1, isDefault: 1 });
addressSchema.pre<IAddress>("save", async function (next) {
    if (this.isModified("isDefault") && this.isDefault) {
        await Address.updateMany(
            { userId: this.userId, _id: { $ne: this._id } },
            { isDefault: false }
        );
    }
})

export const Address = mongoose.model<IAddress>("Address", addressSchema);