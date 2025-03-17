import express, { Request, Response } from "express";
import cors from "cors";
import { StatusCodes } from "http-status-codes";
import { Morgan } from "./shared/morgan";
import multer from "multer";
import router from '../src/app/routes';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import handleStripeWebhook from "./webhook/handleStripeWebhook";
import { handleChunkUpload } from "./helpers/handleChunkVideoUpload";
const upload = multer({ dest: 'uploads/' });
const app = express();

// morgan
app.use(Morgan.successHandler);
app.use(Morgan.errorHandler);

// Stripe webhook route
app.use(
    '/api/stripe/webhook',
    express.raw({ type: 'application/json' }),
    handleStripeWebhook
);


//body parser
app.use(cors({
    origin: ['https://api.learnova.info', "https://mahmud.binarybards.online" , "https://learnova.info"],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: "1000mb" }));
app.use(express.urlencoded({ extended: true, limit: "1000mb" }));

//file retrieve
app.use(express.static('uploads'));

//router
app.use('/api/v1', router);
app.post('/api/v1/upload', upload.single('chunk'), handleChunkUpload);

app.get("/", (req: Request, res: Response) => {
    res.send("Hey, How can I assist you");
})

//global error handle
app.use(globalErrorHandler);

// handle not found route
app.use((req: Request, res: Response) => {
    res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Not Found",
        errorMessages: [
            {
                path: req.originalUrl,
                message: "API DOESN'T EXIST"
            }
        ]
    })
});

export default app;