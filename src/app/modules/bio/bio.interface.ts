import { Model } from "mongoose";


export enum Grade {
    Primary1 = "Primary 1",
    Primary2 = "Primary 2",
    Primary3 = "Primary 3",
    Primary4 = "Primary 4",
    Primary5 = "Primary 5",
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
    school: string;
    grade: Grade ;
    hearAbout: HearAbout ;
}

export type BioModel =  Model<IBio, Record<string, unknown>>;