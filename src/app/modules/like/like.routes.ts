import express from "express";
import auth from "../../middlewares/auth";
import { USER_ROLES } from "../../../enums/user";
import validateRequest from "../../middlewares/validateRequest";
import { LikeController } from "./like.controller";
import { LikeValidation } from "./like.validation";
const router = express.Router();

router.post("/", 
    auth(USER_ROLES.STUDENT), 
    validateRequest(LikeValidation.createLikeZodSchema), 
    LikeController.toggleLike
);
router.post("/:id", auth(USER_ROLES.TEACHER), LikeController.likeCount);

export const LikeRoutes = router;