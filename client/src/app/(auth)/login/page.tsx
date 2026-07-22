"use client";

import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {

    const router = useRouter();
    const { login }= useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] =  useState(false);

    const handleSubmit = async( e: React.SyntheticEvent<HTMLFormElement> ) => {
        
        e.preventDefault();
        setLoading(true);
        setError("");

        try{
            await login({ email, password });
            router.push("/dashboard");
        } catch (err: any) {
            setError(err.response?.data?.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="w-1/2 p-[60px] mx-auto my-auto bg-olive-100">
                <h1 className="text-lg uppercase text-center font-semibold mb-4">Login Form</h1>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 p-2 gap-10">
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="py-3 px-4 text-[16px] focus:outline-none focus:ring-0 focus:border-transparent bg-gray-200 rounded-sm w-3/4 mx-auto" />
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="py-3 px-4 text-[16px]  focus:outline-none focus:ring-0 focus:border-transparent bg-gray-200 rounded-sm w-3/4 mx-auto"  />
                    <button disabled={loading} className="p-3 bg-amber-800 hover:opacity-[.9] uppercase text-[15px] font-[550] rounded-sm text-white text-center w-3/4 mx-auto">{loading ? "Logging in...." : "Login"}</button>
                </form>
                {error && (<p style={{color: "red"}} className="text-[13px] w-3/4 mx-auto pt-4">{error}</p>)   }
                <p className="mt-6 text-center text-sm text-gray-600">Don't have an account?{" "}
                    <Link href="/register" className="font-semibold text-blue-600 hover:underline"> Register </Link>
                </p>
            </div>
        </>
    );
}