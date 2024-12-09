import { z } from "zod";
import { objectIdZodSchema } from "../../../helpers/checkObjectIdZodSchemaHelper";

const createCourseProgressZodSchema = z.object({
    body: z.object({
        topic : objectIdZodSchema("Teacher Id"),
        lesson : objectIdZodSchema("Course Id"),
    })
});

export const ProgressValidation = {
    createCourseProgressZodSchema
}
