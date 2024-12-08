import { model, Schema } from "mongoose";
import { ISubject, SubjectModel } from "./subject.interface";

const subjectSchema = new Schema<ISubject, SubjectModel>(
    {
        name: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
);

export  const Subject = model<ISubject, SubjectModel>("Subject", subjectSchema)