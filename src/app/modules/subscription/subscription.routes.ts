import express from "express";
import auth from "../../middlewares/auth";
import { USER_ROLES } from "../../../enums/user";
import { SubscriptionController } from "./subscription.controller";
const router = express.Router();

router.post("/create-intent",
    auth(USER_ROLES.STUDENT),
    SubscriptionController.createPaymentIntent
)

router.route("/")
    .post(
        auth(USER_ROLES.STUDENT),
        SubscriptionController.createSubscription
    )
    .get(
        auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
        // SubscriptionController.createSubscription
    )

export const SubscriptionRoutes = router;