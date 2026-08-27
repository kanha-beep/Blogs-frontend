import { NextResponse } from "next/server";

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

export function normalizeCategory(category) {
  const values = Array.isArray(category) ? category : [category];
  return values.map((item) => String(item || "").trim()).filter(Boolean);
}
