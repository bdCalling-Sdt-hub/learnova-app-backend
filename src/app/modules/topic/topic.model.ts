import { Schema, model } from "mongoose"; 
import { ITopic, TopicModel } from "./topic.interface";

// Define the Mongoose schema for Lesson
const topicSchema = new Schema<ITopic, TopicModel>(
    {
        video: {
            type: String,
            required: true
        },
        topic: {
            type: String,
            required: true
        },
        title: {
            type: String,
            required: true
        },
        notes: {
            type: String,
            required: true
        },
        documents: {
            type: String,
            required: false
        },
        lesson: {
            type: Schema.Types.ObjectId,
            ref: "Lesson", // Reference to the Lesson model
            required: true,
        }
    },
    {
        timestamps: true
    }
);

export const Topic = model<ITopic, TopicModel>("Topic", topicSchema);