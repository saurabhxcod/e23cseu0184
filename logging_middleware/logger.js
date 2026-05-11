import dotenv from 'dotenv';
dotenv.config();
const VALID_STACKS = ["backend", "frontend"];
const VALID_LEVELS = ["debug", "info", "warn", "error", "fatal"];
const VALID_PACKAGES = [
  "cache", "controller", "cron_job", "db", "domain",
  "handler", "repository", "route", "service",
  "auth", "config", "middleware", "utils"
];

const Log = async (stack, level, pkg, message) => {
  if (!VALID_STACKS.includes(stack)) {
    return console.error(`[LOGGER ERROR] Invalid stack: "${stack}"`);
  }
  if (!VALID_LEVELS.includes(level)) {
    return console.error(`[LOGGER ERROR] Invalid level: "${level}"`);
  }
  if (!VALID_PACKAGES.includes(pkg)) {
    return console.error(`[LOGGER ERROR] Invalid package: "${pkg}"`);
  }
  try {
    const response = await fetch("http://4.224.186.213/evaluation-service/logs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.ACCESS_TOKEN}`
      },
      body: JSON.stringify({
        stack:   stack,
        level:   level,
        package: pkg,
        message: message
      })
    });

    const data = await response.json();
    return data;

  } catch (err) {
    console.error(`[LOGGER ERROR] Failed to send log: ${err.message}`);
  }
};

export default Log;