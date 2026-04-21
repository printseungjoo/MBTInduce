import { Router } from "express";
import { requireAuth } from "../middlewares/requireAuth.js";
import {
  getChatMessageHandler,
  getSimulationScenarioHandler,
  getTargetInfoHandler,
  getUserInfoHandler,
  patchChatMessageHandler,
  postChatMessageHandler,
  postSimulationScenarioHandler,
  postTargetInfoHandler,
  postUserInfoHandler,
  removeChatMessageHandler,
  removeSimulationScenarioHandler,
} from "../controllers/simulationPage.controller.js";

const router = Router();

router.get("/chatMessage", requireAuth, getChatMessageHandler);
router.post("/chatMessage", requireAuth, postChatMessageHandler);
router.patch("/chatMessage/:id", requireAuth, patchChatMessageHandler);
router.delete("/chatMessage/:id", requireAuth, removeChatMessageHandler);

router.get("/simulationScenario", requireAuth, getSimulationScenarioHandler);
router.post("/simulationScenario", requireAuth, postSimulationScenarioHandler);
router.delete("/simulationScenario/:id", requireAuth, removeSimulationScenarioHandler);

router.get("/userInfo", requireAuth, getUserInfoHandler);
router.post("/userInfo", requireAuth, postUserInfoHandler);

router.get("/targetInfo", requireAuth, getTargetInfoHandler);
router.post("/targetInfo", requireAuth, postTargetInfoHandler);

export { router as simulationPageRouter };
