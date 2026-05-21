import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Application, Express } from "express";
import { env } from "./env";

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: `${env.store.name} — API Documentation`,
            version: "1.0.0",
            description: "Complete REST API documentation for the Fashion E-Commerce platform.",
            contact: {
                name: "API Support",
                email: env.store.email,
            },
        },
        servers: [
            {
                url: `http://localhost:${env.port}/api/v1`,
                description: "Development Server",
            },
            {
                url: "https://your-production-domain.com/api/v1",
                description: "Production Server",
            },
        ],
        components: {
            securitySchemes: {
                BearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                    description: "Enter your JWT access token",
                },
            },
            schemas: {

                // ─── User ──────────────────────────────────────────────────────────
                User: {
                    type: "object",
                    properties: {
                        _id: { type: "string", example: "64f1a2b3c4d5e6f7a8b9c0d1" },
                        name: { type: "string", example: "Ahmed Hassan" },
                        mobile: { type: "string", example: "+201111111111" },
                        email: { type: "string", example: "ahmed@example.com" },
                        gender: { type: "string", enum: ["male", "female"] },
                        role: { type: "string", enum: ["user", "admin"] },
                        avatar: { type: "string", example: "https://res.cloudinary.com/..." },
                        emailConsent: { type: "boolean", example: false },
                        isActive: { type: "boolean", example: true },
                        createdAt: { type: "string", format: "date-time" },
                    },
                },

                // ─── Auth ──────────────────────────────────────────────────────────
                AuthTokens: {
                    type: "object",
                    properties: {
                        accessToken: { type: "string", example: "eyJhbGciOiJIUzI1NiIs..." },
                        refreshToken: { type: "string", example: "eyJhbGciOiJIUzI1NiIs..." },
                    },
                },

                RegisterRequest: {
                    type: "object",
                    required: ["name", "mobile", "password", "confirmPassword", "gender"],
                    properties: {
                        name: { type: "string", minLength: 2, maxLength: 60, example: "Ahmed Hassan" },
                        mobile: { type: "string", example: "+201111111111" },
                        email: { type: "string", example: "ahmed@example.com" },
                        password: { type: "string", minLength: 8, example: "Ahmed@1234" },
                        confirmPassword: { type: "string", example: "Ahmed@1234" },
                        gender: { type: "string", enum: ["male", "female"] },
                        emailConsent: { type: "boolean", example: false },
                    },
                },

                LoginRequest: {
                    type: "object",
                    required: ["mobile", "password"],
                    properties: {
                        mobile: { type: "string", example: "+201111111111" },
                        password: { type: "string", example: "Ahmed@1234" },
                    },
                },

                // ─── Product ───────────────────────────────────────────────────────
                Product: {
                    type: "object",
                    properties: {
                        _id: { type: "string" },
                        name: { type: "string", example: "Classic White Tee" },
                        slug: { type: "string", example: "classic-white-tee" },
                        description: { type: "string" },
                        price: { type: "number", example: 199 },
                        images: { type: "array", items: { type: "string" } },
                        mainImage: { type: "string" },
                        stock: { type: "number", example: 50 },
                        categoryId: { type: "string" },
                        subCategoryId: { type: "string" },
                        isActive: { type: "boolean" },
                        isDeleted: { type: "boolean" },
                        totalSold: { type: "number" },
                        isOutOfStock: { type: "boolean" },
                        isLowStock: { type: "boolean" },
                        createdAt: { type: "string", format: "date-time" },
                    },
                },

                // ─── Category ──────────────────────────────────────────────────────
                Category: {
                    type: "object",
                    properties: {
                        _id: { type: "string" },
                        title: { type: "string", example: "T-Shirts" },
                        slug: { type: "string", example: "t-shirts" },
                        isActive: { type: "boolean" },
                        isDeleted: { type: "boolean" },
                    },
                },

                // ─── Order ─────────────────────────────────────────────────────────
                Order: {
                    type: "object",
                    properties: {
                        _id: { type: "string" },
                        userId: { type: "string" },
                        address: { type: "string" },
                        phoneNumber: { type: "string" },
                        totalPrice: { type: "number" },
                        status: {
                            type: "string",
                            enum: [
                                "pending", "preparing", "shipped",
                                "cancelledByUser", "cancelledByAdmin",
                                "refused", "received",
                            ],
                        },
                        products: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    productId: { type: "string" },
                                    name: { type: "string" },
                                    price: { type: "number" },
                                    quantity: { type: "number" },
                                    image: { type: "string" },
                                },
                            },
                        },
                        createdAt: { type: "string", format: "date-time" },
                    },
                },

                // ─── Cart ──────────────────────────────────────────────────────────
                CartItem: {
                    type: "object",
                    properties: {
                        _id: { type: "string" },
                        productId: { type: "string" },
                        quantity: { type: "number" },
                        price: { type: "number" },
                        totalPrice: { type: "number" },
                        isPriceChanged: { type: "boolean" },
                    },
                },

                // ─── Testimonial ───────────────────────────────────────────────────
                Testimonial: {
                    type: "object",
                    properties: {
                        _id: { type: "string" },
                        userId: { type: "string" },
                        comment: { type: "string" },
                        stars: { type: "number", minimum: 1, maximum: 5 },
                        status: { type: "string", enum: ["pending", "approved", "refused"] },
                        isApproved: { type: "boolean" },
                        createdAt: { type: "string", format: "date-time" },
                    },
                },

                // ─── Review ────────────────────────────────────────────────────────
                Review: {
                    type: "object",
                    properties: {
                        _id: { type: "string" },
                        productId: { type: "string" },
                        userId: { type: "string" },
                        stars: { type: "number", minimum: 1, maximum: 5 },
                        comment: { type: "string" },
                        images: { type: "array", items: { type: "string" } },
                        isVerified: { type: "boolean" },
                        isApproved: { type: "boolean" },
                        createdAt: { type: "string", format: "date-time" },
                    },
                },

                // ─── Address ───────────────────────────────────────────────────────
                Address: {
                    type: "object",
                    properties: {
                        _id: { type: "string" },
                        label: { type: "string", enum: ["home", "work", "other"] },
                        addressText: { type: "string" },
                        isDefault: { type: "boolean" },
                    },
                },

                // ─── Pagination ────────────────────────────────────────────────────
                PaginatedResponse: {
                    type: "object",
                    properties: {
                        data: { type: "array", items: {} },
                        total: { type: "number" },
                        page: { type: "number" },
                        limit: { type: "number" },
                        totalPages: { type: "number" },
                        hasNextPage: { type: "boolean" },
                        hasPrevPage: { type: "boolean" },
                    },
                },

                // ─── API Response ──────────────────────────────────────────────────
                ApiResponse: {
                    type: "object",
                    properties: {
                        success: { type: "boolean" },
                        message: { type: "string" },
                        data: {},
                    },
                },

                ApiError: {
                    type: "object",
                    properties: {
                        success: { type: "boolean", example: false },
                        message: { type: "string", example: "Error message here" },
                    },
                },
            },

            // ─── Reusable Responses ──────────────────────────────────────────────
            responses: {
                Unauthorized: {
                    description: "Unauthorized — Invalid or missing JWT token",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/ApiError" },
                            example: { success: false, message: "No token provided." },
                        },
                    },
                },
                Forbidden: {
                    description: "Forbidden — Admin access required",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/ApiError" },
                            example: { success: false, message: "Admin access required." },
                        },
                    },
                },
                NotFound: {
                    description: "Not Found",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/ApiError" },
                            example: { success: false, message: "Resource not found." },
                        },
                    },
                },
                ValidationError: {
                    description: "Validation Error",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    success: { type: "boolean", example: false },
                                    message: { type: "string", example: "Validation failed." },
                                    errors: {
                                        type: "array",
                                        items: {
                                            type: "object",
                                            properties: {
                                                field: { type: "string" },
                                                message: { type: "string" },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },

            // ─── Reusable Parameters ─────────────────────────────────────────────
            parameters: {
                PageParam: {
                    name: "page", in: "query", schema: { type: "integer", default: 1 },
                    description: "Page number",
                },
                LimitParam: {
                    name: "limit", in: "query", schema: { type: "integer", default: 20 },
                    description: "Items per page (max 100)",
                },
                IdParam: {
                    name: "id", in: "path", required: true,
                    schema: { type: "string" },
                    description: "Document ID",
                },
                SlugParam: {
                    name: "slug", in: "path", required: true,
                    schema: { type: "string" },
                    description: "URL slug",
                },
            },
        },

        // ─── Tags ─────────────────────────────────────────────────────────────
        tags: [
            { name: "Auth", description: "Authentication & User Management" },
            { name: "Products", description: "Product Catalog" },
            { name: "Categories", description: "Categories & Subcategories" },
            { name: "Cart", description: "Shopping Cart" },
            { name: "Orders", description: "Order Management" },
            { name: "Addresses", description: "Delivery Addresses" },
            { name: "Testimonials", description: "Store Testimonials" },
            { name: "Reviews", description: "Product Reviews" },
            { name: "Admin", description: "Admin Panel Operations" },
        ],
    },
    apis: ["./src/routes/*.ts"], // ← بيقرأ الـ JSDoc comments من الـ routes
};

export const swaggerSpec = swaggerJsdoc(options);

/**
 * @function setupSwagger
 * @description Registers Swagger UI on Express app
 */
export const setupSwagger = (app: Application): void => {
    // Swagger UI
    app.use(
        "/api/docs",
        swaggerUi.serve,
        swaggerUi.setup(swaggerSpec, {
            customSiteTitle: "Fashion Store API Docs",
            customCss: `
        .swagger-ui .topbar { background-color: #1E3A8A; }
        .swagger-ui .topbar .download-url-wrapper { display: none; }
      `,
            swaggerOptions: {
                persistAuthorization: true, // بيحتفظ بالـ token بعد refresh
                displayRequestDuration: true,
                filter: true,
            },
        })
    );

    // Raw JSON endpoint
    app.get("/api/docs.json", (_req, res) => {
        res.setHeader("Content-Type", "application/json");
        res.send(swaggerSpec);
    });

    console.log(`📄 Swagger Docs: http://localhost:${env.port}/api/docs`);
};