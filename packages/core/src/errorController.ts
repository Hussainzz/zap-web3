import AppError from "./utils/appError";

import * as dotenv from "dotenv";
dotenv.config();

interface Err {
  path: string;
  value: string;
  errmsg: any;
  errors: {
    message: string;
  }[]
}

const handleCastErrorDB = (err: Err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err: Err) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate field value: ${value}. Please use another value.`;
  return new AppError(message, 400);
};

const handleVaildationErrorDB = (err: Err) => {
  const errors = Object.values(err.errors).map((val) => val.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleJWTError = () =>
  new AppError('Invalid token, please login again!', 401);

const handleJWTExpiredError = () =>
  new AppError('Your token has expired, please login again!', 401);

const sendErrDev = (err: any, res: any) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrProd = (err: any, res: any) => {
  // Operational, trusted error: can send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    // Programming/Unknown error: can't send to client
    // 1. Log Error
    console.log('ERROR💥: ', err);
    // 2. Send generic message
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong',
    });
  }
};

export default (err: any, req: any, res: any, next: any) => {
  const NODE_ENV = process.env.NODE_ENV;
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  if (NODE_ENV === 'development') {
    sendErrDev(err, res);
  } else if (NODE_ENV === 'production') {
    let error = { ...err };
    error.message = err.message;

    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === 'ValidationError')
      error = handleVaildationErrorDB(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

    sendErrProd(error, res);
  }
};
