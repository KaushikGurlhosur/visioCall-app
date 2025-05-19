import mongoose from "mongoose";

const friendRequestSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    recipent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      emum: ["pending", "accepted"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const FriendRequest = mongoose.mmodel("FriendRequest", friendRequestSchema);

export default FriendRequest;
