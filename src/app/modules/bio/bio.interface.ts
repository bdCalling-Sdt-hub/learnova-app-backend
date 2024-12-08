import { Model, Types } from "mongoose";


export enum Grade {
    Primary1 = "Primary 1",
    Primary2 = "Primary 2",
    Primary3 = "Primary 3",
    Primary4 = "Primary 4",
    Primary5 = "Primary 5",
    Primary6 = "Primary 6",
    Form1 = "Form 1",
    Form2 = "Form 2",
    Form3 = "Form 3",
    Form4 = "Form 4",
    Form5 = "Form 5",
    Form6 = "Form 6",
}

export enum HearAbout {
    Instagram = "Instagram",
    Medium = "Medium",
    Threads = "Threads",
    Friends = "Friends",
    School = "School",
    Others = "Others",
}

// Define the Bio interface
export type IBio  = {
    student: Types.ObjectId;
    school: string;
    subject: string;
    grade: Grade ;
    hearAbout: HearAbout ;
}

export type BioModel =  Model<IBio, Record<string, unknown>>;