import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { handleBrevoWebhook } from "../services/webhook.service.js";

export const brevoWebhook = asyncHandler(

    async (req: Request, res: Response) => {

        await handleBrevoWebhook(req.body);

        res.json({
            success: true,
        });

    }

);