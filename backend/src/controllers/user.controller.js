import FriendRequest from "../models/FriendRequest.js";
import User from "../models/User.js";

export async function getRecommendedUsers(req, res, next) {
  try {
    const currentUserId = req.user.id;
    const currentUser = req.user;

    const recommendedUsers = await User.find({
      $ans: [
        { _id: { $ne: currentUserId } }, // Exclude current user
        { $id: { $nin: currentUser.friends } }, // Exclude current user's friends
        { isOnboarded: true }, // Only include onboarded users
      ],
    });
    res.status(200).json(recommendedUsers);
  } catch (error) {
    console.error("Error fetching recommended users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getMyFriends(req, res, next) {
  try {
    const user = await User.findById(req.user.id)
      .select("friends")
      .populate(
        "friends",
        "fullName profilePic nativeLanguage learningLanguage"
      );
    res.status(200).json(user.friends);
  } catch (error) {}
}

export async function sendFriendRequest(req, res, next) {
  try {
    const myId = req.user.id;
    const { id: recipientId } = req.params;

    // Prevent sending a friend request to yourself
    if (myId === recipientId) {
      return res
        .status(400)
        .json({ message: "You cannot send a friend request to yourself." });
    }

    // Check if the recipient is already a friend
    const recipent = awaitUser.findById(recipientId);
    if (!recipent) {
      return res.status(404).json({ message: "Recipient not found." });
    }

    // Check if the recipient is already a friend
    if (recipent.friends.includes(myId)) {
      return res
        .status(400)
        .json({ message: "You are already friends with this user." });
    }

    // Check if a friend request already exists
    const existingRequest = await FriendRequest.findOne({
      $or: [
        { sender: myId, recipent: recipientId },
        { sender: recipientId, recipent: myId },
      ],
    });

    if (existingRequest) {
      return res
        .status(400)
        .json({ message: "Friend request already exists." });
    }

    // Create a new friend request
    const friendRequest = await FriendRequest.create({
      sender: myId,
      recipent: recipientId,
    });
    res.status(201).json(friendRequest);
  } catch (error) {
    console.error("Error sending friend request:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function acceptFriendRequest(req, res, next) {
  try {
    const { id: requestId } = req.params;

    // Check if the friend request exists
    const friendRequest = await FriendRequest.findById(requestId);

    if (!friendRequest) {
      return res.status(404).json({ message: "Friend request not found." });
    }
    // Check if the current user is the recipient of the request
    if (friendRequest.recipent.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "You are not authorized to accept this request." });
    }

    friendRequest.status = "accepted";
    await friendRequest.save(); // Update the status of the friend request

    // Add the users to each other's friends list
    // $addToSet ensures that the user is added only if they are not already in the array
    await User.findByIdAndUpdate(friendRequest.sender, {
      $addToSet: { friends: friendRequest.recipent },
    });

    await User.findByIdAndUpdate(friendRequest.recipent, {
      $addToSet: { friends: friendRequest.sender },
    });
  } catch (error) {
    console.error("Error accepting friend request:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
