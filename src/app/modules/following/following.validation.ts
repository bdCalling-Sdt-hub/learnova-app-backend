import { z } from 'zod';
import { objectIdZodSchema } from '../../../helpers/checkObjectIdZodSchemaHelper';

const createFollowingZodSchema = z.object({
    body: z.object({
        teacher: objectIdZodSchema("Teacher ID")
    })
});

export const FollowingValidation = {
    createFollowingZodSchema
};