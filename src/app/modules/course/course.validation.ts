import { z } from 'zod';

const LevelEnum = z.enum(['Beginner', 'Intermediate', 'Advanced']); // replace these with actual levels if different

const createCourseZodSchema = z.object({
    body: z.object({
        teacher: z.string({ required_error: 'Teacher ID is required' }).refine(value => value.match(/^[a-fA-F0-9]{24}$/), {
            message: "Invalid ObjectId format for teacher",
        }),
        cover: z.string({ required_error: 'Cover is required' }),
        title: z.string({ required_error: 'Title is required' }).min(1, "Title cannot be empty"),
        description: z.string({ required_error: 'Description is required' }).min(1, "Description cannot be empty"),
        subject: z.string({ required_error: 'Subject is required' }),
        level: LevelEnum, // Enforce the enum level validation
        suitable: z.string({ required_error: 'Suitable is required' }),
        aboutTeacher: z.string({ required_error: 'About Teacher is required' }),
        rating: z.number({ required_error: 'Rating is required' }).min(0).max(5),
        ratingCount: z.number({ required_error: 'Rating Count is required' }).int().min(0),
    }),
});


const updateCourseZodSchema = z.object({
    body: z.object({
        cover: z.string().optional(),
        title: z.string().optional(),
        description: z.string().optional(),
        subject: z.string().optional(),
        level: LevelEnum.optional(),
        suitable: z.string().optional(),
        aboutTeacher: z.string().optional(),
        rating: z.number().min(0).max(5).optional(),
        ratingCount: z.number().int().min(0).optional(),
    }).refine(data => Object.keys(data).length > 0, {
        message: "At least one field must be provided to update",
        path: ["body"],
    }),
});

export const CourseValidation = {
    createCourseZodSchema,
    updateCourseZodSchema
};
