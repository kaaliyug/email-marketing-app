import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { create, getAll, update, remove, send  } from "../controllers/campaign.controller.js";

const router = Router();

router.get( "/", authenticate, getAll);
router.post( "/", authenticate, create);
router.put( "/:id", authenticate, update );
router.delete( "/:id", authenticate, remove );
router.post("/:id/send", authenticate, send);


export default router;