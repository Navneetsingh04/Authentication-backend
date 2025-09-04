import cron from "node-cron";
import { Users } from "../models/user.model.js";

export const unverifiedAccounts = () => {
  cron.schedule("*/30 * * * *", async () => {
    const thirtyminAgo = new Date(Date.now() - 30 * 60 * 1000);
    await Users.deleteMany({
      accountVerifed: false,
      createdAt: { $lt: thirtyminAgo },
    });
  });
};
