import cron from "node-cron";
import dbConnect from "../db/dbConnect.js";
import Application from "../models/Application.js";

async function checkExpiredInterviews() {
  try {
    await dbConnect();

    const now = new Date();

    const result = await Application.updateMany(
      {
        "assignedInterview.scheduledEnd": { $lt: now },
        status: "interview_scheduled",
      },
      { $set: { status: "failed" } }
    );
  } catch (err) {
    console.error("Cron job error:", err);
  }
}

checkExpiredInterviews();

cron.schedule("*/5 * * * *", () => {
  checkExpiredInterviews();
});
