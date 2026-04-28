import { connectDB } from "../../../../src/server/db.js";
import { ApiError, errorResponse, json, signToken } from "../../../../src/server/api.js";
import { User } from "../../../../src/server/models/User.js";

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    const email = body?.email?.trim()?.toLowerCase();
    const password = body?.password;

    if (!email || !password) {
      throw new ApiError(400, "Please provide all the required fields");
    }

    const user = await User.findOne({ email });
    if (!user) throw new ApiError(404, "First register");

    const isValid = await user.isMatch(password);
    if (!isValid) throw new ApiError(401, "Wrong password");

    return json({
      message: "User logged in successfully",
      user: { _id: user._id, name: user.name, email: user.email },
      token: signToken(user),
    });
  } catch (error) {
    return errorResponse(error);
  }
}
