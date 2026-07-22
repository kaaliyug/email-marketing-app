import { Worker } from "bullmq";
import redis from "../config/redis.js";
import { sendCampaign } from "../services/sendCampaign.service.js";

const campaignWorker = new Worker( "campaigns", async (job) => {

        const { campaignId, userId } = job.data;
        console.log( `Processing campaign ${campaignId}` );

        await sendCampaign(
            campaignId,
            userId
        );

        console.log(`Campaign ${campaignId} sent successfully`);
    },
    { connection: redis, }
);
campaignWorker.on("completed", (job) => {

    console.log(`Job ${job.id} completed`);
});
campaignWorker.on("failed", (job, err) => {

    console.error(`Job ${job?.id} failed`, err );
});

export default campaignWorker;