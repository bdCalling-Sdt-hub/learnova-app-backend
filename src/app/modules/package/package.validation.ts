import { z } from 'zod'

const createPackageZodSchema = z.object({
    body: z.object({
        title: z.string({required_error: "Title is required"}),
        price: z.number({required_error: "Number is required"}),
        duration: z.string({required_error: "Duration is required"}),
        feature: z.string({required_error: "Feature is required"}),
        priceId: z.string({required_error: "Price Id is required"}),
    })
})

export const PackageValidation = {
    createPackageZodSchema
}