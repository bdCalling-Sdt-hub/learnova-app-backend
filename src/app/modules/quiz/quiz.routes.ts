import express from "express"
import auth from "../../middlewares/auth";
import { USER_ROLES } from "../../../enums/user";
import validateRequest from "../../middlewares/validateRequest";
import { QuizValidation } from "./quiz.validation";
import { QuizController } from "./quiz.controller";
const router = express.Router();

router.post("/", 
    auth(USER_ROLES.TEACHER), 
    validateRequest(QuizValidation.quizCreateZodSchema), 
    QuizController.createQuiz
)

export const QuizRoutes = router; 