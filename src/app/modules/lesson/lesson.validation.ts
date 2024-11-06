import { z } from 'zod';
import { objectIdZodSchema } from '../../../helpers/checkObjectIdZodSchemaHelper';

// Schema for the Note type
const noteSchema = z.object({
    topic: z.string({ required_error: 'Topic is required' }),
    title: z.string({ required_error: 'Title is required' }).min(1, { message: "Title is required" }),
    description: z.string({ required_error: 'Description is required' })
});

// Schema for the ILesson type
const lessonSchema = z.object({
    video: z.string({ required_error: 'Video is required' }),
    title: z.string({ required_error: 'Title is required' }),
    notes: z.array(noteSchema),
    course: objectIdZodSchema("Course Id"),
    teacher: objectIdZodSchema("Teacher Id"),
});

export const LessonValidation = {
    lessonSchema
};
