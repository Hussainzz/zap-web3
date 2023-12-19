import express from "express";
import { authenticateJwt } from "../middleware/authenticateJwt"
import checkAppInstalled from "../middleware/checkAppInstalled";
import {authApp, authCallback} from "../resources/auth/auth.controller"
const router = express.Router();

router.get('/app', authenticateJwt, checkAppInstalled, authApp)
router.get('/callback/:app', authenticateJwt, authCallback)


export default router