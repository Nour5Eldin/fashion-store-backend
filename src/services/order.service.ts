import { IOrder } from "../models/order.model";
import { addressRepository, cartRepository, orderRepository, productRepository } from "../repositories";
import { OrderStatus } from "../types/enum";
import { ApiError } from "../utils/ApiError";

export interface PlaceOrderDTO {
    userId: string;
    addressId: string;
    phoneNumber: string;
}
export class OrderService {
    async placeOrder(dto: PlaceOrderDTO): Promise<IOrder> {
        const cart = await cartRepository.getUserCart(dto.userId);
        const activeItems = cart.filter(i => !i.isPriceChanged);
        if (activeItems.length === 0) {
            throw ApiError.badRequest(
                "Your cart is empty or has only price-changed items."
            );
        }
        const address = await addressRepository.findOne({
            _id: dto.addressId,
            userId: dto.userId,
        });
        if (!address) {
            throw ApiError.notFound("Delivery address not found.");
        }
        const stockChecks = await Promise.all(
            activeItems.map(async (item) => {
                const product = await productRepository.findById(
                    item.productId.toString()
                );
                return {
                    item,
                    product,
                    hasStock: product && product.stock >= item.quantity,
                };
            })
        );
        const outOfStock = stockChecks.filter(c => !c.hasStock);
        if (outOfStock.length > 0) {
            const names = outOfStock
                .map(c => c.product?.name || "Unknown")
                .join(", ");
            throw ApiError.badRequest(
                `Some items are no longer available: ${names}`
            );
        }
        const totalPrice = activeItems.reduce(
            (sum, item) => sum + item.totalPrice,
            0
        );
        const productsSnapshot = stockChecks.map(({ item, product }) => ({
            productId: item.productId,
            name: product!.name,
            price: item.price,
            quantity: item.quantity,
            image: product!.images,
        }));
        const order = await orderRepository.create({
            userId: dto.userId as unknown as typeof order.userId,
            address: address.addressText,
            phoneNumber: dto.phoneNumber,
            totalPrice,
            status: OrderStatus.PENDING,
            products: productsSnapshot as unknown as typeof order.products,
            statusLog: [{
                status: OrderStatus.PENDING,
                changedAt: new Date(),
                changedBy: dto.userId as unknown as typeof order.userId,
            }],
        });
        await Promise.all(
            activeItems.map(item =>
                Promise.all([
                    productRepository.decrementStock(
                        item.productId.toString(),
                        item.quantity
                    ),
                    productRepository.incrementTotalSold(
                        item.productId.toString(),
                        item.quantity
                    ),
                ])
            )
        );
        await cartRepository.clearCart(dto.userId);

        return order;
    }
    async getUserOrders(
        userId: string,
        options: { status?: OrderStatus; page?: number; limit?: number }
    ) {
        return orderRepository.getUserOrders(userId, options);
    }
    async getOrderDetail(orderId: string, userId: string): Promise<IOrder> {
        const order = await orderRepository.findOne({ _id: orderId, userId });
        if (!order) throw ApiError.notFound("Order not found.");
        return order;
    }
    async cancelOrder(orderId: string, userId: string): Promise<IOrder> {
        const order = await orderRepository.cancelByUser(orderId, userId);

        if (!order) {
            throw ApiError.badRequest(
                "Order cannot be cancelled. It may have already been shipped."
            );
        }
        await Promise.all(
            order.products.map(p =>
                productRepository.incrementStock(
                    p.productId.toString(),
                    p.quantity
                )
            )
        );

        return order;
    }
    async requestRefund(
        orderId: string,
        userId: string,
        reason: string
    ): Promise<IOrder> {
        const order = await orderRepository.submitRefund(orderId, userId, reason);

        if (!order) {
            throw ApiError.badRequest(
                "Refund cannot be requested for this order."
            );
        }

        return order;
    }
    async getAdminOrders(options: {
        status?: OrderStatus;
        startDate?: Date;
        endDate?: Date;
        search?: string;
        page?: number;
        limit?: number;
    }) {
        return orderRepository.getAdminOrders(options);
    }
    async updateOrderStatus(
        orderId: string,
        status: OrderStatus,
        adminId: string,
        note?: string
    ): Promise<IOrder> {
        const order = await orderRepository.findById(orderId);
        if (!order) throw ApiError.notFound("Order not found.");

        const updated = await orderRepository.updateStatus(
            orderId,
            status,
            adminId,
            note
        );
        if (!updated) throw ApiError.notFound("Order not found.");

        if (status === OrderStatus.CANCELLED_BY_ADMIN) {
            await Promise.all(
                order.products.map(p =>
                    productRepository.incrementStock(
                        p.productId.toString(),
                        p.quantity
                    )
                )
            );
        }
        if (status === OrderStatus.RECEIVED && order.refundStatus === "approved") {
            await Promise.all(
                order.products.map(p =>
                    productRepository.incrementStock(
                        p.productId.toString(),
                        p.quantity
                    )
                )
            );
        }

        return updated;
    }
    async handleRefund(
        orderId: string,
        decision: "approved" | "refused",
        adminId: string
    ): Promise<IOrder> {
        const order = await orderRepository.findById(orderId);
        if (!order) throw ApiError.notFound("Order not found.");

        if (!order.refundRequested || order.refundStatus !== "pending") {
            throw ApiError.badRequest("No pending refund request for this order.");
        }
        const updated = await orderRepository.updateById(orderId, {
            refundStatus: decision,
        });
        if (decision === "approved") {
            await Promise.all(
                order.products.map(p =>
                    productRepository.incrementStock(
                        p.productId.toString(),
                        p.quantity
                    )
                )
            );

            await orderRepository.updateStatus(
                orderId,
                OrderStatus.RECEIVED,
                adminId,
                "Refund approved — stock restored"
            );
        }

        return updated!;

    }
    async getSalesReport(startDate: Date, endDate: Date) {
        const oneYear = 365 * 24 * 60 * 60 * 1000;
        if (endDate.getTime() - startDate.getTime() > oneYear) {
            throw ApiError.badRequest("Date range cannot exceed 1 year.");
        }

        if (startDate > endDate) {
            throw ApiError.badRequest("Start date must not be after end date.");
        }

        const [reportData, topProducts, kpis] = await Promise.all([
            orderRepository.getSalesReport(startDate, endDate),
            productRepository.getTopProducts(10),
            orderRepository.getDashboardKPIs(),
        ]);

        const report = reportData[0] || {
            totalRevenue: 0,
            totalOrders: 0,
            totalUnits: 0,
        };
        return {
            totalRevenue: report.totalRevenue,
            totalOrders: report.totalOrders,
            totalUnits: report.totalUnits,
            averageOrderValue: report.totalOrders > 0
                ? report.totalRevenue / report.totalOrders
                : 0,
            topProducts,
        };
    }
    async getDashboardKPIs() {
        const [kpis, lowStock] = await Promise.all([
            orderRepository.getDashboardKPIs(),
            productRepository.getLowStockProducts(),
        ]);

        return {
            ...kpis,
            lowStockCount: lowStock.length,
            lowStockItems: lowStock,
        };
    }
}
export const orderService = new OrderService();