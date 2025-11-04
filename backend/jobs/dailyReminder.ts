import { sendMail } from "../config/nodeMailerConfig";
import TaskModel from "../model/taskModel";
import userModel from "../model/userModel";
import dayjs from 'dayjs'
import cron from "node-cron";

cron.schedule("0 9 * * *", async () => {
  console.log("⏰ Cron job triggered:", new Date().toLocaleString());

  try {
    const now = new Date();
    const next24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    const dueTasks = await TaskModel.find({
      deadline: { $gte: now, $lte: next24h },
      status: { $ne: "completed" },
    });

    for (const task of dueTasks) {
      const user = await userModel.findOne({ email: task.assignee });
      if (!user) continue;

      await sendMail({
        to: user.email,
        subject: `Reminder: "${task.title}" is due soon`,
        html: `
          <h3>Upcoming Deadline</h3>
          <p>Your task <b>${task.title}</b> is due on 
          ${dayjs(task.deadline).format("DD MMM YYYY, hh:mm A")}.</p>
        `,
      });
    }
  } catch (err) {
    console.error(" Cron job failed:", err);
  }
});
