import { z } from "zod";

export const createAudienceSchema = z.object({
    name: z.string().min(2),
    filterField: z.string().min(1),
    filterValue: z.string().min(1),
});

export const updateAudienceSchema = z.object({
    name: z.string().min(2).optional(),
    filterField: z.string().optional(),
    filterValue: z.string().optional(),
});

export type CreateAudienceInput = z.infer<typeof createAudienceSchema>;

