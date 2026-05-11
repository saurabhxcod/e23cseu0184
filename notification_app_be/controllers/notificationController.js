import Log from '../../logging_middleware/logger.js';
import { BASE_URL, ACCESS_TOKEN } from '../config/config.js';
const TYPE_WEIGHT = {
  Placement: 3,
  Result: 2,
  Event: 1
};

const fetchNotifications = async () => {
  await Log("backend", "info", "service",
    "Fetching notifications"
  );

  const res = await fetch(`${BASE_URL}/notifications`, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${ACCESS_TOKEN}`
    }
  });

  const data = await res.json();
  await Log("backend", "info", "service",
    `Fetched ${data.notifications.length} notification successfully`
  );
  return data.notifications;
};
const getPriorityScore = (notification) => {
  const typeWeight = TYPE_WEIGHT[notification.Type] || 0;
  const recency = new Date(notification.Timestamp).getTime();
  return typeWeight * 1e13 + recency;
};
export const getAllNotifications = async (req, res) => {
  try {
    await Log("backend", "info", "controller",
      "GET /api/notifications - fetching all notifications"
    );

    const notifications = await fetchNotifications();

    await Log("backend", "info", "controller",
      `Returning ${notifications.length} notification`
    );

    res.status(200).json({
      total: notifications.length,
      notifications
    });

  } catch (err) {
    await Log("backend", "error", "controller",
      `Failed to fetch notifications: ${err.message}`
    );
    res.status(500).json({ message: err.message });
  }
};

export const getPriorityNotifications = async (req, res) => {
  try {
    const n = parseInt(req.query.n) || 10;

    await Log("backend", "info", "controller",
      `GET /api/notifications/priority - fetching top ${n} notifications`
    );

    const notifications = await fetchNotifications();
    const sorted = notifications.sort((a, b) => 
      getPriorityScore(b) - getPriorityScore(a)
    );
    const topN = sorted.slice(0, n);

    await Log("backend", "info", "controller",
      `Returning top ${topN.length} priority notifications`
    );

    res.status(200).json({
      total: topN.length,
      requested_n: n,
      priority_order: "Placement > Result > Event, then by recency",
      notifications: topN
    });

  } catch (err) {
    await Log("backend", "error", "controller",
      `Failed to fetch priority notifications: ${err.message}`
    );
    res.status(500).json({ message: err.message });
  }
};