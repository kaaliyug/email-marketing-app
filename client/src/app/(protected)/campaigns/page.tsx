"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Campaign, deleteCampaign,  getCampaigns,  sendCampaign, } from "@/services/campaign.service";

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadCampaigns();
  }, []);

  const loadCampaigns = async () => {
    try {
      setLoading(true);
      const data = await getCampaigns();
      setCampaigns(data);
    } catch {
      setError("Failed to load campaigns.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this campaign?");
    if (!confirmed) return;
    try {
      await deleteCampaign(id);
      setCampaigns((prev) => prev.filter((campaign) => campaign.id !== id) );
    } catch (error) {
      console.error(error);
      alert("Failed to delete campaign.");
    }
  };

  const handleSend = async (id: string) => {
    const confirmed = window.confirm( "Send this campaign now?" );
    if (!confirmed) return;
    try {
      await sendCampaign(id);
      alert("Campaign sent successfully.");
      loadCampaigns();
    } catch (error) {
      console.error(error);
      alert("Failed to send campaign.");
    }
  };

  if (loading) {
    return <p>Loading campaigns...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="wrapper-campaign">
      <div className="head">
        <h2>Campaigns</h2>
        <Link href="/campaigns/new">Create Campaign</Link>
      </div>

      <table className="w-full">
        <thead>
          <tr>
            <th> Name</th>
            <th> Subject </th>
            <th className="col-small">Status </th>
            <th>Scheduled At </th>
            <th> Actions </th>
          </tr>
        </thead>

        <tbody>
          {campaigns.map((campaign) => (
            <tr key={campaign.id}>
              <td>{campaign.name} </td>
              <td>{campaign.subject} </td>
              <td>{campaign.status} </td>
              <td>{campaign.scheduledAt ? new Date( campaign.scheduledAt ).toLocaleString() : "-"} </td>

              <td>
                <Link href={`/campaigns/${campaign.id}/edit`} className="edit">Edit</Link>
                <button onClick={() => handleDelete(campaign.id)} className="delete"> Delete</button>
                <button onClick={() => handleSend(campaign.id)} disabled={campaign.status === "SENT"} className="send"> Send </button>
                <Link href={`/campaigns/${campaign.id}/analytics`} className="analytics"> Analytics</Link>
              </td>
            </tr>
          ))}

          {campaigns.length === 0 && (
            <tr>
              <td colSpan={5} className="text-center p-4" >  No campaigns found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}