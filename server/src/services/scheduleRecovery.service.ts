import prisma from "../config/prisma.js";
import { campaignQueue } from "../queues/campaign.queue.js";

export const recoverScheduledCampaigns = async () => {

    const campaigns = await prisma.campaign.findMany({

        where: {

            status: "SCHEDULED",

            scheduledAt: {

                gt: new Date(),

            },

        },

    });

    for (const campaign of campaigns) {

        const delay =
            campaign.scheduledAt!.getTime() - Date.now();

        await campaignQueue.add(
            "sendCampaign",
            {
                campaignId: campaign.id,
                userId: campaign.userId,
            },

            {
                delay: Math.max(delay, 0),
                jobId: campaign.id,
            }
        );
        console.log(`Queued campaign ${campaign.id} with delay ${Math.max(delay, 0)}ms`);

    }

    console.log(
        `Recovered ${campaigns.length} scheduled campaign(s)`
    );

};