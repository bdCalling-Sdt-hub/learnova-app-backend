import { z } from 'zod';
import { objectIdZodSchema } from '../../../helpers/checkObjectIdZodSchemaHelper';

const createLikeZodSchema = z.object({
    teacher: objectIdZodSchema("Teacher ID"),
    student: objectIdZodSchema("Student ID"),
    course: objectIdZodSchema("Course ID"),
});

export const LikeValidation = {
    createLikeZodSchema
};