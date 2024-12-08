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
    fileUploadHandler(),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const payload = req.body;

            // this is for video string;
            let video: string | undefined = undefined;
            if (req.files && "video" in req.files && req.files.video[0]) {
                video = `/videos/${req.files.video[0].filename}`;
            }

            // this is for image string;
            let image: string | undefined = undefined;
            if (req.files && "image" in req.files && req.files.image[0]) {
                image = `/images/${req.files.image[0].filename}`;
            }

            req.body = { image, video, ...payload };
            next();

        } catch (error) {
            return res.status(500).json({ message: "An error occurred while processing the CSV file." });
        }
    }, 
    LessonController.createLesson
);
router.get("/:id", auth(USER_ROLES.TEACHER), validateRequest(LessonValidation.lessonSchema), LessonController.getLessonByCourse)
router.get("/details/:id", auth(USER_ROLES.TEACHER), LessonController.lessonDetails)

export const LessonRoutes = router;