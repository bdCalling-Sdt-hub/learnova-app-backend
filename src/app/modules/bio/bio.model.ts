import { model, Schema } from "mongoose";
import { IBio, BioModel, Grade, HearAbout } from "./bio.interface";

const bioSchema = new Schema<IBio, BioModel>(
    {
        school: {
            type: String,
            required: true
        },
        grade: {
            type: String,
            enum: Object.values(Grade),
            required: true
        },
        hearAbout: {
            type: String,
            enum: Object.values(HearAbout),
            required: true
        },
    },
    {
        timestamps: true
    }
)

export const Package = model<IBio, BioModel>("Bio", bioSchema)