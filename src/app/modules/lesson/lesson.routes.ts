import express, { NextFunction, Request, Response } from "express";
import multer from 'multer';
import { handleChunkUpload } from "../../../helpers/handleChunkUploadHelper";
import auth from "../../middlewares/auth";
import { USER_ROLES } from "../../../enums/user";
import { LessonController } from "./lesson.controller";
import validateRequest from "../../middlewares/validateRequest";
import { LessonValidation } from "./lesson.validation";
import fileUploadHandler from "../../middlewares/fileUploaderHandler";
const upload = multer({ dest: 'uploads/' });
const router = express.Router();

router.post('/', 
    auth(USER_ROLES.TEACHER), 
    LessonController.createLesson
);
router.get("/:id", auth(USER_ROLES.TEACHER), validateRequest(LessonValidation.lessonSchema), LessonController.getLessonByCourse)
router.get("/details/:id", auth(USER_ROLES.TEACHER), LessonController.lessonDetails)

export const LessonRoutes = router;