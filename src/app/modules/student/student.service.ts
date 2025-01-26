import { JwtPayload } from "jsonwebtoken";
import { IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import unlinkFile from "../../../shared/unlinkFile";
import { Bio } from "../bio/bio.model";

const updateStudentToDB = async (user: JwtPayload,payload: Partial<IUser>): Promise<IUser | null> => {

    const { profile, name, ...restPayload} = payload;

    const isExistUser:any = await User.findById(user.id).lean();

    if(profile && isExistUser.profile?.startsWith("/")){
        unlinkFile(isExistUser.profile);
    }

    console.log(payload)

    const updateBio = await Bio.findOneAndUpdate(
        { student: user.id },
        { $set: restPayload },
        { new: true }
    );

    const updateDoc = await User.findOneAndUpdate(
        { _id: user.id },
        { name: name, profile: profile, },
        { new: true }
    );

    if(!updateDoc || !updateBio){
        throw new Error("Failed to update student");
    };

    return updateDoc;

}


const studentProfileFromDB = async (user: JwtPayload): Promise<IUser> => {


    const [student, bio] = await Promise.all([
        User.findById(user.id).select("name profile").lean(),
        Bio.findOne({ student: user.id }).select("grade school ").lean()
    ])

    if (!student){
        throw new Error("Student not found");
    }
    const data = {
        ...student,
        ...bio
    } as any
    return data;
}

export const StudentService = {
    updateStudentToDB,
    studentProfileFromDB
}