import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { recipientPreviewSchema } from "../validators/recipient.validator.js";
import { previewRecipients } from "../services/recipient.service.js";

export const preview = asyncHandler( async ( req: Request, res: Response ) => {

        const parsed = recipientPreviewSchema.parse( req.body );

        const recipients = await previewRecipients( req.user!.id, parsed.recipients );

        res.json({
            success: true,
            data: recipients,
        });
    }
);