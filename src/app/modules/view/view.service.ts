import { StatusCodes } from "http-status-codes";
import ApiError from "../../../errors/ApiErrors";
import { IView } from "./view.interface";
import { View } from "./view.mode";

const createViewToDB = async (payload: IView): Promise<IView | null> => {

    const query={
        student: payload.student,
        course: payload.course,
        lesson: payload.lesson,
    }

    const isExistView = await View.findOne(query)

    if (isExistView && isExistView?.watchTime < payload.watchTime) {
        const result = await View.findByIdAndUpdate(
            query,
            { watchTime: payload.watchTime },
            { new: true }
        )
        return result;
    } else {
        const result = await View.create(payload);
        if (!result) throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to created View");

        return result;
    }


}

export const ViewService = {
    createViewToDB
}