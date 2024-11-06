import  express from "express"
import { USER_ROLES } from "../../../enums/user";
import validateRequest from "../../middlewares/validateRequest";
import auth from "../../middlewares/auth";
import { ShortController } from "./short.controller";
import { ShortValidation } from "./short.validation";
const router  = express.Router();

router.post("/", 
    auth(USER_ROLES.TEACHER), 
    validateRequest(ShortValidation.shortCreatedZodSchema), 
    ShortController.createShort
);

export  const ShortRoutes = router;