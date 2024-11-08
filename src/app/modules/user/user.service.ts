import { IUser } from "./user.interface";
import { JwtPayload } from 'jsonwebtoken';
import { User } from "./user.model";
import { StatusCodes } from "http-status-codes";
import ApiError from "../../../errors/ApiErrors";
import generateOTP from "../../../util/generateOTP";
import { emailTemplate } from "../../../shared/emailTemplate";
import { emailHelper } from "../../../helpers/emailHelper";
import unlinkFile from "../../../shared/unlinkFile";
import { ICreateAccount } from "../../../types/emailTemplate";
import { Following } from "../following/following.model";
import { View } from "../view/view.mode";

const createUserToDB = async (payload: Partial<IUser>): Promise<IUser> => {
  
    const createUser = await User.create(payload);
    if (!createUser) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to create user');
    }
  
    //send email
    const otp = generateOTP();
    const values: ICreateAccount = {
        name: createUser.name as string,
        otp: otp,
        email: createUser.email!
    };

    const createAccountTemplate = emailTemplate.createAccount(values);
    emailHelper.sendEmail(createAccountTemplate);
  
    //save to DB
    const authentication = {
        oneTimeCode: otp,
        expireAt: new Date(Date.now() + 3 * 60000),
    };

    await User.findOneAndUpdate(
        { _id: createUser._id },
        { $set: { authentication } }
    );
  
    return createUser;
};

const getUserProfileFromDB = async (user: JwtPayload): Promise<Partial<IUser>> => {
    const { id } = user;
    const isExistUser:any = await User.isExistUserById(id);
    if (!isExistUser) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
    }
    return isExistUser;
};

const updateProfileToDB = async ( user: JwtPayload, payload: Partial<IUser>): Promise<Partial<IUser | null>> => {
    const { id } = user;
    const isExistUser = await User.isExistUserById(id);
    if (!isExistUser) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
    }
  
    //unlink file here
    if (payload.profile) {
        unlinkFile(isExistUser.profile);
    }
  
    const updateDoc = await User.findOneAndUpdate(
        { _id: id }, 
        payload, 
        { new: true} 
    );
    return updateDoc;
};

const teacherProfileFromDB = async ( user: JwtPayload): Promise<Partial<IUser | {}>> => {

    const [teacher, totalFollower, totalView, totalWatchTime] = await Promise.all([
        User.findById(user.id).select("name profile").lean(),
        Following.countDocuments({ teacher: user.id }),
        View.countDocuments({ teacher: user.id }),
        View.aggregate([
            { $match: { teacher: user.id } },
            {
                $group: {
                    _id: null,
                    totalWatchTime: { $sum: "$watchTime" }
                }
            },
            {
                $project: {
                    totalWatchTime: { $divide: ["$totalWatchTime", 3600] }
                }
            }
        ])
    ]);

    if(!teacher) return {};

    const data = {
        ...teacher,
        totalFollower,
        totalView,
        totalWatchTime: totalWatchTime
    }

    return data;
};

export const UserService = {
    createUserToDB,
    getUserProfileFromDB,
    updateProfileToDB,
    teacherProfileFromDB
};