import "dotenv/config";
import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { connectDB } from "./config/database";
import { env } from "./config/env";
import { ApiError } from "./utils/ApiError";
import { ApiResponse } from "./utils/ApiResponse";
import { errorHandler } from "./middleware/error.middleware";
import authRoutes from "./routes/auth.routes";
import productRoutes from "./routes/product.routes";
import cartRoutes from "./routes/cart.routes";
import orderRoutes from "./routes/order.routes";
import addressRoutes from "./routes/address.routes";
import testimonialRoutes from "./routes/testimonial.routes";
import categoryRoutes from "./routes/category.routes";
import adminRoutes from "./routes/admin.routes";
import contentRoutes from "./routes/content.routes";
import { setupSwagger } from "./config/swagger";

const app: Application = express();

app.use(helmet());
app.use(cors({
    origin: [process.env.CLIENT_URL || "",
        "http://localhost:4200",
        /\.vercel\.app$/],
    credentials: true,
}));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

if (env.isDev) app.use(morgan("dev"));

app.use(async (_req: Request, _res: Response, next: NextFunction) => {
    try {
        await connectDB();
        next();
    } catch (error) {
        next(error);
    }
});

app.get("/api/v1/health", (_req, res) => {
    res.json(ApiResponse.ok({
        status: "healthy",
        store: env.store.name,
        timestamp: new Date().toISOString(),
    }));
});

app.get("/", (_req: Request, res: Response) => {
    res.json(ApiResponse.ok({
        message: "Fashion Store API is running smoothly 🚀",
        store: env.store.name,
    }));
});

app.get("/api/v1", (_req: Request, res: Response) => {
    res.json(ApiResponse.ok({
        message: "Welcome to Fashion Store API v1",
        endpoints: {
            health: "/api/v1/health",
            products: "/api/v1/products",
            categories: "/api/v1/categories",
        },
    }));
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/cart", cartRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/addresses", addressRoutes);
app.use("/api/v1/testimonials", testimonialRoutes);
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/content", contentRoutes);
app.use("/api/v1/admin", adminRoutes);

app.use((_req, _res, next) => {
    next(ApiError.notFound("Route not found."));
});

setupSwagger(app);
app.use(errorHandler);

if (process.env.NODE_ENV !== "production") {
    connectDB().then(() => {
        app.listen(env.port, () => {
            console.log(`🚀 Server: http://localhost:${env.port}`);
            console.log(`🏪 Store:  ${env.store.name}`);
            console.log(`🌍 Env:    ${env.nodeEnv}`);
        });
    });
}

export default app;