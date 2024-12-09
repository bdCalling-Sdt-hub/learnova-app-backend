import { z } from "zod";
import { objectIdZodSchema } from "../../../helpers/checkObjectIdZodSchemaHelper";

const createEnrollZodSchema = z.object({
    body: z.object({
        teacher : objectIdZodSchema("Teacher Id"),
        course : objectIdZodSchema("Course Id"),
    })
});

export const EnrollValidation = {
    createEnrollZodSchema
}