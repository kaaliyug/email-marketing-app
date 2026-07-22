import prisma from "../config/prisma.js";
import type { CreateAudienceInput } from "../validators/audience.validator.js";

export const createAudience = async ( userId: string, data: CreateAudienceInput ) => {
    
    return prisma.audience.create({
        data: {
            ...data,
            userId,
        },
    });
};

export const getAudiences = async ( userId: string) => {

    const audiences = await prisma.audience.findMany({

        where: {
            userId,
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    const contacts = await prisma.contact.findMany({
        where: {
            userId,
        },
    });

    const result = audiences.map((audience) => {
        const contactCount = contacts.filter((contact) => {
            const customFields = contact.customFields as Record<string, any>;
            return (
                customFields?.[audience.filterField] === audience.filterValue
            );
        }).length;
        return {
            ...audience,
            contactCount,
        };
    });
    return result;
};

export const updateAudience = async ( userId: string, audienceId: string, data: Partial<CreateAudienceInput>) => {

    const audience = await prisma.audience.findFirst({
        where: {
            id: audienceId,
            userId,
        },
    });
    if (!audience) {
        throw new Error("Audience not found");
    }

    return prisma.audience.update({
        where: {
            id: audienceId,
        },
        data,
    });
};

export const deleteAudience = async ( userId: string, audienceId: string) => {
    
    const audience = await prisma.audience.findFirst({
        where: {
            id: audienceId,
            userId,
        },
    });

    if (!audience) {
        throw new Error("Audience not found");
    }

    await prisma.audience.delete({
        where: {
            id: audienceId,
        },
    });
};