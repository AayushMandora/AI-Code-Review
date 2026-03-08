import mongoose, { Schema } from "mongoose"

const ReviewSchema = new Schema({
    userId: { type: String, required: true },
    repoName: { type: String, required: true },
    prNumber: { type: Number, required: true },
    prTitle: { type: String, required: true },
    feedback: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
})

export const Review = mongoose.models.Review || mongoose.model("Review", ReviewSchema)