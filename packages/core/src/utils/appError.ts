import { HttpStatusCode } from "axios";

class AppError extends Error {
  statusCode: HttpStatusCode;
  status: string;
  isOperational: boolean;

  constructor(message: any, statusCode: HttpStatusCode, stat: string | null = null) {
    const status = stat
      ? stat
      : `${statusCode}`.startsWith("4")
      ? "fail"
      : "error";
    super(message); // super() to access the message from Error (inheritance)
    this.statusCode = statusCode;
    this.status = status;
    this.isOperational = true; // to determine operational errors
    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
