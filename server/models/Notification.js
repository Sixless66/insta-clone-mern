import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: { 
      type: String, 
      enum: ["like", "comment", "follow", "mention", "message"], 
      required: true 
    },
    post: { type : String, default : ""  },
    content: { type: String, required : true },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Notification", notificationSchema);
