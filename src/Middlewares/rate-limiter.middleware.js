import { rateLimit } from "express-rate-limit";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const MongoStore = require("rate-limit-mongo");
import { getCountryCode } from "../Utils/countries.utils.js";

export const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: async function (req) {
    const countryCode = await getCountryCode(req.headers["x-forwarded-for"]);
    if (countryCode === "EG") {
      return 20;
    }
    return 10;
  },
  statusCode: 429,
  message: "Too many requests from this IP, please try again after 15 minutes",
  legacyHeaders: false,
  standardHeaders: true,
  handler: (req, res) => {
    console.log("Rate limiter hit");
    res.status(429).json({
      message: "Too many requests from this IP, please try again after 15 minutes",
    });
  },
  keyGenerator: (req) => {
    let ip = req.ip;
    if (ip === "::1" || ip === "::ffff:127.0.0.1") {
      ip = "127.0.0.1";
    }
    console.log("Rate limiter key generator", { ip, path: req.path });
    return `ip:${ip}_${req.path}`;
  },
  skipFailedRequests: true,

  store: new MongoStore({
    uri: process.env.DB_URL_LOCAL,
    collectionName: "rateLimits",
    expireTimeMs: 15 * 60 * 1000,
  }),
});