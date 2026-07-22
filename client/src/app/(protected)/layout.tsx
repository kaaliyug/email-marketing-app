"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashBoardLayout({ children, } : { children: React.ReactNode; }) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.replace("/login");
        }
    }, [loading, user, router]);

    if (loading) {
        return <p>Loading...</p>
    }

    if (!user) { return null; }

    return (
    <section className="">
        { children }
    </section>
    )
}