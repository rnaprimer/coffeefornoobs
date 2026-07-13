import { z } from 'zod';

export const preferencesSchema = z.object({
  experience_level: z.enum(['Beginner', 'Intermediate', 'Advanced']),
  preferred_brew_method: z.enum([
    'Espresso',
    'Aeropress',
    'Pour Over',
    'French Press',
    'Moka Pot',
    'Cold Brew'
  ]),
  budget_range: z.enum([
    'Under ₹5k',
    '₹5k–₹10k',
    '₹10k–₹20k',
    '₹20k+'
  ]),
  preferred_roast_level: z.enum(['Light', 'Medium', 'Dark']),
  preferred_currency: z.string().min(1, 'Please select a currency'),
});

export type PreferencesFormValues = z.infer<typeof preferencesSchema>;
