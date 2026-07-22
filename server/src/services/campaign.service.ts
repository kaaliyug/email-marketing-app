import prisma from "../config/prisma.js";
import type {
    CreateCampaignInput,
    UpdateCampaignInput,
} from "../validators/campaign.validator.js";
import { campaignQueue } from "../queues/campaign.queue.js";

export const createCampaign = async (
    userId: string,
    data: CreateCampaignInput
) => {

    const campaign = await prisma.campaign.create({
        data: {
            ...data,
            audienceId: data.audienceId || undefined,
            manualRecipients: data.manualRecipients,
            userId,
            status: data.scheduledAt ? "SCHEDULED" : "DRAFT", },});

    if (data.scheduledAt) {

        const delay =
            new Date(data.scheduledAt).getTime() - Date.now();

        await campaignQueue.add(
            "sendCampaign",
            {
                campaignId: campaign.id,
                userId,
            },
            {
                delay: Math.max(delay, 0),
            }
        );

    }

    return campaign;
};

export const getCampaigns = async (userId: string) => {

    return prisma.campaign.findMany({
        where: {
            userId,
        },
        orderBy: {
            createdAt: "desc",
        },
    });

};

export const updateCampaign = async (
    userId: string,
    campaignId: string,
    data: UpdateCampaignInput
) => {

    const campaign = await prisma.campaign.findFirst({
        where: {
            id: campaignId,
            userId,
        },
    });

    if (!campaign) {
        throw new Error("Campaign not found");
    }

    return prisma.campaign.update({
        where: {
            id: campaignId,
        },
        data: {
            ...data,
            audienceId: data.audienceId || undefined,
            manualRecipients: data.manualRecipients ?? undefined,
            scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : undefined, },  });

        };

export const deleteCampaign = async (
    userId: string,
    campaignId: string
) => {

    const campaign = await prisma.campaign.findFirst({
        where: {
            id: campaignId,
            userId,
        },
    });

    if (!campaign) {
        throw new Error("Campaign not found");
    }

    await prisma.campaign.delete({
        where: {
            id: campaignId,
        },
    });

};