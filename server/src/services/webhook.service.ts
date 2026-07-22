import prisma from "../config/prisma.js";

type BrevoWebhookPayload = {
    event: string;
    "message-id": string;
};

export const handleBrevoWebhook = async (
    payload: BrevoWebhookPayload
) => {

    const messageId = payload["message-id"];


    if (!messageId) {
        return;
    }

    const campaign = await prisma.campaign.findFirst({

        where: {
            brevoMessageId: messageId,
        },

    });


    if (!campaign) {

        console.log(
            "Campaign not found for message id:",
            messageId
        );

        return;
    }


    switch (payload.event) {


        case "delivered":

            await prisma.campaign.update({

                where: {
                    id: campaign.id,
                },

                data: {
                    deliveredCount: {
                        increment: 1,
                    },
                },

            });

            break;



        case "opened":

            await prisma.campaign.update({

                where: {
                    id: campaign.id,
                },

                data: {
                    openedCount: {
                        increment: 1,
                    },
                },

            });

            break;



        default:

            console.log(
                `Ignoring event: ${payload.event}`
            );

    }

};