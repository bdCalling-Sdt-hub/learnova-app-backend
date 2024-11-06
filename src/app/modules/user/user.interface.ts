import { Model, Types } from 'mongoose';
import { USER_ROLES } from '../../../enums/user';

interface IStripeAccountInfo {
    status: boolean;
    stripeAccountId?: string;
    stripeAccountURL?: string;
    externalAccountId?: string;
}

interface IAuthenticationProps {
    isResetPassword: boolean;
    oneTimeCode: number;
    expireAt: Date;
}

export type IUser = {
    name?: string;
    appId?: string;
    role: USER_ROLES;
    contact?: string;
    isSubscribe?: boolean;
    email?: string;
    password?: string;
    profile: string;
    verified: boolean;
    bio?: Types.ObjectId;
    authentication?: IAuthenticationProps;
    accountInformation?: IStripeAccountInfo;
}

export type UserModal = {
    isExistUserById(id: string): any;
    isExistUserByEmail(email: string): any;
    isAccountCreated(id: string): any;
    isMatchPassword(password: string, hashPassword: string): boolean;
} & Model<IUser>;