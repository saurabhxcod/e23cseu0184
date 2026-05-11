import dotenv from 'dotenv';
dotenv.config();
import Log from '../logging_middleware/logger.js';
import knapsack from './knapsack.js';

const BASE_URL = "http://4.224.186.213/evaluation-service";
const HEADERS = {
  "Content-Type": "application/json",
  "Authorization": `Bearer ${process.env.ACCESS_TOKEN}`
};

const fetchDepots = async () => {
  await Log("backend", "info", "service", "Fetching all depots from evaluation service");
  const res = await fetch(`${BASE_URL}/depots`, { headers: HEADERS });
  const data = await res.json();
  console.log("RAW DEPOT RESPONSE:", JSON.stringify(data, null, 2));
  
  await Log("backend", "info", "service", `Successfully fetched depots`);
  return data.depots;
};

const fetchVehicles = async () => {
  await Log("backend", "info", "service", "Fetching all vehicles from evaluation service");
  const res = await fetch(`${BASE_URL}/vehicles`, { headers: HEADERS });
  const data = await res.json();
  await Log("backend", "info", "service", `Successfully fetched ${data.vehicles.length} vehicles`);
  return data.vehicles;
};

const runScheduler = async () => {
  try {
    await Log("backend", "info", "service", "Vehicle maintenance scheduler started");

    const depots = await fetchDepots();
    const vehicles = await fetchVehicles();

    for (const depot of depots) {
      await Log("backend", "info", "service",
        `Processing depot ${depot.ID} with budget of ${depot.MechanicHours} mechanic hours`
      );

      const result = knapsack(vehicles, depot.MechanicHours);

      await Log("backend", "info", "service",
        `Depot ${depot.ID} scheduled: ${result.selectedTasks.length} tasks, ` +
        `impact=${result.totalImpact}, hours=${result.totalHoursUsed}/${depot.MechanicHours}`
      );

      console.log(`\n========== DEPOT ${depot.ID} ==========`);
      console.log(`Budget (Mechanic Hours) : ${depot.MechanicHours}`);
      console.log(`Hours Used             : ${result.totalHoursUsed}`);
      console.log(`Total Impact Score     : ${result.totalImpact}`);
      console.log(`Tasks Selected         : ${result.selectedTasks.length}`);
      console.log(`\nSelected Tasks:`);
      result.selectedTasks.forEach(t => {
        console.log(`  TaskID: ${t.TaskID} | Duration: ${t.Duration}h | Impact: ${t.Impact}`);
      });
    }

    await Log("backend", "info", "service", "All depots processed. Scheduler completed successfully");

  } catch (err) {
    await Log("backend", "fatal", "service", `Scheduler crashed: ${err.message}`);
    console.error(err);
  }
};

runScheduler();