import  express from "express"
import { USER_ROLES } from "../../../enums/user";
import validateRequest from "../../middlewares/validateRequest";
import auth from "../../middlewares/auth";
import { ViewValidation } from "./view.validation";
import { ViewController } from "./view.controller";
const router  = express.Router();

router.post("/", 
    auth(USER_ROLES.STUDENT), 
    validateRequest(ViewValidation.viewSchema), 
    ViewController.createView
);

export  const ShortRoutes = router;