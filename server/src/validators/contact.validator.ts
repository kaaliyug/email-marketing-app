import { z } from "zod";

export const createContactSchema = z.object({
    name: z.string().min(2),
    email: z.email(),
    phone: z.string().optional(),
    customFields: z.record(z.string(), z.unknown()).optional(),
});

export const updateContactSchema = z.object({
    name: z.string().min(2).optional(),
    email: z.email().optional(),
    phone: z.string().optional(),
    customFields: z.record(z.string(), z.unknown()).optional(),
});

export type CreateContactInput = z.infer<typeof createContactSchema>;
export type UpdateContactInput = z.infer<typeof updateContactSchema>;