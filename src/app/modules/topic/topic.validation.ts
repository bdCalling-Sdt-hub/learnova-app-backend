import { z } from 'zod';
import { objectIdZodSchema } from '../../../helpers/checkObjectIdZodSchemaHelper';

// Schema for the ILesson type
const topicCreateZodSchema = z.object({
    body: z.object({
        video: z.string({ required_error: 'Video is required' }),
        topic: z.string({ required_error: 'Topic is required' }),
        title: z.string({ required_error: 'Title is required' }),
        notes: z.string({ required_error: 'Notes is required' }),
        documents: z.string({ required_error: 'Documents is required' }).optional(),
        lesson: objectIdZodSchema("Lesson Id")
    })
});

export const TopicValidation = { topicCreateZodSchema };