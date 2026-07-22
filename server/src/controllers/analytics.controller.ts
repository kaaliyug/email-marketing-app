import { Request, Response } from "express";

import { asyncHandler } from "../utils/asyncHandler.js";

import { getCampaignAnalytics } from "../services/analytics.service.js";


export const analytics = asyncHandler(

    async (
        req: Request,
        res: Response
    ) => {


        const campaignId = Array.isArray(req.params.id)
            ? req.params.id[0]
            : req.params.id;


        const data =
            await getCampaignAnalytics(
                req.user!.id,
                campaignId
            );


        res.json({

            success: true,

            data,

        });


    }

);