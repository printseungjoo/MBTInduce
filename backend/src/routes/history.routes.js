import { Router } from "express";
import { requireAuth } from "../middlewares/requireAuth.js";
import {
  deleteHistoryHandler,
  getHistoryHandler,
  listHistoryHandler,
  postHistoryHandler,
} from "../controllers/history.controller.js";

const router = Router();

router.get("/", requireAuth, listHistoryHandler);
router.post("/", requireAuth, postHistoryHandler);
router.get("/:id", requireAuth, getHistoryHandler);
router.delete("/:id", requireAuth, deleteHistoryHandler);

export { router as historyRouter };
