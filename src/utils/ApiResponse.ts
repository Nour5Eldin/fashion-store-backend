export class ApiResponse<T = unknown>{
    public success: boolean;
    public message: string;
    public data: T | null;
    public statusCode: number
    constructor(
        statusCode: number,
        message: string,
        data: T | null = null,
        success: boolean = true
    ) {
        this.statusCode = statusCode;
        this.message = message;
        this.data = data;
        this.success = success;

    }
    static ok<T>(data: T, message = "Success"): ApiResponse<T>{
        return new ApiResponse(200, message, data, true)
    };
    static created<T>(data: T, message = "Created Successfuly"): ApiResponse<T>{
        return new ApiResponse(201, message, data, true);
    }
    static badRequest(message: string): ApiResponse<null>{
        return new ApiResponse(400, message, null, false);
    }
    static unauthorized(message = "Unauthorized"): ApiResponse<null>{
        return new ApiResponse(401, message, null, false);
    }
    static forbidden(message = "Forbidden"): ApiResponse<null>{
        return new ApiResponse(403, message, null, false);
    }
    static notFound(message = "Not Found"): ApiResponse<null>{
        return new ApiResponse(404, message, null, false);
    }
    static serverError(message = "Internal server error"): ApiResponse<null>{
        return new ApiResponse(500, message, null, false);
    }
}
/*
Standardized API response Build in Factory Pattern
    */ 