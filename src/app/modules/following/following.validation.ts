import { z } from 'zod';
import { objectIdZodSchema } from '../../../helpers/checkObjectIdZodSchemaHelper';

const createFollowingZodSchema = z.object({
    teacher: objectIdZodSchema("Teacher ID"),
    student: objectIdZodSchema("Student ID")
});

export const FollowingValidation = {
    createFollowingZodSchema
};