import { connectDB } from "../../../../server/db.js";
import { verifyRequest } from "../../../../server/auth.js";
import { ApiError, errorResponse, json } from "../../../../server/http.js";
import { User } from "../../../../server/models/User.js";

export async function GET(req) {
  try {
    await connectDB();
    const decoded = verifyRequest(req);
    const user = await User.findById(decoded._id).select("-password");
    if (!user) throw new ApiError(404, "User not found");

    return json({ message: "User found", user });
  } catch (error) {
    return errorResponse(error);
  }
}

