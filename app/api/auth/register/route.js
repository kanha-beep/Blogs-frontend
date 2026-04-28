import { connectDB } from "../../../../src/server/db.js";
import { ApiError, errorResponse, json } from "../../../../src/server/api.js";
import { User } from "../../../../src/server/models/User.js";

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    const name = body?.name?.trim();
    const email = body?.email?.trim()?.toLowerCase();
    const password = body?.password;

    if (!email || !password || !name) {
      throw new ApiError(400, "Please provide all the required fields");
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) throw new ApiError(409, "User already exists");

    const newUser = await User.create({ name, email, password });

    return json(
      {
        message: "User created successfully",
        user: { _id: newUser._id, name: newUser.name, email: newUser.email },
      },
      201
    );
  } catch (error) {
    return errorResponse(error);
  }
}
