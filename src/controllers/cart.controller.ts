import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { cartService } from "../services/cart.service";
import { getParam } from "../utils/request.utils";

export class CartController {

    getCart = asyncHandler(async (req: Request, res: Response) => {
        const result = await cartService.getUserCart(req.user!.userId);
        res.status(200).json(ApiResponse.ok(result));
    });
    addItem = asyncHandler(async (req: Request, res: Response) => {
        const { productId, quantity } = req.body;

        const item = await cartService.addItem(
            req.user!.userId,
            productId,
            quantity
        );

        res.status(201).json(
            ApiResponse.created(item, "Item added to cart.")
        );
    });
    updateItem = asyncHandler(async (req: Request, res: Response) => {
        const { quantity } = req.body;

        const item = await cartService.updateQuantity(
            req.user!.userId,
            getParam(req.params.itemId),
            quantity
        );

        res.status(200).json(
            ApiResponse.ok(item, "Cart updated.")
        );
    });
    removeItem = asyncHandler(async (req: Request, res: Response) => {
        await cartService.removeItem(req.user!.userId, getParam(req.params.itemId));
        res.status(200).json(
            ApiResponse.ok(null, "Item removed from cart.")
        );
    });
    reAddItem = asyncHandler(async (req: Request, res: Response) => {
        const item = await cartService.reAddPriceChangedItem(
            req.user!.userId,
            getParam(req.params.itemId)
        );

        res.status(200).json(
            ApiResponse.ok(item, "Item re-added with updated price.")
        );
    });
    getCartCount = asyncHandler(async (req: Request, res: Response) => {
        const count = await cartService.getCartCount(req.user!.userId);
        res.status(200).json(ApiResponse.ok({ count }));
    });
}

export const cartController = new CartController();