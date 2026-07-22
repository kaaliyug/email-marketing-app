import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import { errorHandler } from "./middleware/error.middleware.js";
import contactRoutes from "./routes/contact.routes.js";
import audienceRoutes from "./routes/audience.routes.js";
import campaignRoutes from "./routes/campaign.routes.js";
import recipientRoutes from "./routes/recipient.routes.js";
import webhookRoutes from "./routes/webhook.routes.js";
import analyticsRoutes from "./routes/analytics.routes.js";

const app = express();
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://email-marketing-app-dun.vercel.app",
    ],
    credentials: true,
  })
);
app.use(express.json());



app.use("/api/auth", authRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/audiences", audienceRoutes);
app.use("/api/campaigns", campaignRoutes );
app.use("/api/recipients", recipientRoutes );
app.use("/api/webhooks", webhookRoutes);
app.use( "/api", analyticsRoutes );




app.use(errorHandler);

export default app;