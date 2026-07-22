import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { createAudienceSchema } from "../validators/audience.validator.js";
import { createAudience, deleteAudience, getAudiences } from "../services/audience.service.js";
import { updateAudience } from "../services/audience.service.js";
import { updateAudienceSchema } from "../validators/audience.validator.js";

export const create = asyncHandler( async (req: Request, res: Response) => {

        const parsed = createAudienceSchema.parse(req.body);
        const audience = await createAudience(
            req.user!.id,
            parsed
        );

        res.status(201).json({
            success: true,
            message: "Audience created successfully",
            data: audience,
        });
    }
);

export const getAll = asyncHandler( async (req: Request, res: Response) => {

        const audiences = await getAudiences(
            req.user!.id
        );
        res.json({
            success: true,
            data: audiences,
        });
    }
);

export const update = asyncHandler( async ( req: Request,  res: Response ) => {

        const parsed = updateAudienceSchema.parse( req.body);
        const audience = await updateAudience( req.user!.id, Array.isArray(req.params.id) ? req.params.id[0] : req.params.id, parsed );
        res.json({
            success: true,
            message: "Audience updated successfully",
            data: audience,
        });
    }
);

export const remove = asyncHandler(
    async ( req: Request, res: Response ) => {

    const audienceId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    await deleteAudience( req.user!.id, audienceId );

        res.json({
            success: true,
            message: "Audience deleted successfully",
        });
    }
);

