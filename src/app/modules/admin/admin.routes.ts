import express, { NextFunction, Request, Response } from 'express';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middlewares/auth';
import { AdminController } from './admin.controller';
const router = express.Router();

router.get('/students',
    auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
    AdminController.studentsList
);

router.get('/teachers',
    auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
    AdminController.teachersList
);

router.get('/analytics',
    auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
    AdminController.analyticsChart
);

router.get('/top-courses-and-shorts',
    auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
    AdminController.topCoursesAndShorts
);

router.patch('/approved-and-rejected-teacher/:id',
    auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
    AdminController.approvedAndRejectedTeacher
);

router.get('/student/:id',
    auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
    AdminController.studentsDetails
);

router.get('/teacher/:id',
    auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
    AdminController.teachersDetails
);

export const AdminRoutes = router;