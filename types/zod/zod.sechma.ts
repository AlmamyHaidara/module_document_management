import { z } from 'zod';

export const fieldSchema = z.object({
    cle: z.enum(['text', 'number', 'date', 'email']), // Limite les types aux valeurs disponibles
    valeur: z.string().min(1, "La valeur est requise"),
});

export const documentSchema = z.object({
    nom: z.string().min(1, "Le nom du document est requis"),
    code: z.string().min(1, "Le code est requis"),
    fields: z.array(fieldSchema),
});
