import { Router } from "express";
import { sendMessagesService } from "./Services/message.service.js";
const router = Router();

router.post("/send/:reciverId",sendMessagesService)

export default router;