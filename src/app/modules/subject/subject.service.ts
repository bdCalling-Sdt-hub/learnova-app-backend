import { StatusCodes } from "http-status-codes";
import ApiError from "../../../errors/ApiErrors";
import { ISubject } from "./subject.interface";
import { Subject } from "./subject.model";
import mongoose from "mongoose";

const createSubjectToDB = async(payload: ISubject): Promise<ISubject | null>=>{

    const subject = await Subject.create(payload);
    if(!subject){
        throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to create Subject");
    }
    return subject;
}

const getSubjectFromDB = async(): Promise<ISubject[]>=>{
    const subjects = await Subject.find({}).select("name");
    return subjects;
}


const deleteSubjectToDB = async(id: string): Promise<ISubject | null>=>{

    if(!mongoose.Types.ObjectId.isValid(id)){
        throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid ID")
    }

    const subject = await Subject.findByIdAndDelete(id);
    if(!subject){
        throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to delete Subject");
    }
    return subject;
}

export const SubjectService = {
    createSubjectToDB,
    getSubjectFromDB,
    deleteSubjectToDB
}