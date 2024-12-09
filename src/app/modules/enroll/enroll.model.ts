import { model, Schema, SchemaType } from "mongoose";
import { EnrollModel, IEnroll } from "./enroll.interface";

const enrollSchema = new Schema<IEnroll, EnrollModel> (
    {
        student: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        course: {
            type: Schema.Types.ObjectId,
            ref: "Course",
            required: true
        },
        teacher: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
    },
    {
        timestamps: true
    }
);

export const Enroll = model<IEnroll, EnrollModel>("Enroll", enrollSchema);