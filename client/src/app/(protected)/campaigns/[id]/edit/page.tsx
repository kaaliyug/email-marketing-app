"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import CampaignForm, { CampaignFormValues,} from "@/components/forms/CampaignForm";
import {  getCampaigns,  updateCampaign,  Campaign, } from "@/services/campaign.service";
import Link from "next/link";

export default function EditCampaignPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCampaign = async () => {
      try {
        const campaigns = await getCampaigns();
        const found = campaigns.find((c) => c.id === id) ?? null;
        setCampaign(found);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadCampaign();
  }, [id]);

  const handleSubmit = async ( data: CampaignFormValues ) => {
    try {
      await updateCampaign(id, data);
      router.push("/campaigns");
    } catch (error) {
      console.error(error);
      alert("Failed to update campaign.");
    }
  };

  if (loading) {
    return <p>Loading campaign...</p>;
  }

  if (!campaign) {
    return <p>Campaign not found.</p>;
  }

  return (
    <div className="wrapper-form">
      <h3><Link href={`/campaigns/${campaign.id}/edit`}> Edit</Link> </h3>
      <CampaignForm
        initialValues={{
          name: campaign.name,
          subject: campaign.subject,
          body: campaign.body,
          audienceId: campaign.audienceId ?? "",
          manualRecipients: campaign.manualRecipients ?? [],
          scheduledAt: campaign.scheduledAt ? campaign.scheduledAt.slice(0, 16) : "",
        }}
        submitText="Update Campaign"
        onSubmit={handleSubmit}
      />
    </div>
  );
}