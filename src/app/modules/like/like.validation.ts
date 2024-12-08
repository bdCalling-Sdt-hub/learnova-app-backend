import { z } from 'zod';
import { objectIdZodSchema } from '../../../helpers/checkObjectIdZodSchemaHelper';

const createLikeZodSchema = z.object({
    body: z.object({
        course: objectIdZodSchema("Course ID").optional(),
        short: objectIdZodSchema("Short ID").optional()
    })
});

export const LikeValidation = {
    createLikeZodSchema
};