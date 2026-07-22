import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { preview } from "../controllers/recipient.controller.js";

const router = Router();

router.post( "/preview", authenticate, preview );

export default router;