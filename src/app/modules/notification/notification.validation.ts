import { z } from 'zod';
import { objectIdZodSchema } from '../../../helpers/checkObjectIdZodSchemaHelper';

// Schema for the ILesson type
const notificationCreateZodSchema = z.object({
    body: z.object({
        title: z.string({ required_error: 'Title is required' }),
        course: objectIdZodSchema("Course Id")
    })
});

export const NotificationValidation = { notificationCreateZodSchema };