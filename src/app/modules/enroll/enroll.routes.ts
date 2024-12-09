import express from "express";
import auth from "../../middlewares/auth";
import { USER_ROLES } from "../../../enums/user";
import validateRequest from "../../middlewares/validateRequest";
import { EnrollValidation } from "./enroll.validation";
import { EnrollController } from "./enroll.controller";
const router = express.Router();

router.route("/")
    .post(
        auth(USER_ROLES.STUDENT),
        validateRequest(EnrollValidation.createEnrollZodSchema),
        EnrollController.createEnrollCourse
    );

router.get("/:id",
    auth(USER_ROLES.STUDENT),
    EnrollController.enrollCourseDetails
)




export const EnrollRoutes = router;