import { model, Schema } from "mongoose";
import { USER_ROLES } from "../../../enums/user";
import { IUser, UserModal } from "./user.interface";
import bcrypt from "bcrypt";
import ApiError from "../../../errors/ApiErrors";
import { StatusCodes } from "http-status-codes";
import config from "../../../config";

const userSchema = new Schema<IUser, UserModal>(
    {
        name: {
            type: String,
            required: false,
        },
        appId: {
            type: String,
            required: false,
        },
        role: {
            type: String,
            enum: Object.values(USER_ROLES),
            required: true,
        },
        email: {
            type: String,
            required: false,
        },
        designation: {
            type: String,
            required: false,
        },
        contact: {
            type: String,
            required: false,
        },
        isSubscribe: {
            type: Boolean
        },
        password: {
            type: String,
            required: false,
            select: 0
        },
        profile: {
            type: String,
            default: 'https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg',
        },
        verified: {
            type: Boolean,
            default: false,
        },
        status: {
            type: String,
            enum: ["Pending", "Approved", "Restricted", "Blocked"],
            required: false
        },
        authentication: {
            type: {
                isResetPassword: {
                    type: Boolean,
                    default: false,
                },
                oneTimeCode: {
                    type: Number,
                    default: null,
                },
                expireAt: {
                    type: Date,
                    default: null,
                },
            },
            select: 0
        },
        accountInformation: {
            status: {
                type: Boolean
            },
            stripeAccountId: {
                type: String
            },
            externalAccountId: {
                type: String
            },
            stripeAccountURL: {
                type: String
            }
        }
    },
    {
        timestamps: true
    }
)


//exist user check by id
userSchema.statics.isExistUserById = async (id: string) => {
    const isExist = await User.findById(id);
    return isExist;
};

//exist user check by email
userSchema.statics.isExistUserByEmail = async (email: string) => {
    const isExist = await User.findOne({ email });
    return isExist;
};
  
//account check by user id
userSchema.statics.isAccountCreated = async (id: string) => {
    const isUserExist:IUser | null = await User.findById(id);
    return isUserExist?.accountInformation?.status;
};
  
//is match password
userSchema.statics.isMatchPassword = async ( password: string, hashPassword: string): Promise<boolean> => {
    return await bcrypt.compare(password, hashPassword);
};
  
//check user
userSchema.pre('save', async function (next) {
    
    const user = this as IUser;

    // Check if a user with the same email already exists
    const isExist = await User.findOne({ email: user.email });
    if (isExist) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Email already exists!');
    }

    // Hash the password if it exists
    if (user.password) {
        user.password = await bcrypt.hash(user.password, Number(config.bcrypt_salt_rounds));
    }

    // If the role is TEACHER, set accountInformation to default values if not already set
    if (user.role === USER_ROLES.TEACHER) {
        user.status = "Pending";
        user.accountInformation = {
            status: false
        };
    }
    
    // If the role is STUDENT, set isSubscribe to false;
    if (user.role === USER_ROLES.STUDENT) {
        user.isSubscribe = false
    }

    next();
});
export const User = model<IUser, UserModal>("User", userSchema)