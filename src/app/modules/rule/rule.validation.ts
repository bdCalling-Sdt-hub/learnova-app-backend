import { z } from 'zod'

const createTermsAndConditionZodSchema = z.object({
  body: z.object({
    content: z.string({ required_error: 'Terms and conditions is required' }),
  }),
})
const updateTermsAndConditionZodSchema = z.object({
  body: z.object({
    content: z.string().optional(),
  }),
})

export const RuleValidation = {
  createTermsAndConditionZodSchema,
  updateTermsAndConditionZodSchema
}
