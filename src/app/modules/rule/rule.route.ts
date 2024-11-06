import express from 'express';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middlewares/auth';
import { RuleController } from './rule.controller';
const router = express.Router();

//terms and conditions
router
    .route('/terms-and-conditions')
    .post(auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN), RuleController.createTermsAndCondition)
    .get(RuleController.getTermsAndCondition);