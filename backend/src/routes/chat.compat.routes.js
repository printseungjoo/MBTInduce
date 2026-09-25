import { Router } from "express";
import {
  deleteMainChatFlat,
  getMainChatFlat,
  patchMainChatMessageRate,
  postMainChatFlat,
  postMainChatFlatStream
} from "../controllers/chat.compat.controller.js";
import { requireAuth } from "../middlewares/requireAuth.js";
import { chatRateLimit } from "../middlewares/rateLimit.js";

const router = Router();

router.get("/", requireAuth, getMainChatFlat);
router.post("/stream", requireAuth, chatRateLimit, postMainChatFlatStream);
router.post("/", requireAuth, chatRateLimit, postMainChatFlat);
router.delete("/", requireAuth, deleteMainChatFlat);
router.patch("/:messageId", requireAuth, patchMainChatMessageRate);

export { router as chatCompatRouter };
