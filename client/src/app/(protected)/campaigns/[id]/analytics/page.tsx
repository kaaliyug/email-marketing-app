"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getCampaignAnalytics } from "@/services/campaign.service";

interface Analytics {
  sent: number;
  delivered: number;
  opened: number;
}

export default function CampaignAnalyticsPage() {
  const params = useParams();

  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

   useEffect(() => {
    const loadAnalytics = async () => {
        try {
            const data = await getCampaignAnalytics( params.id as string );
            setAnalytics(data);
            setError("");
        } catch { setError("Failed to load analytics."); } 
        finally { setLoading(false); }
    };
    loadAnalytics();
    
    const interval = setInterval(() => {
        loadAnalytics();
    }, 5000);
    
    return () => clearInterval(interval);
   }, [params.id]);
   
  if (loading) {
    return <p>Loading analytics...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!analytics) {
    return <p>No analytics found.</p>;
  }

  return (
    <div className="campaign-analytics">
      <h2> Campaign Analytics </h2>

      <div className="grid grid-cols-3 gap-6">

        <div className="border rounded p-6"> 
          <h4 className="font-semibold text-lg"> Sent </h4>
          <p className="text-3xl font-bold"> {analytics.sent}</p>
        </div>

        <div className="border rounded p-6">
          <h4 className="font-semibold text-lg"> Delivered </h4>
          <p className="text-3xl font-bold">{analytics.delivered}</p>
        </div>

        <div className="border rounded p-6">
          <h4 className="font-semibold text-lg"> Opened</h4>
          <p className="text-3xl font-bold"> {analytics.opened}</p>
        </div>

      </div>
    </div>
  );
}