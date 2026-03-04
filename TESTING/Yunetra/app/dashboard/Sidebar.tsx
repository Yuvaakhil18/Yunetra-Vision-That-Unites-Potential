"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, Calendar, ShieldCheck, UserCircle, LogOut } from "lucide-react";
import { motion } from "framer-motion";

export default function Sidebar({ user }: { user: any }) {
    const pathname = usePathname();

    const links = [
        { name: "Dashboard", href: "/dashboard", icon: <LayoutDashboard /> },
        { name: "Matches", href: "/match", icon: <Users /> },
        { name: "Sessions", href: "/sessions", icon: <Calendar /> },
        { name: "Skill Tests", href: "/verify", icon: <ShieldCheck /> },
        { name: "Profile", href: `/profile/${user.id}`, icon: <UserCircle /> },
    ];

    return (
        <aside className="fixed left-0 top-16 bottom-0 w-64 bg-subtle border-r border-[rgba(255,255,255,0.06)] hidden md:flex flex-col z-30 shadow-[4px_0_24px_rgba(0,0,0,0.5)]">

            {/* User Info */}
            <div className="p-6 border-b border-[rgba(255,255,255,0.06)] flex flex-col items-center">
                <div className="w-14 h-14 rounded-full p-[2px] bg-gradient-to-tr from-primary to-accent relative mb-3">
                    <div className="w-full h-full bg-subtle rounded-full flex items-center justify-center font-syne font-bold text-xl relative z-10 overflow-hidden group">
                        {user.name?.[0] || 'U'}
                        <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-tr from-primary to-accent rounded-full animate-spin-slow opacity-20 blur-sm" />
                </div>
                <h3 className="font-syne font-bold text-lg text-t1 truncate max-w-full">{user.name}</h3>
                <p className="font-sans text-xs text-t2 mb-4">{user.college || 'No college set'}</p>

                {/* Credits */}
                <div className="flex items-center gap-2 px-4 py-2 bg-warning/10 border border-warning/30 text-warning rounded-xl shadow-[0_0_15px_rgba(245,158,11,0.1)] hover:bg-warning/20 transition-colors w-full justify-center">
                    <span>🪙</span>
                    <span className="font-mono font-bold text-sm tracking-widest">{user.skillCredits || 3}</span>
                    <span className="font-sans text-xs font-semibold ml-1">Credits</span>
                </div>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
                {links.map((link) => {
                    const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
                    return (
                        <Link key={link.name} href={link.href} className="relative block group ">
                            <div className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors relative z-10 ${isActive ? 'text-t1' : 'text-t2 group-hover:text-white'}`}>
                                {isActive && <motion.div layoutId="sidebar-active" className="absolute inset-0 bg-primary/10 border border-primary/30 rounded-xl pointer-events-none shadow-[0_0_15px_rgba(56,189,248,0.05)]" />}
                                <div className={`w-5 h-5 ${isActive ? 'text-primary drop-shadow-[0_0_8px_#38bdf8]' : ''} transition-all group-hover:scale-110`}>
                                    {link.icon}
                                </div>
                                <span className="font-sans font-semibold text-sm">{link.name}</span>
                            </div>
                        </Link>
                    );
                })}
            </nav>

            {/* Profile Completeness */}
            <div className="p-6 border-t border-[rgba(255,255,255,0.06)] bg-card/50 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-t from-accent/5 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="flex justify-between items-center mb-2">
                    <span className="font-sans text-xs font-semibold tracking-wide text-t1">Profile Completeness</span>
                    <span className="font-mono text-xs font-bold text-primary">80%</span>
                </div>
                <div className="w-full h-1.5 bg-subtle border border-[rgba(255,255,255,0.06)] rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "80%" }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="h-full bg-primary shadow-[0_0_10px_#38bdf8]"
                    />
                </div>
            </div>

        </aside>
    );
}
