import express from 'express';
import { USER_ROLES } from '../../../enums/user';
import { UserController } from './user.controller';
import auth from '../../middlewares/auth';
import fileUploadHandler from '../../middlewares/fileUploaderHandler';
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
        UserController.updateProfile
    );
router.get("/teacher-profile", 
    auth(USER_ROLES.TEACHER),
    UserController.teacherProfile
)

export const UserRoutes = router;