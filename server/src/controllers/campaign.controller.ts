import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { createCampaignSchema, updateCampaignSchema } from "../validators/campaign.validator.js";
import { createCampaign, getCampaigns, updateCampaign, deleteCampaign } from "../services/campaign.service.js";
import { sendCampaign } from "../services/sendCampaign.service.js";

export const create = asyncHandler(async (req: Request, res: Response) => {
    
    const parsed = createCampaignSchema.parse(req.body);

    const campaign = await createCampaign(
        req.user!.id,
        parsed
    );

    res.status(201).json({
        success: true,
        message: "Campaign created successfully",
        data: campaign,
    });

});

export const getAll = asyncHandler(async (req: Request, res: Response) => {

    const campaigns = await getCampaigns(
        req.user!.id
    );

    res.json({
        success: true,
        data: campaigns,
    });

});

export const update = asyncHandler(async (req: Request, res: Response) => {

    const parsed = updateCampaignSchema.parse(req.body);

    const campaignId = Array.isArray(req.params.id)
        ? req.params.id[0]
        : req.params.id;

    const campaign = await updateCampaign(
        req.user!.id,
        campaignId,
        parsed
    );

    res.json({
        success: true,
        message: "Campaign updated successfully",
        data: campaign,
    });

});

export const remove = asyncHandler(async (req: Request, res: Response) => {

    const campaignId = Array.isArray(req.params.id)
        ? req.params.id[0]
        : req.params.id;

    await deleteCampaign(
        req.user!.id,
        campaignId
    );

    res.json({
        success: true,
        message: "Campaign deleted successfully",
    });

});

export const send = asyncHandler(async (req: Request, res: Response) => {

    const campaignId = Array.isArray(req.params.id)
        ? req.params.id[0]
        : req.params.id;

    const campaign = await sendCampaign(
        campaignId,
        req.user!.id
    );

    res.json({
        success: true,
        message: "Campaign sent successfully",
        data: campaign,
    });

});