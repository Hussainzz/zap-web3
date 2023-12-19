import { NextFunction, Request, Response } from "express";

function checkMissingFields(fields: any) {
  return function (req: Request, res: Response, next: NextFunction) {
    for (let i = 0; i < fields.length; i++) {
      if (!req.body[fields[i]]) {
        return res.status(400).json({
          status: "error",
          message: "Bad Request"
        });
      }
    }
    next();
  };
}

export default checkMissingFields;
