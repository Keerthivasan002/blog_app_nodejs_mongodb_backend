import mongoose from "mongoose"

const BlogSchema = mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "user"
    },
    title: {
        type: String,

    },
    description: {
        type: String
    },
    comments: [{
        userCommented: { type: mongoose.Schema.Types.ObjectId },
        comment: { type: String },
        postedAt: { type: Date, default: Date.now()}
    }
    ],

image: {
    type: String
}
}, {
    timestamps: true
});

export default mongoose.model("blog", BlogSchema)