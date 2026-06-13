import arcjet, { tokenBucket, shield, detectBot } from "@arcjet/node";

import "dotenv/config";

//init arcjet
export const aj = arcjet({
  key: process.env.ARCJET_KEY,
  characteristics: ["ip.src"],
  rules: [
    //sheild protects your app from common attacks
    shield({ mode: "LIVE" }),
    detectBot({
      mode: "LIVE",
      // block bots execept search engines
      allow: ["CATEGORY:SEARCH_ENGINE"],
    }),
    //rate limiting
    tokenBucket({
      mode: "LIVE",
      refillRate: 5,
      interval: 10,
      capacity: 10,
    }),
  ],
});
