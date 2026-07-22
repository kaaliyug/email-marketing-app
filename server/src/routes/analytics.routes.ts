import { Router } from "express";

import { authenticate } from "../middleware/auth.middleware.js";

import { analytics } from "../controllers/analytics.controller.js";


const router = Router();


router.get(
    "/campaigns/:id/analytics",
    authenticate,
    analytics
);


export default router;