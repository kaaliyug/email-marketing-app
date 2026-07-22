import { Router } from "express";
import { brevoWebhook } from "../controllers/webhook.controller.js";

const router = Router();

router.post(
    "/brevo",
    brevoWebhook
);

export default router;