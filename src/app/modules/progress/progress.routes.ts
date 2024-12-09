import express from "express";
import auth from "../../middlewares/auth";
import { USER_ROLES } from "../../../enums/user";
import validateRequest from "../../middlewares/validateRequest";
import { ProgressController } from "./progress.controller";
import { ProgressValidation } from "./progress.validation";
const router = express.Router();

router.post("/", 
    auth(USER_ROLES.STUDENT),
    validateRequest(ProgressValidation.createCourseProgressZodSchema),
    ProgressController.createProgress
    
);

export const ProgressRoutes = router;