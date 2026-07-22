"use client";

import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import Image from "next/image";

export default function DashboardPage() {
    const {user, logout} = useAuth();

    return (
        <>
            <div className="grid justify-center items-center gap-6 my-12 mx-auto w-3/4 p-20">
                <h1 className="text-4xl font-medium text-center">Welcome to your Dashboard,</h1>
                <p className="text-center text-yellow-800 uppercase font-semibold text-lg">{user?.name}</p>
                <p className="text-center text-yellow-800 text-lg">{user?.email}</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
                  <Link href="/contacts" className="rounded-lg border p-6 hover:shadow-lg transition">
                    <Image src="/icons/contacts.jpg" alt="Contacts" width={80} height={80} className="mx-auto" />
                    <h2 className="mt-4 text-xl font-semibold text-center"> Contacts </h2>
                    <p className="text-center text-gray-500 mt-2"> Manage your contacts </p>
                  </Link>
                  <Link href="/audiences" className="rounded-lg border p-6 hover:shadow-lg transition" >
                    <Image src="/icons/audiences.png" alt="Audiences" width={80} height={80} className="mx-auto"  />
                    <h2 className="mt-4 text-xl font-semibold text-center">Audiences</h2>
                    <p className="text-center text-gray-500 mt-2">Create contact groups </p>
                  </Link>
                  <Link href="/campaigns" className="rounded-lg border p-6 hover:shadow-lg transition">
                    <Image src="/icons/campaigns.webp" alt="Campaigns" width={80} height={80} className="mx-auto" />
                    <h2 className="mt-4 text-xl font-semibold text-center">Campaigns </h2>
                    <p className="text-center text-gray-500 mt-2"> Send email campaigns </p>
                  </Link>
                </div>
                <button onClick = {logout} className="rounded-md size-fit px-18 py-3 mx-auto mt-6 text-[16px] text-olive-450 bg-amber-400 hover:bg-rose-700 hover:text-teal-200">Logout</button>
            </div>
        </>
    );
}