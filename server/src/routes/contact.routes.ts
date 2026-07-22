import { Router } from "express";

import { create, getAll, getOne, remove, update } from "../controllers/contact.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import upload from "../middleware/upload.middleware.js";
import { importContacts } from "../controllers/contact.controller.js";

const router = Router();

router.post( "/", authenticate, create );

router.get("/", authenticate, getAll);

router.put( "/:id", authenticate, update );

router.delete("/:id", authenticate, remove);

router.get("/:id", authenticate, getOne);

router.post( "/import", authenticate, upload.single("file"), importContacts );

export default router;