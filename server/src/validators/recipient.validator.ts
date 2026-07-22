import { z } from "zod";

export const recipientPreviewSchema = z.object({
    recipients: z
        .array(z.string())
        .min(1)
});

export type RecipientPreviewInput = z.infer<typeof recipientPreviewSchema>;