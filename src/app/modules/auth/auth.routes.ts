import express from 'express';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { AuthController } from './auth.controller';
import { AuthValidation } from './auth.validation';
import { BioValidation } from '../bio/bio.validation';
import { BioController } from '../bio/bio.controller';
const router = express.Router();

router.post(
    '/login',
    validateRequest(AuthValidation.createLoginZodSchema),
    AuthController.loginUser
);

router.post(
    '/forgot-password',
    validateRequest(AuthValidation.createForgetPasswordZodSchema),
    AuthController.forgetPassword
);

router.post(
    '/refresh-token',
    AuthController.newAccessToken
);

router.post(
    '/verify-email',
    validateRequest(AuthValidation.createVerifyEmailZodSchema),
    AuthController.verifyEmail
);

router.post(
    '/reset-password',
    validateRequest(AuthValidation.createResetPasswordZodSchema),
    AuthController.resetPassword
);

router.post(
    '/resend-otp',
    AuthController.resendVerificationEmail
);

router.post(
    '/social-login',
    AuthController.socialLogin
);

router.post(
    "/bio",
    auth(USER_ROLES.STUDENT), 
    validateRequest(BioValidation.bioCreatedZodSchema), 
    BioController.createBio
);

router.post(
    '/change-password',
    auth(
        USER_ROLES.SUPER_ADMIN, 
        USER_ROLES.ADMIN,
        USER_ROLES.TEACHER,
        USER_ROLES.STUDENT,
    ),
    validateRequest(AuthValidation.createChangePasswordZodSchema),
    AuthController.changePassword
);

export const AuthRoutes = router;