import { StatusCodes } from "http-status-codes";
import ApiError from "../../../errors/ApiErrors";
import { IShort } from "./short.interface";
import { Shorts } from "./short.model";

const createShortToDB = async(payload: IShort): Promise<IShort>=>{
    const result  = await Shorts.create(payload);
    if(!result) throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to created Shorts");
    return result;
}

export const ShortService = { createShortToDB }