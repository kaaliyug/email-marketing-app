import { Prisma } from "@prisma/client";
import prisma from "../config/prisma.js";
import type { CreateContactInput, UpdateContactInput } from "../validators/contact.validator.js";
import csv from "csv-parser";
import { Readable } from "stream";

export const createContact = async ( userId: string, data: CreateContactInput ) => {
    const orConditions: Prisma.ContactWhereInput[] = [ { email: data.email, }, ];

    if (data.phone) {
        orConditions.push({
            phone: data.phone,
        });
    }

    const existingContact = await prisma.contact.findFirst({
        where: {
            userId,
            OR: orConditions,
        },
    });

    console.log("Logged in userId:", userId);
    console.log("Incoming data:", data);
    console.log("Existing contact:", existingContact);

    if (existingContact) {
        throw new Error("Contact already exists");
    }
    
    return prisma.contact.create({
        data: {
            name: data.name,
            email: data.email,
            phone: data.phone,
            customFields: data.customFields as Prisma.InputJsonValue,
            userId,
        },
    });
};

export const getContacts = async ( userId: string, page: number, limit: number, search?: string ) => {

    const skip = (page - 1) * limit;
    const where = {
        userId,
        ...(search
            ? {
                  OR: [
                      {
                          name: {
                              contains: search,
                              mode: "insensitive" as const,
                          },
                      },
                      {
                          email: {
                              contains: search,
                              mode: "insensitive" as const,
                          },
                      },
                      {
                          phone: {
                              contains: search,
                          },
                      },
                  ],
              } : {}),
    };

    const [contacts, total] = await Promise.all([ prisma.contact.findMany({ where, skip, take: limit,
            orderBy: {
                createdAt: "desc",
            },
        }),
        prisma.contact.count({ where, }),
    ]);
    return {
        contacts,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
};

export const updateContact = async ( userId: string,  contactId: string, data: UpdateContactInput ) => {

    const contact = await prisma.contact.findFirst({

        where: {

            id: contactId,

            userId,

        },

    });


    if (!contact) {

        throw new Error(
            "Contact not found"
        );

    }


    return prisma.contact.update({

        where: {

            id: contactId,

        },
        data: {
            ...data,
           customFields:
           data.customFields as Prisma.InputJsonValue | undefined,
       },
    });
};

export const deleteContact = async ( userId: string, contactId: string ) => {

    const contact = await prisma.contact.findFirst({
        where: { id: contactId, userId, },
    });

    if (!contact) {
        throw new Error("Contact not found");
    }

    await prisma.contact.delete({
        where: {
            id: contactId,
        },
    });
    return;
};

export const importContactsFromCSV = async (
    userId: string,
    buffer: Buffer
) => {

    const rows: any[] = [];

    return new Promise((resolve, reject) => {

        Readable.from(buffer)

            .pipe(csv())

            .on("data", (row) => {

                rows.push(row);

            })

            .on("end", async () => {

                try {

                    let added = 0;

                    let skipped = 0;

                    for (const row of rows) {

                        // Skip rows without required fields
                        if (!row.name || !row.email) {

                            skipped++;

                            continue;

                        }

                        // Build duplicate conditions dynamically
                        const duplicateConditions = [];

                        if (row.email) {

                            duplicateConditions.push({
                                email: row.email,
                            });

                        }

                        if (row.phone) {

                            duplicateConditions.push({
                                phone: row.phone,
                            });

                        }

                        const existingContact =
                            await prisma.contact.findFirst({

                                where: {

                                    userId,

                                    OR: duplicateConditions,

                                },

                            });

                        if (existingContact) {

                            skipped++;

                            continue;

                        }

                        await prisma.contact.create({

                            data: {

                                name: row.name,

                                email: row.email,

                                phone: row.phone || null,

                                userId,

                                customFields: {

                                    city: row.city,

                                    tags: row.tags,

                                },

                            },

                        });

                        added++;

                    }

                    resolve({

                        added,

                        skipped,

                    });

                } catch (error) {

                    reject(error);

                }

            })

            .on("error", reject);

    });

};

export const getContactById = async (
    userId: string,
    contactId: string
) => {

    const contact = await prisma.contact.findFirst({

        where: {
            id: contactId,
            userId,
        },

    });

    if (!contact) {
        throw new Error("Contact not found");
    }

    return contact;

};