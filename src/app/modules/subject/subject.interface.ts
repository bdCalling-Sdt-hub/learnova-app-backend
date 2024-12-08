import { Model } from "mongoose";


export type ISubject = {
    name: string;
}

export type SubjectModel = Model<ISubject, Record<string, unknown >>;