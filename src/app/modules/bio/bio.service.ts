import { StatusCodes } from "http-status-codes";
import ApiError from "../../../errors/ApiErrors";
import { IBio } from "./bio.interface";
import { Bio } from "./bio.model";
import { User } from "../user/user.model";

const createBioToDB = async (payload: IBio): Promise<IBio | null> =>{
    const bio :any = await Bio.create(payload);
    if(!bio){
        throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to create Bio");
    }

    await User.findByIdAndUpdate(
        {_id: payload.student },
        {bio: bio ._id},
        {new: true}
    );
    return null;
}

export const BioService = {
    createBioToDB
}