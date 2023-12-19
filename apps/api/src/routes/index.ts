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

// router.post("/test", /* authenticateJwt, */ async (req, res) => {
//   try {
//     const { SLACK_CLIENT_ID, SLACK_CLIENT_SECRET } = process.env;
    
//     const resu = await client.auth.revoke({
//       client_id: SLACK_CLIENT_ID,
//       client_secret: SLACK_CLIENT_SECRET,
//       token: "xoxb-5465729544597-5482040689684-cMbIw9cLl2NcWKE0Cxh48CJc",
//     });
//     console.log(resu);
//   } catch (error) {
//     console.log(error);
//   }

//   res.status(200).json({ status: true });
// });

export default router;
