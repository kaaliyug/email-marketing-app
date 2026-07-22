import prisma from "../config/prisma.js";


export const getCampaignAnalytics = async (
    userId: string,
    campaignId: string
) => {

    const campaign = await prisma.campaign.findFirst({

        where: {
            id: campaignId,
            userId,
        },

        select: {

            id: true,

            sentCount: true,

            deliveredCount: true,

            openedCount: true,

        },

    });


    if (!campaign) {

        throw new Error(
            "Campaign not found"
        );

    }


    return {

        sent: campaign.sentCount,

        delivered: campaign.deliveredCount,

        opened: campaign.openedCount,

    };

};