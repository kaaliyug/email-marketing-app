import prisma from "../config/prisma.js";

export const resolveCampaignRecipients = async (
    campaignId: string,
    userId: string
) => {

    const campaign = await prisma.campaign.findFirst({
        where: {
            id: campaignId,
            userId,
        },
        include: {
            audience: true,
        },
    });

    if (!campaign) {
        throw new Error("Campaign not found");
    }

    // Audience selected
    if (campaign.audienceId) {

        const contacts = await prisma.contact.findMany({
            where: {
                userId,
            },
        });

        return contacts.filter((contact) => {

            const fields =
                contact.customFields as Record<string, unknown> | null;

            const value =
                fields?.[campaign.audience!.filterField];

            return value === campaign.audience!.filterValue;

        });

    }

    // Manual recipients selected
    if (campaign.manualRecipients) {

        const recipients = campaign.manualRecipients as {
            id: string;
            name: string;
            email: string;
        }[];

        return recipients;

    }

    return [];

};