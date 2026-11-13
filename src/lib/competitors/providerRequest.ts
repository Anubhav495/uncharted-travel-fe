import { z } from 'zod';
import { isExistingProviderName, normalizeProviderName } from './catalog';
import { isSupportedTrekSlug } from './identity';

export const providerRequestSchema = z.object({
    providerName: z.string().trim().min(2).max(100).refine((value) => {
        const key = normalizeProviderName(value);
        return key.length > 0 && key.length <= 200;
    }, 'Enter a provider name.'),
    notes: z.string().trim().max(1000).optional(),
    trekSlug: z.string().refine(isSupportedTrekSlug, 'Select a supported trek.'),
}).strict().refine((value) => !isExistingProviderName(value.providerName), {
    message: 'This provider is already supported. Availability depends on the selected trek.', path: ['providerName'],
});
