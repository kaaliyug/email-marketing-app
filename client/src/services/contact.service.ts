import api from "@/lib/api";

export interface CustomFields {
    city?: string;
    company?: string;
    tag?: string;
}

export interface Contact {
    id: string;
    name: string;
    email: string;
    phone?: string;
    customFields?: CustomFields;
    createdAt: string;
    updatedAt: string;
}

export interface GetContactsParams {
    page?: number;
    limit?: number;
    search?: string;
}

export const getContactById = async ( id: string ) => {
    const response = await api.get(`/contacts/${id}`);
    return response.data.data;
}

export const getContacts = async ( params?: {
    search?: string;
    page?: number;
    limit?: number;
}) => {
    const response = await api.get("/contacts", {params,});
    return response.data;    
};

export interface ContactInput {
    name: string;
    email: string;
    phone?: string;
    customFields?: {
        city?: string;
        company?: string;
        tag?: string;
    };
}

export const createContact = async ( data: ContactInput )  => {    
    const response = await api.post("/contacts", data);
    return response.data;
};

export const updateContact  = async (
    id: string,
    data: ContactInput ) => {
    const response = await api.put(`/contacts/${id}`, data);
    return response.data;
};

export const deleteContact = async ( id: string ) => {
    const response = await api.delete( `/contacts/${id}`);
    return response.data;
}

export const importContacts = async (file: File) => {
    
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post("/contacts/import",  formData, {
        headers: {
            "Content-Type":  "multipart/form-data",
        },
    });
    return response.data;
};