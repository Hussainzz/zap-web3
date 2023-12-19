import express from "express";
import {
  getSlackUserInfo,
  revokeUserApp,
} from "../resources/auth/apps.controller";
import { authenticateJwt } from "../middleware/authenticateJwt";
const router = express.Router();

router.post("/user-app-info/", authenticateJwt, getSlackUserInfo);
router.post("/revoke", authenticateJwt, revokeUserApp);

export default router;
