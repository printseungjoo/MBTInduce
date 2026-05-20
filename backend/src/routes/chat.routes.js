import { Router } from "express";
import {
  createChatSession,
  deleteChatSession,
  getChatSessionDetail,
  listMyChatSessions,
  patchChatSession,
  postMessage,
  postMessageCompat,
} from "../controllers/chat.controller.js";
import { requireAuth } from "../middlewares/requireAuth.js";

const router = Router();

router.get("/sessions", requireAuth, listMyChatSessions);
router.post("/sessions", requireAuth, createChatSession);
router.get("/sessions/:id", requireAuth, getChatSessionDetail);
router.patch("/sessions/:id", requireAuth, patchChatSession);
router.delete("/sessions/:id", requireAuth, deleteChatSession);
router.post("/sessions/:id/messages", requireAuth, postMessage);
router.post("/", requireAuth, postMessageCompat);

export { router as chatRouter };
