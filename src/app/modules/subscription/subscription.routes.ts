import express from "express";
import auth from "../../middlewares/auth";
import { USER_ROLES } from "../../../enums/user";
import { SubscriptionController } from "./subscription.controller";
const router = express.Router();

router.route("/")
    .get(
        auth(USER_ROLES.STUDENT),
        SubscriptionController.subscriptionDetails
    );

router.route("/admin")
    .get(
        auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
        SubscriptionController.subscriptionsList
    )

export const SubscriptionRoutes = router;