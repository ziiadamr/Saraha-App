import cron from "node-cron";
import jwt from "jsonwebtoken";
import { User, BlackListedTokens } from "../DB/Models/index.js"; 

async function cleanBlacklistedTokens() {
  try {
    const res = await BlackListedTokens.deleteMany({
      expirationDate: { $lte: new Date() },
    });
    console.log(`Deleted ${res.deletedCount} expired blacklisted tokens`);
  } catch (err) {
    console.error("Error deleting blacklisted tokens:", err);
  }
}

async function cleanUserSessions() {
  try {
    const cursor = User.find({ "sessions.0": { $exists: true } }).cursor();
    for await (const user of cursor) {
      const orig = user.sessions?.length || 0;

      const valid = (user.sessions || []).filter((s) => {
        try {
          jwt.verify(s.refreshToken, process.env.REFRESH_TOKEN_SECRET);
          return true;
        } catch (e) {
          return false;
        }
      });

      if (valid.length !== orig) {
        user.sessions = valid;
        await user.save();
        console.log(`Cleaned sessions for user ${user._id} — now ${valid.length}`);
      }
    }
  } catch (err) {
    console.error("Error cleaning user sessions:", err);
  }
}

cron.schedule("0 0 * * *", async () => {
  console.log(new Date().toISOString(), " — running cleanup cron");
  await cleanBlacklistedTokens();
  await cleanUserSessions();
});