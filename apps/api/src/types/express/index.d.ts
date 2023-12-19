import { Express } from "express-serve-static-core";

interface ZapUser{
  id: number;
  fullname: string;
  email: string;
} 

declare module "express-serve-static-core" {
  interface Request {
    appUrl: string;
    dAppUrl: string;
    user: ZapUser;
  }
}