import  express, { NextFunction, Request, Response } from "express"
import { USER_ROLES } from "../../../enums/user";
import validateRequest from "../../middlewares/validateRequest";
import auth from "../../middlewares/auth";
import { ViewValidation } from "./view.validation";
import { ViewController } from "./view.controller";
const router  = express.Router();

router.post("/", 
    auth(USER_ROLES.STUDENT),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { watchTime, ...othersPayload } = req.body;

            if (Number(watchTime) > 0) {
                othersPayload.watchTime = Number(watchTime);
            }
            req.body = { ...othersPayload, student: req.user.id };
            next();

        } catch (error) {
            return res.status(500).json({ message: "Failed to Convert string to number" });
        }
    }, 
    validateRequest(ViewValidation.viewSchema),
    ViewController.createView
);

router.get("/view-statistic", 
    auth(USER_ROLES.TEACHER),
    ViewController.viewStatistic
);

router.get("/watchTime-statistic", 
    auth(USER_ROLES.TEACHER),
    ViewController.viewStatistic
);

export  const ViewRoutes = router;