import express from "express";
import auth from "../../middlewares/auth";
import { USER_ROLES } from "../../../enums/user";
import { LessonController } from "./lesson.controller";
const router = express.Router();

router.post('/', 
    auth(USER_ROLES.TEACHER), 
    LessonController.createLesson
);

router.route("/:id")
    .get(
        auth(USER_ROLES.TEACHER), LessonController.lessonDetails
    )
    .patch(
        auth(USER_ROLES.TEACHER), LessonController.updateLesson
    )
    .delete(
        auth(USER_ROLES.TEACHER), LessonController.deleteLesson
    )

export const LessonRoutes = router;