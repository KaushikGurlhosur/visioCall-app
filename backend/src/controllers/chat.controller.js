import { generateStreamToken } from "../lib/stream.js";

export async function getStreamToken(req, res, next) {
  try {
    const token = generateStreamToken(req.user.id); // Assuming req.user.id is the user ID

    res.status(200).json({ token });
  } catch (error) {
    console.error("Error generating Stream token:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
