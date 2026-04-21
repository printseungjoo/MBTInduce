import { Router } from "express";
import {
  getChatMessage,
  getSimulationTemplate,
  getUserProfilesHandler,
  patchSimulationTemplateHandler,
  patchChatMessageHandler,
  patchUserProfiles,
  postChatMessage,
  postSimulationTemplate,
  postUserProfiles,
  removeChatMessage,
  removeSimulationTemplate,
  removeUserProfiles,
} from "../controllers/simulation.controller.js";
import { requireAuth } from "../middlewares/requireAuth.js";

const router = Router();

router.get("/simulationTemplate", requireAuth, getSimulationTemplate);
router.post("/simulationTemplate", requireAuth, postSimulationTemplate);
router.patch("/simulationTemplate/:id", requireAuth, patchSimulationTemplateHandler);
router.delete("/simulationTemplate/:id", requireAuth, removeSimulationTemplate);

router.get("/userProfiles", requireAuth, getUserProfilesHandler);
router.post("/userProfiles", requireAuth, postUserProfiles);
router.patch("/userProfiles/:id", requireAuth, patchUserProfiles);
router.delete("/userProfiles/:id", requireAuth, removeUserProfiles);

router.get("/chatMessage", requireAuth, getChatMessage);
router.post("/chatMessage", requireAuth, postChatMessage);
router.patch("/chatMessage/:id", requireAuth, patchChatMessageHandler);
router.delete("/chatMessage/:id", requireAuth, removeChatMessage);

export { router as simulationRouter };
