import express, { NextFunction, Request, Response } from "express";
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
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const payload = req.body;
    
                // extract video file path;
                let cover: string | undefined = undefined;
                if (req.files && "cover" in req.files && req.files.cover[0]) {
                    cover = `/covers/${req.files.cover[0].filename}`;
                }
    
                req.body = { cover, ...payload };
                next();
    
            } catch (error) {
                return res.status(500).json({ message: "An error occurred while processing the file." });
            }
        }, 
        validateRequest(CourseValidation.createCourseZodSchema), 
        CourseController.createCourse
    )
    .get(auth(USER_ROLES.TEACHER), CourseController.getCourse);

router.get("/student", auth(USER_ROLES.STUDENT), CourseController.getCourseForStudent);
router.get("/teacher/:id", auth(USER_ROLES.STUDENT), CourseController.teacherDetails);
router.get("/student/:id", auth(USER_ROLES.STUDENT), CourseController.courseDetailsForStudent);
router.get("/:id", auth(USER_ROLES.TEACHER), CourseController.courseDetails);

export const CourseRoutes = router;