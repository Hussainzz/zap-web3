import {Request, NextFunction} from "express";

function appUrlMiddleware(req: Request, res: any, next: NextFunction) {
  req.appUrl = `${req.protocol}://${req.get("host")}`;
  req.dAppUrl = process.env.ZAP_APP_URL as string;
  next();
}

export default appUrlMiddleware;
