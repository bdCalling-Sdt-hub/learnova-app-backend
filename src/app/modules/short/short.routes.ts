import express, { NextFunction, Request, Response } from "express"
import { USER_ROLES } from "../../../enums/user";
import validateRequest from "../../middlewares/validateRequest";
import auth from "../../middlewares/auth";
import { ShortController } from "./short.controller";
import { ShortValidation } from "./short.validation";
import fileUploadHandler from "../../middlewares/fileUploaderHandler";
const router = express.Router();

router.route("/")
    .post(
        auth(USER_ROLES.TEACHER),
        fileUploadHandler(),
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const payload = req.body;

                // extract video file path;
                let video: string | undefined = undefined;
                if (req.files && "video" in req.files && req.files.video[0]) {
                    video = `/videos/${req.files.video[0].filename}`;
                }

                // extract image file path;
                let image: string | undefined = undefined;
                if (req.files && "image" in req.files && req.files.image[0]) {
                    image = `/images/${req.files.image[0].filename}`;
                }

                req.body = { cover: image, video, ...payload };
                next();

            } catch (error) {
                return res.status(500).json({ message: "An error occurred while processing the file." });
            }
        },
        validateRequest(ShortValidation.shortCreatedZodSchema),
        ShortController.createShort
    )
    .get(
        auth(USER_ROLES.STUDENT),
        ShortController.getShortList
    );

router.get("/teacher-shorts",
    auth(USER_ROLES.TEACHER),
    ShortController.teacherShortList
);

router.get("/reels",
    auth(USER_ROLES.STUDENT),
    ShortController.getReels
);

router.get("/student/:id",
    auth(USER_ROLES.STUDENT),
    ShortController.singleShortDetails
);

router.get("/preview/:id",
    auth(USER_ROLES.TEACHER),
    ShortController.shortPreview
);

router.get("/:id",
    auth(USER_ROLES.TEACHER),
    ShortController.shortDetailsForTeacher
);



export const ShortRoutes = router;