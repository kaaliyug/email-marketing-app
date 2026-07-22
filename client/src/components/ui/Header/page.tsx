"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function Header() {
    const pathname = usePathname();
    const router = useRouter();
   
    const hiddenRoutes = ["/login", "/register"];
    if (hiddenRoutes.includes(pathname)) {
    return null;
   }

    const hideHeader =
        pathname === "/login" ||
        pathname === "/register";

    if (hideHeader) {
        return null;
    }

    const handleLogout = () => {
        localStorage.removeItem("token"); // or whatever key you're using
        router.push("/login");
    };

    return (
        <header className="header">
            <div className="logo">
                <Link href="/dashboard">
                    <h2>FinBowl</h2>
                </Link>
            </div>

            <nav>
                <Link href="/contacts">Contacts</Link>
                <Link href="/audiences">Audiences</Link>
                <Link href="/campaigns">Campaigns</Link>
            </nav>

            <button onClick={handleLogout}>
                Logout
            </button>
        </header>
    );
}