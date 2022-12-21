export default class AppError extends Error {
    statusCode: number;
    status: string;
    isOperational: boolean;
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith("4") ? "Fail" : "Error";
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}
