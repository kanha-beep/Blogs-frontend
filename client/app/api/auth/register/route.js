import { connectDB } from "../../../../server/db.js";
import { ApiError, errorResponse, json } from "../../../../server/http.js";
import { User } from "../../../../server/models/User.js";

export async function POST(req) {
  try {
    await connectDB();
    const { name, email, password } = (await req.json()) || {};
    console.log("email: ", email , password, name)

    if (!email || !password) {
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

