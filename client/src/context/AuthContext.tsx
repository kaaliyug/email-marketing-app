"use client";

import { login as loginService, getMe } from "@/services/auth.service";
import { useContext, useEffect, useState, ReactNode, createContext } from "react";

type User = {
    id: string;
    name: string;
    email: string;
};

type LoginData = {
    email: string;
    password: string;
};

type AuthContextType = {
    user: User | null;
    token: string | null;
    loading: boolean;
    login: (data: LoginData) => Promise<void>; // The function accepts one parameter named data. That parameter's type is LoginData. this object contains both email & password. 
    logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children, } : { children: ReactNode; }) => {

    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] =  useState(true);

    useEffect(() => {
        const stroredToken = localStorage.getItem("token");

        if(!stroredToken) {
            setLoading(false);
            return;
        }

        setToken(stroredToken);

        getMe(stroredToken).then((response) => { 
            setUser(response.data); 
        }).catch(() => {
            localStorage.removeItem("token");
            setToken(null);
            setUser(null);
        }).finally(() => { 
            setLoading(false); 
        });

    }, []);

    const login = async ( data: LoginData ) => {
        
        const response = await loginService(data);
        localStorage.setItem("token", response.data.token);

        setToken(response.data.token);
        setUser(response.data.user);
    };

    const logout = () => {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
    };
    
    return (
        <AuthContext.Provider 
        value={{
            user, token, loading, login, logout,
        }}
        > { children } </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);   
    
    if(!context) {
        throw new Error("useAuth must be inside AuthProvider");
    }

    return context;
};
