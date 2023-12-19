import { getAppRecord, getUserAppRecord } from "@zap/core/src/repositories/app.repo";
import HashID from '../../utils/HashID';
import AppError from "@zap/core/src/utils/appError";
import catchAsync from "@zap/core/src/utils/catchAsync";
import { handleSlackAuthCallback } from "./apps.controller";
import { NextFunction } from "express";

interface AuthAppResponse {
  status: "success" | "error";
  data: {
    url: string;
  } | null
}

/**
 * Returns information regarding third party app oAuth
 * @name authApp
 * @return {json}
 */
export const authApp = catchAsync(async (req: any, res:any, next: NextFunction) => {
  const { app: appId, userId } = req.query;
  let decodedAppId = HashID.decodeNumber(appId);
  if (!appId || !decodedAppId) {
    return next(new AppError("Bad Request", 400, "error"));
  }
  let redirectUrl = `${req.appUrl}/api/auth/callback/${appId}`;

  const appRecord = await getAppRecord({
    id: decodedAppId,
  });
  if (!appRecord) {
    return next(new AppError("App Not Found", 401, "error"));
  }
  redirectUrl =
  "https://b154-203-192-226-198.ngrok-free.app/api/auth/callback/G8OZ3ygBKqY9rdJxPM2l4R1DQAj75W";

  const appKey = appRecord?.app_key ?? null;
  const appAuthUrl = appRecord?.app_auth_url ?? null;
  let appKeyMatched = true;
  let responseData:AuthAppResponse = {
    status: 'error',
    data: null
  };

  switch (appKey) {
    case "slack":
      let authUrl = new URL(appAuthUrl);
      authUrl.searchParams.append("redirect_uri", redirectUrl);
      authUrl.searchParams.append("state", userId);
      responseData.status = 'success';
      responseData.data = {
        url: authUrl.href ?? null,
      };
      break;
    default:
      appKeyMatched = false;
      break;
  }
  if (!appKeyMatched) {
    return next(new AppError("App Key Not Matched", 401, "error"));
  }

  res.status(200).json(responseData);
});

/**
 * Callback api for oAuth / other third party authentication
 * @name authCallback
 * @return {json}
 */
export const authCallback = catchAsync(async (req: any, res: any, next: NextFunction) => {
  const { app: appId } = req.params;
  const userId = req?.user?.id;
  let decodedAppId = HashID.decodeNumber(appId);
  if (!appId || !decodedAppId || !userId) {
    return next(new AppError("Bad Request", 400, "error"));
  }
  const appRecord = await getAppRecord({
    id: decodedAppId,
  });
  if (!appRecord) {
    return next(new AppError("App Not Found", 401, "error"));
  }
  
  const userAppRecord = await getUserAppRecord(
    {
      userId: userId,
      appId: decodedAppId,
    },
    ["id"]
  );
  if(userAppRecord){
    return next(new AppError("App Already Installed", 400, "error"));
  }

  let appInstalled = false;
  const appKey = appRecord?.app_key ?? null;
  switch (appKey) {
    case "slack":
      appInstalled = await handleSlackAuthCallback(userId, decodedAppId, req.query);
      break;
    default:
      break;
  }
  res.status(200).json({
    appInstalled,
  });
});