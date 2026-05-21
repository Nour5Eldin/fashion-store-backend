import mongoose from "mongoose";
import { Order, IOrder } from "../models/order.model";
import { BaseRepository } from "./base.repository";
import { OrderStatus } from "../types/enum";

export class OrderRepository extends BaseRepository<IOrder> {
    constructor() {
        super(Order);
    }

    async getUserOrders(
        userId: string,
        options: {
            status?: OrderStatus;
            page?: number;
            limit?: number;
        } = {}
    ) {
        const filter: Record<string, unknown> = { userId };
        if (options.status) filter.status = options.status;

        return this.paginate(filter, {
            page: options.page,
            limit: options.limit || 10,
            sort: { createdAt: -1 },
        });
    }

    async getAdminOrders(options: {
        status?: OrderStatus;
        startDate?: Date;
        endDate?: Date;
        search?: string;
        page?: number;
        limit?: number;
    } = {}) {
        const filter: Record<string, unknown> = {};

        if (options.status) filter.status = options.status;

        if (options.startDate || options.endDate) {
            filter.createdAt = {};
            if (options.startDate)
                (filter.createdAt as Record<string, unknown>).$gte = options.startDate;
            if (options.endDate)
                (filter.createdAt as Record<string, unknown>).$lte = options.endDate;
        }

        return this.paginate(filter, {
            page: options.page,
            limit: options.limit || 20,
            sort: { createdAt: -1 },
            populate: "userId",
        });
    }
    async updateStatus(
        orderId: string,
        status: OrderStatus,
        changedBy: string,
        note?: string
    ): Promise<IOrder | null> {
        return Order.findByIdAndUpdate(
            orderId,
            {
                status,
                $push: {
                    statusLog: {
                        status,
                        changedAt: new Date(),
                        changedBy: new mongoose.Types.ObjectId(changedBy),
                        note,
                    },
                },
            },
            { new: true }
        ).exec();
    }

    async cancelByUser(
        orderId: string,
        userId: string
    ): Promise<IOrder | null> {
        return Order.findOneAndUpdate(
            {
                _id: orderId,
                userId,
                status: { $in: [OrderStatus.PENDING, OrderStatus.PREPARING] },
            },
            {
                status: OrderStatus.CANCELLED_BY_USER,
                $push: {
                    statusLog: {
                        status: OrderStatus.CANCELLED_BY_USER,
                        changedAt: new Date(),
                        changedBy: new mongoose.Types.ObjectId(userId),
                    },
                },
            },
            { new: true }
        ).exec();
    }
    async submitRefund(
        orderId: string,
        userId: string,
        reason: string
    ): Promise<IOrder | null> {
        return Order.findOneAndUpdate(
            {
                _id: orderId,
                userId,
                status: { $in: [OrderStatus.RECEIVED, OrderStatus.SHIPPED] },
                refundRequested: false,
            },
            {
                refundRequested: true,
                refundReason: reason,
                refundStatus: "pending",
            },
            { new: true }
        ).exec();
    }
    async getDashboardKPIs() {
        const now = new Date();
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

        const [
            totalOrders,
            pendingOrders,
            monthlyRevenue,
        ] = await Promise.all([
            Order.countDocuments(),
            Order.countDocuments({ status: OrderStatus.PENDING }),
            Order.aggregate([
                {
                    $match: {
                        status: { $in: [OrderStatus.RECEIVED, OrderStatus.SHIPPED] },
                        createdAt: { $gte: monthStart },
                    },
                },
                { $group: { _id: null, total: { $sum: "$totalPrice" } } },
            ]),
        ]);

        return {
            totalOrders,
            pendingOrders,
            totalRevenue: monthlyRevenue[0]?.total || 0,
        };
    }
    async getSalesReport(startDate: Date, endDate: Date) {
        return Order.aggregate([
            {
                $match: {
                    status: { $in: [OrderStatus.RECEIVED, OrderStatus.SHIPPED] },
                    createdAt: { $gte: startDate, $lte: endDate },
                },
            },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: "$totalPrice" },
                    totalOrders: { $sum: 1 },
                    totalUnits: {
                        $sum: {
                            $sum: "$products.quantity",
                        },
                    },
                },
            },
        ]);
    }
}

export const orderRepository = new OrderRepository();