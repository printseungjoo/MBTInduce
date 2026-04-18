import { Router } from "express";
import {
  getMainChatFlat,
  patchMainChatMessageRate,
  postMainChatFlat,
} from "../controllers/chat.compat.controller.js";
import { requireAuth } from "../middlewares/requireAuth.js";

const router = Router();

router.get("/", requireAuth, getMainChatFlat);
router.post("/", requireAuth, postMainChatFlat);
router.patch("/:messageId", requireAuth, patchMainChatMessageRate);

export { router as chatCompatRouter };
