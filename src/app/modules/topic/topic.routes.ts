import express, { NextFunction, Request, Response } from "express";
import fileUploadHandler from "../../middlewares/fileUploaderHandler";
import auth from "../../middlewares/auth";
import { USER_ROLES } from "../../../enums/user";
import validateRequest from "../../middlewares/validateRequest";
import { TopicValidation } from "./topic.validation";
import { TopicController } from "./topic.controller";
const router = express.Router();

router.post("/",
    auth(USER_ROLES.TEACHER),
    fileUploadHandler(),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const payload = req.body;

            // this is for video string;
            let video: string | undefined = undefined;
            if (req.files && "video" in req.files && req.files.video[0]) {
                video = `/videos/${req.files.video[0].filename}`;
            }

            // this is for image string;
            let document: string | undefined = undefined;
            if (req.files && "document" in req.files && req.files.document[0]) {
                document = `/documents/${req.files.document[0].filename}`;
            }

            req.body = { document, video, ...payload };
            next();

        } catch (error) {
            return res.status(500).json({ message: "An error occurred while processing the CSV file." });
        }
    },
    validateRequest(TopicValidation.topicCreateZodSchema),
    TopicController.createTopic
    
)

router.route("/:id")
    .patch(
        auth(USER_ROLES.STUDENT),
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const payload = req.body;
    
                // this is for video string;
                let video: string | undefined = undefined;
                if (req.files && "video" in req.files && req.files.video[0]) {
                    video = `/videos/${req.files.video[0].filename}`;
                }
    
                // this is for image string;
                let document: string | undefined = undefined;
                if (req.files && "document" in req.files && req.files.document[0]) {
                    document = `/documents/${req.files.document[0].filename}`;
                }
    
                req.body = { document, video, ...payload };
                next();
    
            } catch (error) {
                return res.status(500).json({ message: "An error occurred while processing the CSV file." });
            }
        },
        TopicController.updateTopic
    )
    .delete(
        auth(USER_ROLES.STUDENT),
        TopicController.deleteTopic
    )

export const TopicRoutes = router;