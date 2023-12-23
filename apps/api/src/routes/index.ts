import express, { Router } from "express";
const router: Router = express.Router();

// Import route handlers
import abiRoutes from "./abiRoutes";
// const flowRoutes = require('./flowRoutes');
import eventRoutes from "./eventRoutes";
import appRoutes from "./appRoutes";
import authRoutes from "./authRoutes";
// const authRoutes = require('./authRoutes');

// Define routes with the common prefix
router.use("/abi", abiRoutes);
// router.use('/flow', flowRoutes);
router.use("/event", eventRoutes);

router.use("/apps", appRoutes);
router.use("/auth", authRoutes);

export default router;
