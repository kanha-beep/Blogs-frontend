import { connectDB } from "../../../../src/server/db.js";
import { errorResponse, json } from "../../../../src/server/api.js";
import { syncNewsFeed } from "../../../../src/server/newsIngestion.js";

function verifyCron(request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return;
  }

  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${secret}`) {
    const error = new Error("Unauthorized");
    error.status = 401;
    throw error;
  }
}

export async function GET(request) {
  try {
    verifyCron(request);
    await connectDB();
    const result = await syncNewsFeed();
    return json(result);
  } catch (error) {
    return errorResponse(error);
  }
}
