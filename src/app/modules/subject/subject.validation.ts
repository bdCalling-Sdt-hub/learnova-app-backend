import { z } from "zod";


const createSubjectZodSchema = z.object({
    body: z.object({
        name : z.string({required_error: "Name is Required"})
    })
})

export  const SubjectValidation ={
    createSubjectZodSchema
}