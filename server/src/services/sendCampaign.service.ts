import prisma from "../config/prisma.js";
import emailApi from "./email.service.js";
import { resolveCampaignRecipients } from "./campaignRecipient.service.js";

export const sendCampaign = async (
    campaignId: string,
    userId: string
) => {

    const campaign = await prisma.campaign.findFirst({

        where: {
            id: campaignId,
            userId,
        },

    });

    if (!campaign) {

        throw new Error(
            "Campaign not found"
        );

    }

    const recipients = await resolveCampaignRecipients(
        campaignId,
        userId
    );

    const emails = recipients
        .map(contact => contact.email)
        .filter((email): email is string => Boolean(email));

    if (emails.length === 0) {

        throw new Error(
            "No recipients found"
        );

    }

    const sender = {

        email: process.env.SENDER_EMAIL!,

        name: process.env.SENDER_NAME!

    };

    const receivers = emails.map(email => ({
        email
    }));

    const result = await emailApi.sendTransacEmail({

        sender,

        to: receivers,

        subject: campaign.subject,

        htmlContent: campaign.body,

    });

    console.log(result);

    await prisma.campaign.update({

        where: {
            id: campaignId,
        },

        data: {

            status: "SENT",

            sentCount: {
                increment: emails.length,
            },

            brevoMessageId: result.messageId,

        },

    });

    return {
        success: true,
        messageId: result.messageId,
    };

};