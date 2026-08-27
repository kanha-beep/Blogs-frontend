import { connectDB } from "../../../../server/db.js";
import { signToken } from "../../../../server/auth.js";
import { ApiError, errorResponse, json } from "../../../../server/http.js";
import { User } from "../../../../server/models/User.js";

export async function POST(req) {
  try {
    await connectDB();
    const { email: rawEmail, password } = (await req.json()) || {};
    const email = rawEmail?.trim()?.toLowerCase();

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

