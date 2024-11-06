import express from "express";
import auth from "../../middlewares/auth";
import { USER_ROLES } from "../../../enums/user";
import validateRequest from "../../middlewares/validateRequest";
import { FollowingController } from "./following.controller";
import { FollowingValidation } from "./following.validation";
const router = express.Router();

router.post("/", 
    auth(USER_ROLES.STUDENT), 
    validateRequest(FollowingValidation.createFollowingZodSchema), 
    FollowingController.toggleFollowing
);
router.post("/:id", auth(USER_ROLES.TEACHER), FollowingController.followingCount);

export const FollowingRoutes = router;