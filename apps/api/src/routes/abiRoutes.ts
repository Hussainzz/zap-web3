import express from "express";
import {getContractEvents} from "../resources/contractAbi/contractAbi.controller";
import {authenticateJwt} from "../middleware/authenticateJwt"
const router = express.Router();

router.get("/events/:contractAddress/:chainName",  authenticateJwt, getContractEvents);

export default router;
