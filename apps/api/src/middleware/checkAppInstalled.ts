import { getUserAppRecord } from "@zap/core/src/repositories/app.repo";
import AppError from "@zap/core/src/utils/appError";
import { NextFunction, Response } from "express";

const checkAppInstalled = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  const userId = req?.user?.id;
  const appId = req?.body?.appId;

  if (!userId || !appId) {
    return next(new AppError("Bad Request", 400, "error"));
  }

  const userApp = await getUserAppRecord(
    {
      userId,
      appId,
    },
    ["id"]
  );

  if (userApp) {
    return next(new AppError("App already installed", 400, "error"));
  }
  next();
};

export default checkAppInstalled;
