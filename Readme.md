# Backend Assessment — Campus Hiring Evaluation

## Tech Stack
- **Runtime:** Node.js (v18+)
- **Framework:** Express.js
- **Syntax:** ES Modules (import/export)
- **Environment:** dotenv

---

## Repository Structure

```
<roll_number>/
│
├── logging_middleware/
│   ├── logger.js
│   ├── test.js
│   └── package.json
│
├── vehicle_maintence_scheduler/
│   ├── scheduler.js
│   ├── knapsack.js
│   └── package.json
│
├── notification_app_be/
│   ├── app.js
│   ├── config/
│   │   └── config.js
│   ├── controllers/
│   │   └── notificationController.js
│   ├── routes/
│   │   └── notificationRoutes.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   └── package.json
│
├── notification_system_design.md
├── README.md
└── .gitignore
```

---

## Part 1 — Logging Middleware

A reusable `Log()` function that sends structured logs to an
evaluation server every time a significant event occurs in the
application. Used across all three parts of this project.
No `console.log` is used anywhere in the codebase.

### Function Signature
```js
Log(stack, level, package, message)
```

### Example Usage
```js
await Log("backend", "info", "controller", "Request received successfully");
await Log("backend", "error", "db", "Database query failed");
await Log("backend", "fatal", "service", "Service crashed unexpectedly");
```

### Run
```bash
cd logging_middleware
node test.js
```

---

## Part 2 — Vehicle Maintenance Scheduler

A script that solves a real-world optimization problem using the
**0/1 Knapsack algorithm** implemented from scratch without any
external libraries.

### Problem
Multiple depots each have a fixed mechanic-hours budget. A list of
vehicles each require a certain number of hours and have an
operational impact score. The goal is to select the optimal subset
of vehicles that maximizes total impact without exceeding the budget.

### Algorithm
```
Each vehicle → binary choice (service or skip)
Constraint   → total Duration ≤ MechanicHours budget
Objective    → maximize total Impact score

DP Formula:
dp[i][w] = max(
  dp[i-1][w],
  dp[i-1][w - Duration[i]] + Impact[i]
)

Time Complexity  → O(n × W)
Space Complexity → O(n × W)
```

### Run
```bash
cd vehicle_maintence_scheduler
node scheduler.js
```

### Sample Output
```
========== DEPOT 1 ==========
Budget (Mechanic Hours) : 60
Hours Used             : 58
Total Impact Score     : 142
Tasks Selected         : 12

Selected Tasks:
  TaskID: 264e638f-... | Duration: 3h | Impact: 10
  TaskID: 871ddcf5-... | Duration: 7h | Impact: 10
  ...

========== DEPOT 2 ==========
Budget (Mechanic Hours) : 135
...
```

---

## Part 3 — Campus Notifications Microservice

A RESTful backend microservice that manages campus notifications
for students. Supports fetching all notifications and a smart
priority inbox that ranks notifications by type and recency.

### MVC Architecture
```
HTTP Request
     ↓
Express Router (routes/)
     ↓
Auth Middleware (middleware/)
     ↓
Controller (controllers/)
     ↓
External Notifications API
     ↓
JSON Response
```

### Priority Inbox Algorithm
```
Type Weight:
  Placement → 3 (highest)
  Result    → 2
  Event     → 1 (lowest)

Score Formula:
  score = typeWeight × 10^13 + timestamp_ms

Sort by score descending → return top N
```

This guarantees:
- Placements always appear above Results
- Results always appear above Events
- Within same type, newest notification comes first
- New notifications naturally rank higher (higher timestamp)

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/notifications` | Get all notifications |
| GET | `/api/notifications/priority?n=10` | Get top N by priority |

### Headers Required
```
Authorization: Bearer <token>
Content-Type: application/json
```

### Run
```bash
cd notification_app_be
node app.js
```

Server starts at `http://localhost:5000`

### Test in Postman

**Get all:**
```
GET http://localhost:5000/api/notifications
```

**Priority inbox:**
```
GET http://localhost:5000/api/notifications/priority?n=10
GET http://localhost:5000/api/notifications/priority?n=15
GET http://localhost:5000/api/notifications/priority?n=20
```

**Expected Response (200):**
```json
{
  "total": 10,
  "requested_n": 10,
  "priority_order": "Placement > Result > Event, then by recency",
  "notifications": [
    {
      "ID": "uuid",
      "Type": "Placement",
      "Message": "Google hiring drive announced",
      "Timestamp": "2026-04-22 17:51:30"
    }
  ]
}
```

**No token (401):**
```json
{
  "message": "No token provided"
}
```

---

## Part 4 — System Design (notification_system_design.md)

Written design document covering 6 stages:

| Stage | Topic |
|-------|-------|
| Stage 1 | REST API design + WebSocket real-time mechanism |
| Stage 2 | PostgreSQL schema + queries + scaling problems |
| Stage 3 | Slow query fix + composite index strategy |
| Stage 4 | Redis caching + pagination + WebSocket push |
| Stage 5 | Message queue redesign for 50k notifications |
| Stage 6 | Priority inbox algorithm + complexity analysis |

---

## Logging Integration

Every file across all three parts uses the `Log()` function.
`console.log` is not used anywhere.

| Location | Level | Example |
|----------|-------|---------|
| Server startup | `info` | `"Server started on port 5000"` |
| API fetch | `info` | `"Fetched 25 notifications successfully"` |
| Auth failure | `warn` | `"Unauthorized access attempt"` |
| Business error | `error` | `"Failed to fetch notifications"` |
| Fatal crash | `fatal` | `"Scheduler crashed"` |

---

## Environment Variables

Each folder has its own `.env` file (not pushed to GitHub):

```env
ACCESS_TOKEN=your_bearer_token_here
PORT=5000
```

---

## .gitignore

```
node_modules/
.env
.DS_Store
*.log
```

---

## How to Run Everything

```bash
# Part 1 — Test logging
cd logging_middleware
node test.js

# Part 2 — Vehicle scheduler
cd ../vehicle_maintence_scheduler
node scheduler.js

# Part 3 — Notification API
cd ../notification_app_be
node app.js
```

---

## Commits

```
init: project structure and gitignore
feat: logging middleware with validation
feat: vehicle maintenance scheduler knapsack algorithm
feat: notification microservice priority inbox
docs: notification system design stages 1-6
docs: complete README
```