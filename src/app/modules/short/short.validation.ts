import { z } from 'zod';
import { Level } from './short.interface';
import { objectIdZodSchema } from '../../../helpers/checkObjectIdZodSchemaHelper';

// Schema for the IShort type
const shortCreatedZodSchema = z.object({
    body: z.object({
        cover: z.string({ message: "Cover image URL is required" }),
        video: z.string({ message: "Video URL is required" }),
        title: z.string({ message: "Title is required" }),
        subject: z.string({ message: "Subject is required" }),
        description: z.string({ message: "Description is required" }),
        level: z.enum([Level.Beginner, Level.Intermediate, Level.Advance], {
            required_error: "Level is required",
        }),
        suitable: z.string({ message: "Suitable field is required" })
    })
});

export const ShortValidation = {
    shortCreatedZodSchema
};
