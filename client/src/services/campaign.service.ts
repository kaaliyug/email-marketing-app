import api from "@/lib/api"

export interface Campaign {
  id: string;
  name: string;
  subject: string;
  body: string;
  status: string;
  scheduledAt: string | null;
  audienceId: string | null;
  manualRecipients?: {
    id: string;
    name: string;
    email: string;
  }[] | null;
  sentCount: number;
  deliveredCount: number;
  openedCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CampaignPayload {
  name?: string;
  subject?: string;
  body?: string;
  audienceId?: string;
  manualRecipients?: {
    id: string;
    name: string;
    email: string;
  }[];
  scheduledAt?: string;
}

export const getCampaigns = async () : Promise<Campaign[]>=> {
    const response= await api.get("/campaigns");
    return response.data.data;
}

export const createCampaign = async (
  data: CampaignPayload
): Promise<Campaign> => {
  console.log(data);
  const response = await api.post("/campaigns", data);
  return response.data.data;
};

export const updateCampaign = async (
  id: string,
  data: CampaignPayload
): Promise<Campaign> => {
  const response = await api.put(`/campaigns/${id}`, data);
  return response.data.data;
};

export const deleteCampaign = async (
  id: string
): Promise<void> => {
  await api.delete(`/campaigns/${id}`);
};

export const sendCampaign = async (
  id: string
) => {
  const response = await api.post(`/campaigns/${id}/send`);
  return response.data;
};

export const getCampaignAnalytics = async (
  id: string
) => {
  const response = await api.get(
    `/campaigns/${id}/analytics`
  );

  return response.data.data;
};