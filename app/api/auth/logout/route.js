import { json } from "../../../../src/server/api.js";

export async function POST() {
  return json({ message: "User logged out successfully" });
}
