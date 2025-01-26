import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import { NotificationController } from './notification.controller';
const router = express.Router();

router.get('/',
  auth(USER_ROLES.TEACHER),
  NotificationController.getNotificationFromDB
);
router.get(
  '/admin',
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  NotificationController.adminNotificationFromDB
);
router.patch('/',
  auth(USER_ROLES.STUDENT),
  NotificationController.readNotification
);

router.patch(
  '/admin',
  auth(USER_ROLES.TEACHER),
  NotificationController.adminReadNotification
);

router.patch(
  '/admin/:id',
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  NotificationController.adminReadSingleNotification
);

export const NotificationRoutes = router;
