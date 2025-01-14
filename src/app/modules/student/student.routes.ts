import express, { NextFunction, Request, Response } from "express";
import { StudentController } from "./student.controller";
import auth from "../../middlewares/auth";
import { USER_ROLES } from "../../../enums/user";
import fileUploadHandler from "../../middlewares/fileUploaderHandler";
import { getSingleFilePath } from "../../../shared/getFilePath";

const router = express.Router();

router.route("/")
    .get(
        auth(USER_ROLES.STUDENT), StudentController.studentProfile
    )
    .patch(
        auth(USER_ROLES.STUDENT),
        fileUploadHandler(),
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const payload = req.body;

                // extract image file path;
                const profile = getSingleFilePath(req.files, "image");

                req.body = { profile, ...payload };

                next();

            } catch (error) {
                res.status(500).json({ message: "Need Array to insert Multiple Question together" });
            }
        },
        StudentController.updateStudent
    );

export const StudentRoutes = router