import prisma from "../config/prisma.js";

export const previewRecipients = async ( userId: string, recipients: string[] ) => {

    const result = [];
    for (const value of recipients) {
        const contact = await prisma.contact.findFirst({
            where: {
                userId,
                OR: [
                    { email: value },
                    {phone: value }
                ]
            }
        });
        result.push({
            input: value,
            matched: !!contact,
            contact
        });
    }
    return result;
};