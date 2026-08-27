import crypto from "node:crypto";
import { ApiError } from "./http.js";

const THIRTY_DAYS_IN_SECONDS = 30 * 24 * 60 * 60;

export function getJwtSecret() {
  const secret = process.env.JWT_KEY || process.env.JWT_SECRET;
  if (!secret) throw new ApiError(500, "JWT secret is not configured");
  return secret;
}

function encodeBase64Url(value) {
  return Buffer.from(value).toString("base64url");
}

function decodeBase64Url(value) {
  return Buffer.from(value, "base64url").toString("utf8");
}

function signHs256(value, secret) {
  return crypto.createHmac("sha256", secret).update(value).digest("base64url");
}

export function signToken(user) {
  const secret = getJwtSecret();
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: "HS256", typ: "JWT" };
  const payload = {
    _id: String(user._id),
    name: user.name,
    email: user.email,
    iat: now,
    exp: now + THIRTY_DAYS_IN_SECONDS,
  };

  const encodedHeader = encodeBase64Url(JSON.stringify(header));
  const encodedPayload = encodeBase64Url(JSON.stringify(payload));
  const signature = signHs256(`${encodedHeader}.${encodedPayload}`, secret);

  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

function verifyToken(token) {
  const secret = getJwtSecret();
  const parts = token.split(".");

  if (parts.length !== 3) {
    throw new ApiError(401, "Invalid token. Please log in again.");
  }

  const [encodedHeader, encodedPayload, signature] = parts;
  const expectedSignature = signHs256(`${encodedHeader}.${encodedPayload}`, secret);

  const signatureBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSignature);

  if (
    signatureBuffer.length !== expectedBuffer.length ||
    !crypto.timingSafeEqual(signatureBuffer, expectedBuffer)
  ) {
    throw new ApiError(401, "Invalid token. Please log in again.");
  }
  try {
    const payload = JSON.parse(decodeBase64Url(encodedPayload));

    if (!payload?.exp || Math.floor(Date.now() / 1000) >= payload.exp) {
      throw new ApiError(401, "Session expired. Please log in again.");
    }

    return payload;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(401, "Invalid token. Please log in again.");
  }
}

export function verifyRequest(request) {
  const authHeader = request.headers.get("authorization");
  const token =
    typeof authHeader === "string" && authHeader.startsWith("Bearer ")
      ? authHeader.slice(7).trim()
      : null;

  if (!token) throw new ApiError(401, "Authorization header missing");

  return verifyToken(token);
}
