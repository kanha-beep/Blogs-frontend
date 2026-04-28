import { connectDB } from "../../../../src/server/db.js";
import { ApiError, errorResponse, json, verifyRequest } from "../../../../src/server/api.js";
import { User } from "../../../../src/server/models/User.js";

export async function GET(request) {
  try {
    await connectDB();
    const decoded = verifyRequest(request);
    const user = await User.findById(decoded._id).select("-password");
    if (!user) throw new ApiError(404, "User not found");

    return json({ message: "User found", user });
  } catch (error) {
    return errorResponse(error);
  }
}
