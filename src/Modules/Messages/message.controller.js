import { Router } from "express";
import { changeMessageStatusService, deleteMessageService, listMessagesService, listPublicMessagesService, sendMessagesService } from "./Services/message.service.js";
import { authenticationMiddleware } from "../../Middlewares/index.js";
const router = Router();

router.post("/send/:receiverId",authenticationMiddleware,sendMessagesService)
router.get("/list",authenticationMiddleware,listMessagesService)
router.put("/make-public/:_messageid", authenticationMiddleware, changeMessageStatusService )
router.get("/list-public/:_id",listPublicMessagesService)
router.delete("/delete/:_messageid",authenticationMiddleware,deleteMessageService)

export default router;