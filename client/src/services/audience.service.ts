import api from "@/lib/api";

export interface Audience {
  id: string;
  name: string;
  filterField: string;
  filterValue: string;
  contactCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface AudiencePayload {
  name: string;
  filterField: string;
  filterValue: string;
}

export const getAudiences = async (): Promise<Audience[]> => {
  const response = await api.get("/audiences");
  return response.data.data;
};

export const createAudience = async (
  data: AudiencePayload
): Promise<Audience> => {
  const response = await api.post("/audiences", data);
  return response.data.data;
};

export const updateAudience = async (
  id: string,
  data: AudiencePayload
): Promise<Audience> => {
  const response = await api.put(`/audiences/${id}`, data);
  return response.data.data;
};

export const deleteAudience = async (
  id: string
): Promise<void> => {
  await api.delete(`/audiences/${id}`);
};