const required = (key: string): string => {
    const value = process.env[key];
    if (!value) {
        throw new Error(`Missing required env variable: ${key}`);
    }
    return value;
};
export const env = {
    port: parseInt(process.env.PORT || "5000"),
    nodeEnv: process.env.NODE_ENV || "development",
    isDev: process.env.NODE_ENV === "development",
    defaultAvatarUrl: process.env.DEFAULT_AVATAR_URL || "",
     
    mongodb: {
        uri: required("MONGODB_URI"),
    },
    jwt: {
        secret: required("JWT_SECRET"),
        expiresIn: process.env.JWT_EXPIRES_IN || "15m",
        refreshSecret: required("JWT_REFRESH_SECRET"),
        refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
    },
    cloudinary: {
        cloudName: required("CLOUDINARY_CLOUD_NAME"),
        apikey: required("CLOUDINARY_API_KEY"),
        apiSecret: required("CLOUDINARY_API_SECRET")
    },
    store: {
        name: process.env.STORE_NAME || "Fashion Store",
        email: process.env.STORE_EMAIL || "",
    },
} as const;