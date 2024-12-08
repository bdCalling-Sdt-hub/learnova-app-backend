import { z } from 'zod';
import { objectIdZodSchema } from '../../../helpers/checkObjectIdZodSchemaHelper';

const quizCreateZodSchema = z.object({
    body: z.object({
        question: z.string({required_error: "Question is required"}),
        option: z.tuple([
            z.string({required_error: "Option 1 cannot be empty"}),
            z.string({required_error: "Option 1 cannot be empty"}),
            z.string({required_error: "Option 1 cannot be empty"}),
            z.string({required_error: "Option 1 cannot be empty"}),
        ]),
        answer: z.string({required_error: "Answer is required"}),
        explanation: z.string({required_error: "Explanation is required"}),
        short: objectIdZodSchema("Short ID").optional(),
        course: objectIdZodSchema("Course ID").optional(),
    })
});

export const QuizValidation = {
    quizCreateZodSchema,
};
