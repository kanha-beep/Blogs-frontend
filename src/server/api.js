import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

export function json(data, status = 200) {
  return NextResponse.json(data, { status });
}

export function errorResponse(error) {
  const status = error?.status || 500;
  const message = error?.message || "Something went wrong";
  return json({ message }, status);
}

export function getJwtSecret() {
  const secret = process.env.JWT_KEY || process.env.JWT_SECRET;
  if (!secret) throw new ApiError(500, "JWT secret is not configured");
  return secret;
}

export function signToken(user) {
  return jwt.sign(
    { _id: user._id, name: user.name, email: user.email },
    getJwtSecret(),
    { expiresIn: "30d" }
  );
}

export function verifyRequest(request) {
  const authHeader = request.headers.get("authorization");
  const token =
    typeof authHeader === "string" && authHeader.startsWith("Bearer ")
      ? authHeader.slice(7).trim()
      : null;

  if (!token) throw new ApiError(401, "Authorization header missing");

  try {
    return jwt.verify(token, getJwtSecret());
  } catch (error) {
    if (error?.name === "TokenExpiredError") {
      throw new ApiError(401, "Session expired. Please log in again.");
    }

    throw new ApiError(401, "Invalid token. Please log in again.");
  }
}

export function normalizeCategory(category) {
  const values = Array.isArray(category) ? category : [category];
  return values.map((item) => String(item || "").trim()).filter(Boolean);
}
