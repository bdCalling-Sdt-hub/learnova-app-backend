import express, { NextFunction, Request, Response } from "express";
import { USER_ROLES } from '../../../enums/user';
import { UserController } from './user.controller';
import auth from '../../middlewares/auth';
import fileUploadHandler from '../../middlewares/fileUploaderHandler';
import { getSingleFilePath } from "../../../shared/getFilePath";
const router = express.Router();

router.get(
    '/profile',
    auth(
        USER_ROLES.SUPER_ADMIN, 
        USER_ROLES.ADMIN,
        USER_ROLES.TEACHER,
        USER_ROLES.STUDENT,
    ),
    UserController.getUserProfile
);

router
    .route('/')
    .post(
        UserController.createUser
    )
    .patch(
        auth(
            USER_ROLES.SUPER_ADMIN, 
            USER_ROLES.ADMIN,
            USER_ROLES.TEACHER,
            USER_ROLES.STUDENT,
        ),
        fileUploadHandler(),
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const profile = getSingleFilePath(req.files, "image");

                req.body = { profile, ...req.body };
                next();

            } catch (error) {
                res.status(500).json({ message: "Failed to Getting Image" });
            }
        },
        UserController.updateProfile
    );

router.get("/teacher-home-profile", 
    auth(USER_ROLES.TEACHER),
    UserController.teacherHomeProfile
)

router.get("/teacher-profile", 
    auth(USER_ROLES.TEACHER),
    UserController.teacherProfile
)

router.get("/student-profile", 
    auth(USER_ROLES.STUDENT),
    UserController.studentProfile
)

export const UserRoutes = router;