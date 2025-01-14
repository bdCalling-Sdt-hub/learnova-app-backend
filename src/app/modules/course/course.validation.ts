import { z } from 'zod';

const LevelEnum = z.enum(['Beginner', 'Intermediate', 'Advanced']);
const GradeEnum = z.enum(["Primary 1", "Primary 2", "Primary 3", "Primary 4", "Primary 5", "Primary 6", "Form 1", "Form 2", "Form 3", "Form 4", "Form 5", "Form 6" ]);

const createCourseZodSchema = z.object({
    body: z.object({
        cover: z.string({ required_error: 'Cover is required' }),
        title: z.string({ required_error: 'Title is required' }).min(1, "Title cannot be empty"),
        description: z.string({ required_error: 'Description is required' }).min(1, "Description cannot be empty"),
        subject: z.string({ required_error: 'Subject is required' }),
        level: LevelEnum, // Enforce the enum level validation
        grade: GradeEnum, // Enforce the enum level validation
        suitable: z.string({ required_error: 'Suitable is required' }),
        aboutTeacher: z.string({ required_error: 'About Teacher is required' })
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
