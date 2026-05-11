import Log from './logger.js';
const res1 = await Log("backend", "info", "middleware", "Logger initialized successfully");
console.log("Test 1:", res1);
const res2 = await Log("backend", "error", "controller", "Test error: received string expected bool");
console.log("Test 2:", res2);
const res3 = await Log("backend", "debug", "db", "Database connection test");
console.log("Test 3:", res3);