import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Sidebar from "@/app/dashboard/Sidebar";
import { DashboardBackground } from "@/components/ui/dashboard-background";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login");
    }

    return (
        <div className="flex min-h-screen pt-16 font-sans relative overflow-hidden">
            <DashboardBackground />
            <Sidebar user={session.user as any} />
            <main className="flex-1 p-6 md:p-10 transition-all ml-0 md:ml-64 h-[calc(100vh-64px)] overflow-y-auto relative z-20">
                {children}
            </main>
        </div>
    );
}
