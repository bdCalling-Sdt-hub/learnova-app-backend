import { StatusCodes } from "http-status-codes";
import ApiError from "../../../errors/ApiErrors";
import { ICourse } from "./course.interface";
import { Course } from "./course.model";
import { JwtPayload } from "jsonwebtoken";

const createCourseToDB = async(payload: ICourse): Promise<ICourse | null>=>{
    const result: ICourse = await Course.create(payload);
    if(!result){
        throw new ApiError(StatusCodes.BAD_GATEWAY, "Failed to created Course");
    }

    return result;
}

const getCourseFromDB = async(user: JwtPayload): Promise<ICourse[]>=>{

    const result: ICourse[]  | null = await Course.find({teacher: user.id});
    return result;
}

const courseDetailsFromDB = async(id: string): Promise<ICourse | null>=>{

    const result: ICourse | null = await Course.findById(id);
    return result;
}

export const CourseService = {
    createCourseToDB,
    getCourseFromDB,
    courseDetailsFromDB
}