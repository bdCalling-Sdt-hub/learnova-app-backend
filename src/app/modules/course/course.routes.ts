import express from "express";
import auth from "../../middlewares/auth";
import { USER_ROLES } from "../../../enums/user";
import { CourseController } from "./course.controller";
import validateRequest from "../../middlewares/validateRequest";
import { CourseValidation } from "./course.validation";
import fileUploadHandler from "../../middlewares/fileUploaderHandler";
const router = express.Router();

router.route("/")
    .post(
        auth(USER_ROLES.TEACHER),
        fileUploadHandler(), 
        validateRequest(CourseValidation.createCourseZodSchema), 
        CourseController.createCourse
    )
    .get(auth(USER_ROLES.TEACHER), CourseController.getCourse);

router.get("/:id", auth(USER_ROLES.TEACHER), CourseController.courseDetails)

export const CourseRoutes = router;