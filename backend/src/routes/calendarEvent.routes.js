import { Router } from "express";
import { requireAuth } from "../middlewares/requireAuth.js";
import {
  deleteCalendarEventHandler,
  getCalendarEventHandler,
  listCalendarEventsHandler,
  patchCalendarEventHandler,
  postCalendarEventHandler,
  postCalendarRecommendHandler,
} from "../controllers/calendarEventController.js";

const router = Router();

router.post("/recommend", requireAuth, postCalendarRecommendHandler);
router.get("/", requireAuth, listCalendarEventsHandler);
router.post("/", requireAuth, postCalendarEventHandler);
router.get("/:id", requireAuth, getCalendarEventHandler);
router.patch("/:id", requireAuth, patchCalendarEventHandler);
router.delete("/:id", requireAuth, deleteCalendarEventHandler);

export { router as calendarEventRouter };
