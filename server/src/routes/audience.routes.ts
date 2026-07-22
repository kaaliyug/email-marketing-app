import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { create, getAll, remove, update } from "../controllers/audience.controller.js";

const router = Router();

router.post( "/", authenticate, create );
router.get( "/", authenticate, getAll);
router.put( "/:id", authenticate, update );
router.delete( "/:id", authenticate, remove );

export default router;