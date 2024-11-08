import { z } from 'zod';
import { objectIdZodSchema } from '../../../helpers/checkObjectIdZodSchemaHelper';

const quizCreateZodSchema = z.object({
    question: z.string().min(1, { message: "Question is required" }),
    option: z.tuple([
        z.string().min(1, { message: "Option 1 cannot be empty" }),
        z.string().min(1, { message: "Option 2 cannot be empty" }),
        z.string().min(1, { message: "Option 3 cannot be empty" }),
        z.string().min(1, { message: "Option 4 cannot be empty" }),
    ]),
    answer: z.string().min(1, { message: "Answer is required" }),
    explanation: z.string().min(1, { message: "Explanation is required" }),
    short: objectIdZodSchema("Short ID"), // Validates short as an ObjectId
    course: objectIdZodSchema("Course ID"), // Validates short as an ObjectId
    teacher: objectIdZodSchema("Teacher ID") // Validates Teacher as an ObjectId
});

export const QuizValidation = {
    quizCreateZodSchema,
};
