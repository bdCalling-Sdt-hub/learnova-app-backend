import { z } from 'zod';
import { Grade, HearAbout } from './bio.interface';

// Schema for the IShort type
const bioCreatedZodSchema = z.object({
    body: z.object({
        school: z.string().min(1, { message: "Current School is required" }),
        subject: z.string().min(1, { message: "Elective Subject is required" }),
        grade: z.nativeEnum(Grade, {
            required_error: "Grade is required",
        }),
        hearAbout: z.nativeEnum(HearAbout, {
            required_error: "Hear About Us is required",
        })
    })
});

export const BioValidation = {
    bioCreatedZodSchema
};