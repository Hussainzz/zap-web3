import express, { Router } from 'express';
import {registerEvent} from "../resources/events/events.controller";
import checkMissingFields from "../middleware/checkMissingFields";
const router: Router = express.Router();

//registers event
router.post(
  "/register",
  checkMissingFields(["eventId"]),
  registerEvent
);

export default router;
