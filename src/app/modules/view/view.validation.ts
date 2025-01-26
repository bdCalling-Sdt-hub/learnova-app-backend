import { z } from 'zod';

const viewSchema = z.object({
    body: z.object({
        short: z.string({required_error: 	"Short ID is required"}).optional(),
        course: z.string({required_error: 	"Course ID is required"}).optional(),
        lesson: z.string({required_error: 	"Lesson ID is required"}).optional(),
        teacher: z.string({required_error: 	"Teacher ID is required"}),
        // watchTime: z.number({required_error: 	"Watch time is required"})
    })
});

export const ViewValidation = {
    viewSchema
};