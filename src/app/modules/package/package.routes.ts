import express from "express";
import auth from "../../middlewares/auth";
import { USER_ROLES } from "../../../enums/user";
import { PackageController } from "./package.controller";
import validateRequest from "../../middlewares/validateRequest";
import { PackageValidation } from "./package.validation";
const router = express.Router()

router
    .route("/")
    .post( validateRequest(PackageValidation.createPackageZodSchema), auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN), PackageController.createPackage)
    .get(auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN, USER_ROLES.STUDENT), PackageController.getPackage)

router
    .route("/:id")
    .patch(auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN), PackageController.updatePackage)
    .get(auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.SUPER_ADMIN ), PackageController.packageDetails)

export const PackageRoutes = router;