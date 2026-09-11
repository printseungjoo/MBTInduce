import { Router } from "express";
import {
  deleteMainChatFlat,
  getMainChatFlat,
  patchMainChatMessageRate,
  postMainChatFlat,
  postMainChatFlatStream
} from "../controllers/chat.compat.controller.js";
import { requireAuth } from "../middlewares/requireAuth.js";

const router = Router();

router.get("/", requireAuth, getMainChatFlat);
router.post("/stream", requireAuth, postMainChatFlatStream);
router.post("/", requireAuth, postMainChatFlat);
router.delete("/", requireAuth, deleteMainChatFlat);
router.patch("/:messageId", requireAuth, patchMainChatMessageRate);

export { router as chatCompatRouter };
