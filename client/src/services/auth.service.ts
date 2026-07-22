import api from "@/lib/api";

type RegisterData = {
    name: string;
    email: string;
    password: string;
};

type LoginData = {
    email: string;
    password: string;
}


export const register = async (data: RegisterData) => {
    const response = await api.post("/auth/register", data);
    return response.data;
};

export const login = async (data: LoginData) => {
    const response = await api.post("/auth/login", data);
    return response.data;
}

export const getMe = async (token: string) => {
    const response = await api.get("/auth/me", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};