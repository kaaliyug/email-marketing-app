import "./config/redis.js";
import app from "./app.js";
import "./workers/campaign.worker.js";
import { recoverScheduledCampaigns } from "./services/scheduleRecovery.service.js";

const PORT = 5000;

app.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`);
   await recoverScheduledCampaigns();

});