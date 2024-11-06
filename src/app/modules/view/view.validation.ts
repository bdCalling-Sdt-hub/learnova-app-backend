import { z } from 'zod';
import { objectIdZodSchema } from '../../../helpers/checkObjectIdZodSchemaHelper';

const viewSchema = z.object({
    course: objectIdZodSchema("Course ID"), // Validates course as an ObjectId
    lesson: objectIdZodSchema("Lesson ID"), // Validates lesson as an ObjectId
    teacher: objectIdZodSchema("Teacher ID"), // Validates teacher as an ObjectId
    student: objectIdZodSchema("Student ID"), // Validates student as an ObjectId
    watchTime: z.number().min(0, { message: "Watch time must be a non-negative number" })
});

export const ViewValidation = {
    viewSchema
};