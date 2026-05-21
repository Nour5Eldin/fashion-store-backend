import { CartItem, ICartItem } from "../models/cart.model";
import { Product } from "../models/product.model";
import { BaseRepository } from "./base.repository";

export class CartRepository extends BaseRepository<ICartItem> {
    constructor() {
        super(CartItem);
    }
    async getUserCart(userId: string): Promise<ICartItem[]> {
        const items = await CartItem
            .find({ userId })
            .populate("productId")
            .exec();

        const updatePromises = items.map(async (item) => {
            const product = item.productId as unknown as { price: number; _id: string };
            if (!product) return item;

            const priceChanged = product.price !== item.price;

            if (priceChanged !== item.isPriceChanged) {
                item.isPriceChanged = priceChanged;
                await item.save();
            }

            return item;
        });

        return Promise.all(updatePromises);
    }
    async addItem(
        userId: string,
        productId: string,
        quantity: number,
        price: number
    ): Promise<ICartItem> {
        const existing = await CartItem.findOne({ userId, productId }).exec();

        if (existing) {
            existing.quantity += quantity;
            existing.totalPrice = existing.price * existing.quantity;
            return existing.save();
        }

        return CartItem.create({
            userId,
            productId,
            quantity,
            price,
            totalPrice: price * quantity,
            isPriceChanged: false,
        });
    }
    async updateQuantity(
        userId: string,
        itemId: string,
        quantity: number
    ): Promise<ICartItem | null> {
        const item = await CartItem.findOne({ _id: itemId, userId }).exec();
        if (!item) return null;

        item.quantity = quantity;
        item.totalPrice = item.price * quantity;
        return item.save();
    }
    async removeItem(userId: string, itemId: string): Promise<boolean> {
        const result = await CartItem.deleteOne({ _id: itemId, userId }).exec();
        return result.deletedCount > 0;
    }
    async clearCart(userId: string): Promise<void> {
        await CartItem.deleteMany({ userId }).exec();
    }
    async mergeGuestCart(
        userId: string,
        guestItems: Array<{
            productId: string;
            quantity: number;
            price: number;
        }>
    ): Promise<void> {
        for (const guestItem of guestItems) {
            const product = await Product.findById(guestItem.productId).exec();
            if (!product || !product.isActive || product.isDeleted) continue;

            const existing = await CartItem.findOne({
                userId,
                productId: guestItem.productId,
            }).exec();

            if (existing) {
                const newQty = Math.min(
                    existing.quantity + guestItem.quantity,
                    product.stock
                );
                existing.quantity = newQty;
                existing.totalPrice = existing.price * newQty;
                await existing.save();
            } else {
                const qty = Math.min(guestItem.quantity, product.stock);
                if (qty > 0) {
                    await CartItem.create({
                        userId,
                        productId: guestItem.productId,
                        quantity: qty,
                        price: product.price,
                        totalPrice: product.price * qty,
                    });
                }
            }
        }
    }
    async getActiveItemsCount(userId: string): Promise<number> {
        return CartItem.countDocuments({
            userId,
            isPriceChanged: false,
        }).exec();
    }
    async flagPriceChanged(productId: string): Promise<void> {
        await CartItem.updateMany(
            { productId, isPriceChanged: false },
            { isPriceChanged: true }
        ).exec();
    }
}

export const cartRepository = new CartRepository();