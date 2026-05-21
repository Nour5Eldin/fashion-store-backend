import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { orderService } from "../services/order.service";
import { OrderStatus } from "../types/enum";
import { getParam } from "../utils/request.utils";

export class OrderController {
    placeOrder = asyncHandler(async (req: Request, res: Response) => {
        const order = await orderService.placeOrder({
            userId: req.user!.userId,
            addressId: req.body.addressId,
            phoneNumber: req.body.phoneNumber,
        });

        res.status(201).json(
            ApiResponse.created(order, "Order placed successfully.")
        );
    });
    getUserOrders = asyncHandler(async (req: Request, res: Response) => {
        const result = await orderService.getUserOrders(
            req.user!.userId,
            {
                status: req.query.status as OrderStatus,
                page: req.query.page ? Number(req.query.page) : 1,
                limit: req.query.limit ? Number(req.query.limit) : 10,
            }
        );

        res.status(200).json(ApiResponse.ok(result));
    });
    getOrderDetail = asyncHandler(async (req: Request, res: Response) => {
        const order = await orderService.getOrderDetail(
            getParam(req.params.id),
            req.user!.userId
        );
        res.status(200).json(ApiResponse.ok(order));
    });
    cancelOrder = asyncHandler(async (req: Request, res: Response) => {
        const order = await orderService.cancelOrder(
            getParam(req.params.id),
            req.user!.userId
        );

        res.status(200).json(
            ApiResponse.ok(order, "Order cancelled successfully.")
        );
    });
    requestRefund = asyncHandler(async (req: Request, res: Response) => {
        const order = await orderService.requestRefund(
            getParam(req.params.id),
            req.user!.userId,
            req.body.reason
        );

        res.status(200).json(
            ApiResponse.ok(order, "Refund request submitted successfully.")
        );
    });
    getAdminOrders = asyncHandler(async (req: Request, res: Response) => {
        const result = await orderService.getAdminOrders({
            status: req.query.status as OrderStatus,
            startDate: req.query.startDate ? new Date(req.query.startDate as string) : undefined,
            endDate: req.query.endDate ? new Date(req.query.endDate as string) : undefined,
            search: req.query.search as string,
            page: req.query.page ? Number(req.query.page) : 1,
            limit: req.query.limit ? Number(req.query.limit) : 20,
        });

        res.status(200).json(ApiResponse.ok(result));
    });
    updateOrderStatus = asyncHandler(async (req: Request, res: Response) => {
        const order = await orderService.updateOrderStatus(
            getParam(req.params.id),
            req.body.status,
            req.user!.userId,
            req.body.note
        );

        res.status(200).json(
            ApiResponse.ok(order, "Order status updated successfully.")
        );
    });
    handleRefund = asyncHandler(async (req: Request, res: Response) => {
        const order = await orderService.handleRefund(
            getParam(req.params.id),
            req.body.decision,
            req.user!.userId
        );

        res.status(200).json(
            ApiResponse.ok(order, `Refund ${req.body.decision} successfully.`)
        );
    });
    getDashboardKPIs = asyncHandler(async (req: Request, res: Response) => {
        const kpis = await orderService.getDashboardKPIs();
        res.status(200).json(ApiResponse.ok(kpis));
    });
    getSalesReport = asyncHandler(async (req: Request, res: Response) => {
        const startDate = new Date(req.query.startDate as string);
        const endDate = new Date(req.query.endDate as string);

        const report = await orderService.getSalesReport(startDate, endDate);
        res.status(200).json(ApiResponse.ok(report));
    });
}

export const orderController = new OrderController();