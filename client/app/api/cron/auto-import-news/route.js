import { connectDB } from "../../../../server/db.js";
import { errorResponse, json } from "../../../../server/http.js";
import { syncNewsFeed } from "../../../../server/newsIngestion.js";

function verifyCron(req) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return;
  }

  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${secret}`) {
    const error = new Error("Unauthorized");
    error.status = 401;
    throw error;
  }
}

export async function GET(req) {
  try {
    verifyCron(req);
    await connectDB();
    const result = await syncNewsFeed();
    return json(result);
  } catch (error) {
    return errorResponse(error);
  }
}

