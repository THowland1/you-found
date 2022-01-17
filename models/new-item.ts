import { z } from 'zod';

export const newItemSchema = z.object({
  itemName: z.string(),
  headline: z.string(),
  message: z.string(),
  phoneNumber: z.string(),
  showWhatsAppLink: z.boolean(),
  showPhoneCallLink: z.boolean(),
  showSMSLink: z.boolean(),
  emailAddress: z.string().email(),
  showEmailLink: z.boolean()
});

export type INewItem = z.infer<typeof newItemSchema>;
