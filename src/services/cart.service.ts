import { ICartItem } from "../models/cart.model";
import { cartRepository, productRepository } from "../repositories";
import { ApiError } from "../utils/ApiError";

export class CartService {
    async getUserCart(userId: string): Promise<{
        activeItems: ICartItem[];
        priceChangedItems: ICartItem[];
        subtotal: number;
        totalItems: number;
    }> {
        const items = await cartRepository.getUserCart(userId);
        const activeItems = items.filter(i => !i.isPriceChanged);
        const priceChangedItems = items.filter(i => i.isPriceChanged);
        const subtotal = activeItems.reduce(
            (sum, item) => sum + item.totalPrice,
            0
        );

        return {
            activeItems,
            priceChangedItems,
            subtotal,
            totalItems: activeItems.length,
        };
    }
    async addItem(
        userId: string,
        productId: string,
        quantity: number
    ): Promise<ICartItem> {
        const product = await productRepository.findById(productId);
        if (!product || !product.isActive || product.isDeleted) {
            throw ApiError.notFound("Product not found.");
        }
        if (product.stock === 0) {
            throw ApiError.badRequest("Product is out of stock.");
        }
        const safeQuantity = Math.min(quantity, product.stock);
        const existingItem = await cartRepository.findOne({ userId, productId });
        if (existingItem) {
            const newQty = Math.min(
                existingItem.quantity + safeQuantity,
                product.stock
            );
            return cartRepository.updateQuantity(
                userId,
                existingItem._id.toString(),
                newQty
            ) as Promise<ICartItem>;
        }

        return cartRepository.addItem(
            userId,
            productId,
            safeQuantity,
            product.price
        );

    }
    async updateQuantity(
        userId: string,
        itemId: string,
        quantity: number
    ): Promise<ICartItem> {
        const item = await cartRepository.findOne({ _id: itemId, userId });
        if (!item) throw ApiError.notFound("Cart item not found.");
        const product = await productRepository.findById(
            item.productId.toString()
        );
        if (!product) throw ApiError.notFound("Product no longer available.");
        const safeQty = Math.min(quantity, product.stock);

        const updated = await cartRepository.updateQuantity(
            userId,
            itemId,
            safeQty
        );
        if (!updated) throw ApiError.notFound("Cart item not found.");

        return updated;
    }
    async removeItem(userId: string, itemId: string): Promise<void> {
        const removed = await cartRepository.removeItem(userId, itemId);
        if (!removed) throw ApiError.notFound("Cart item not found.");
    }
    async reAddPriceChangedItem(
        userId: string,
        itemId: string
    ): Promise<ICartItem> {
        const item = await cartRepository.findOne({ _id: itemId, userId });
        if (!item) throw ApiError.notFound("Cart item not found.");

        const product = await productRepository.findById(
            item.productId.toString()
        );
        if (!product || !product.isActive || product.isDeleted) {
            throw ApiError.badRequest("Product is no longer available.");
        }

        if (product.stock === 0) {
            throw ApiError.badRequest("Product is out of stock.");
        }
        await cartRepository.removeItem(userId, itemId);

        return cartRepository.addItem(
            userId,
            item.productId.toString(),
            Math.min(item.quantity, product.stock),
            product.price
        );
    }
    async clearCart(userId: string): Promise<void> {
    await cartRepository.clearCart(userId);
    }
    async getCartCount(userId: string): Promise<number> {
    return cartRepository.getActiveItemsCount(userId);
  }
}
export const cartService = new CartService();