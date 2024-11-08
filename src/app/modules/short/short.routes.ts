import express from "express"
import { USER_ROLES } from "../../../enums/user";
import validateRequest from "../../middlewares/validateRequest";
import auth from "../../middlewares/auth";
import { ShortController } from "./short.controller";
import { ShortValidation } from "./short.validation";
import fileUploadHandler from "../../middlewares/fileUploaderHandler";
const router = express.Router();

router.route("/")
    .post(
        auth(USER_ROLES.TEACHER),
        fileUploadHandler(),
        validateRequest(ShortValidation.shortCreatedZodSchema),
        ShortController.createShort
    )
    .get(
        auth(USER_ROLES.TEACHER),
        ShortController.getShortList
    );

router.get("/:id",
    auth(USER_ROLES.TEACHER),
    ShortController.shortDetails
)

export const ShortRoutes = router;