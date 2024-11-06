import { z } from 'zod';
import { Level } from './short.interface';
import { objectIdZodSchema } from '../../../helpers/checkObjectIdZodSchemaHelper';

// Schema for the IShort type
const shortCreatedZodSchema = z.object({
    cover: z.string().min(1, { message: "Cover image URL is required" }),
    title: z.string().min(1, { message: "Title is required" }),
    subject: z.string().min(1, { message: "Subject is required" }),
    description: z.string().min(1, { message: "Description is required" }),
    level: z.enum([Level.Beginner, Level.Intermediate, Level.Advance], {
        required_error: "Level is required",
    }),
    suitable: z.string().min(1, { message: "Suitable field is required" }),
    teacher: objectIdZodSchema("Teacher ID"), // Validates teacher as an ObjectId
});

export const ShortValidation = {
    shortCreatedZodSchema
};
