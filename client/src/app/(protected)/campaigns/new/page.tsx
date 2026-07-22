"use client";

import { useRouter } from "next/navigation";
import CampaignForm, { CampaignFormValues,} from "@/components/forms/CampaignForm";
import { createCampaign } from "@/services/campaign.service";

export default function NewCampaignPage() {
  const router = useRouter();

  const handleSubmit = async (data: CampaignFormValues) => {
    const payload = { ...data, audienceId: data.audienceId || undefined, scheduledAt: data.scheduledAt ? new Date(data.scheduledAt).toISOString()  : undefined,};
    try {
      await createCampaign(payload);

      router.push("/campaigns");
    } catch (error) {
      console.error(error);
      alert("Failed to create campaign.");
    }
  };

  return (
    <div className="wrapper-form">
      <h3>Create Campaign</h3>
      <CampaignForm onSubmit={handleSubmit} />
    </div>
  );
}