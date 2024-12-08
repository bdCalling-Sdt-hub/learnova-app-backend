import express from "express"
import auth from "../../middlewares/auth";
import { USER_ROLES } from "../../../enums/user";
import validateRequest from "../../middlewares/validateRequest";
import { SubjectValidation } from "./subject.validation";
import { SubjectController } from "./subject.controller";
const router = express.Router();

router.route("/")
    .post(
        auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
        validateRequest(SubjectValidation.createSubjectZodSchema),
        SubjectController.createSubject
    )
    .get(
        auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN, USER_ROLES.TEACHER, USER_ROLES.STUDENT),
        SubjectController.getSubject
    );

router.delete("/:id",
    auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
    SubjectController.deleteSubject
);
export const SubjectRoutes = router;