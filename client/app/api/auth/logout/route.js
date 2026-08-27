import { json } from "../../../../server/http.js";

export async function POST() {
  return json({ message: "User logged out successfully" });
}

