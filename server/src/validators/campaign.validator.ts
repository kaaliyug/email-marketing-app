import { z } from "zod";

export const createCampaignSchema = z.object({
    name: z.string().min(2),
    subject: z.string().min(2),
    body: z.string().min(1),
    audienceId: z.string().optional(),
    manualRecipients: z.array(
        z.object({
            id: z.string(),
            name: z.string(),
            email: z.string().email(),
        })
    ).optional(),
    scheduledAt: z.string().datetime().optional(),
});

export const updateCampaignSchema = z.object({
    name: z.string().min(2).optional(),
    subject: z.string().min(2).optional(),
    body: z.string().min(1).optional(),
    audienceId: z.string().optional().nullable(),
    manualRecipients: z.array(
        z.object({
            id: z.string(),
            name: z.string(),
            email: z.string().email(),
        })
    ).optional(),
    scheduledAt: z.string().datetime().optional().nullable(),
});

export type CreateCampaignInput = z.infer<typeof createCampaignSchema>;
export type UpdateCampaignInput = z.infer<typeof updateCampaignSchema>;
