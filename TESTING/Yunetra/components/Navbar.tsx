"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Bell, Menu, X, Calendar, Target, LogOut, User } from "lucide-react";
import CountUp from "react-countup";

export default function Navbar() {
    const { data: session } = useSession();
    const pathname = usePathname();
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

    const navLinks = [
        { name: "Dashboard", href: "/dashboard" },
        { name: "Match", href: "/match" },
        { name: "Sessions", href: "/sessions" },
        { name: "Arena", href: "/arena" },
        { name: "Resources", href: "/resources" },
        { name: "Network", href: "/network" },
        { name: "Verify", href: "/verify" },
        { name: "Profile", href: `/profile/${session?.user ? (session.user as any).id : ""}` },
    ];

    return (
        <nav className="fixed top-0 left-0 right-0 h-16 bg-[#000000]/70 backdrop-blur-[24px] border-b border-primary/10 z-50">
            <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_1px,rgba(56,189,248,0.03)_1px,rgba(56,189,248,0.03)_2px)] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between relative z-10">

                {/* Left: Brand */}
                <Link href="/" className="flex items-center gap-3 group ">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="relative w-8 h-8 group-hover:scale-110 transition-transform"
                    >
                        <Image
                            src="/images/logo/logo.png"
                            alt="YUNETRA Logo"
                            fill
                            className="object-contain"
                            priority
                        />
                    </motion.div>
                    <div className="flex font-syne font-extrabold text-xl tracking-tight">
                        {"YUNETRA".split("").map((char, i) => (
                            <motion.span
                                key={i}
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 + 0.2 }}
                                className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent"
                            >
                                {char}
                            </motion.span>
                        ))}
                    </div>
                </Link>

                {/* Center: Nav Pills (Desktop) */}
                {session && (
                    <div className="hidden md:flex items-center gap-1">
                        {navLinks.map((link, i) => {
                            const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
                            return (
                                <Link key={link.name} href={link.href} className="relative px-4 py-2 rounded-full  group">
                                    <motion.div
                                        initial={{ opacity: 0, y: -20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.1 + 0.3 }}
                                        className="relative z-10"
                                    >
                                        <span className={`font-sans text-sm font-semibold transition-colors ${isActive ? "text-primary" : "text-t1 group-hover:text-white"}`}>
                                            {link.name}
                                        </span>
                                    </motion.div>
                                    {isActive && (
                                        <motion.div
                                            layoutId="nav-pill"
                                            className="absolute inset-0 rounded-full bg-glow-green border-b-2 border-primary/30"
                                        />
                                    )}
                                    {!isActive && (
                                        <div className="absolute inset-0 rounded-full bg-glow-green opacity-0 group-hover:opacity-100 transition-opacity" />
                                    )}
                                </Link>
                            );
                        })}
                    </div>
                )}

                {/* Right: Actions */}
                <div className="flex items-center gap-4">
                    {!session ? (
                        <div className="hidden md:flex items-center gap-3">
                            <Link href="/login" className="px-5 py-2 rounded-full border border-primary text-primary font-sans font-semibold text-sm hover:bg-glow-green transition-all  magnetic-btn">
                                Sign In
                            </Link>
                            <Link href="/register" className="px-5 py-2 rounded-full bg-primary text-base font-sans font-semibold text-sm hover:shadow-[0_0_20px_rgba(56,189,248,0.4)] transition-all  magnetic-btn">
                                Get Started
                            </Link>
                        </div>
                    ) : (
                        <div className="hidden md:flex items-center gap-5">
                            {/* Credits */}
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-warning/10 border border-warning/30 text-warning group overflow-hidden  hover:bg-warning/20 transition-colors">
                                <span>🪙</span>
                                <span className="font-mono font-bold text-sm">
                                    <CountUp end={(session.user as any).skillCredits || 3} duration={2} />
                                </span>
                                <span className="font-sans text-xs font-semibold w-0 group-hover:w-[70px] whitespace-nowrap overflow-hidden transition-all duration-300 opacity-0 group-hover:opacity-100">
                                    Skill Credits
                                </span>
                            </div>

                            {/* Notifications */}
                            <div className="relative"
                                onMouseEnter={() => setIsNotificationsOpen(true)}
                                onMouseLeave={() => setIsNotificationsOpen(false)}
                            >
                                <button
                                    className="relative p-2 rounded-full hover:bg-card text-t2 hover:text-white transition-colors "
                                >
                                    <Bell className="w-5 h-5 animate-[shake_4s_cubic-bezier(.36,.07,.19,.97)_both_infinite]" />
                                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger rounded-full" />
                                </button>
                                <AnimatePresence>
                                    {isNotificationsOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            transition={{ duration: 0.18 }}
                                            className="absolute right-0 mt-2 w-80 max-w-xs rounded-2xl bg-subtle border border-[rgba(255,255,255,0.06)] p-3 shadow-2xl z-50 backdrop-blur-xl"
                                        >
                                            <div className="font-syne font-bold text-lg mb-2 text-white">Notifications</div>
                                            <div className="space-y-2 max-h-64 overflow-y-auto">
                                                {/* Example notifications, replace with real data */}
                                                <div className="p-3 rounded-xl bg-card border border-[rgba(255,255,255,0.06)] flex items-start gap-3">
                                                    <span className="w-2 h-2 mt-1 rounded-full bg-primary inline-block" />
                                                    <div>
                                                        <div className="font-sans text-sm text-white">You have 3 new match requests!</div>
                                                        <div className="text-xs text-t2 mt-1">Just now</div>
                                                    </div>
                                                </div>
                                                <div className="p-3 rounded-xl bg-card border border-[rgba(255,255,255,0.06)] flex items-start gap-3">
                                                    <span className="w-2 h-2 mt-1 rounded-full bg-warning inline-block" />
                                                    <div>
                                                        <div className="font-sans text-sm text-white">Your profile was viewed 5 times today.</div>
                                                        <div className="text-xs text-t2 mt-1">2 hours ago</div>
                                                    </div>
                                                </div>
                                                <div className="p-3 rounded-xl bg-card border border-[rgba(255,255,255,0.06)] flex items-start gap-3">
                                                    <span className="w-2 h-2 mt-1 rounded-full bg-accent inline-block" />
                                                    <div>
                                                        <div className="font-sans text-sm text-white">Session with Priya confirmed for tomorrow.</div>
                                                        <div className="text-xs text-t2 mt-1">Yesterday</div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="mt-3 text-center">
                                                <Link href="/notifications" className="text-primary font-sans text-sm font-semibold hover:underline">View all</Link>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Profile Dropdown */}
                            <div
                                className="relative"
                                onMouseEnter={() => setIsProfileOpen(true)}
                                onMouseLeave={() => setIsProfileOpen(false)}
                            >
                                <button className="w-9 h-9 rounded-full relative ">
                                    <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary to-accent animate-spin-slow" />
                                    <div className="absolute inset-[2px] bg-subtle rounded-full flex items-center justify-center font-syne font-bold text-sm">
                                        {session.user?.name?.[0]?.toUpperCase() || "U"}
                                    </div>
                                </button>

                                <AnimatePresence>
                                    {isProfileOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            transition={{ duration: 0.2 }}
                                            className="absolute right-0 mt-2 w-64 rounded-2xl bg-subtle border border-[rgba(255,255,255,0.06)] p-2 shadow-2xl backdrop-blur-xl"
                                        >
                                            <div className="p-3 mb-2 border-b border-[rgba(255,255,255,0.06)]">
                                                <p className="font-syne font-bold text-white">{session.user?.name}</p>
                                                <p className="font-sans text-xs text-t2 truncate">{session.user?.email}</p>
                                            </div>

                                            <div className="space-y-1">
                                                <Link href={`/profile/${(session.user as any).id}`} className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-card group transition-colors ">
                                                    <User className="w-4 h-4 text-t2 group-hover:text-primary" />
                                                    <span className="font-sans text-sm group-hover:translate-x-1 transition-transform">My Profile</span>
                                                </Link>
                                                <Link href="/sessions" className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-card group transition-colors ">
                                                    <Calendar className="w-4 h-4 text-t2 group-hover:text-accent" />
                                                    <span className="font-sans text-sm group-hover:translate-x-1 transition-transform">My Sessions</span>
                                                </Link>
                                                <Link href="/verify" className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-card group transition-colors ">
                                                    <Target className="w-4 h-4 text-t2 group-hover:text-warning" />
                                                    <span className="font-sans text-sm group-hover:translate-x-1 transition-transform">Skill Tests</span>
                                                </Link>

                                                <div className="h-px bg-[rgba(255,255,255,0.06)] my-2" />

                                                <button onClick={() => signOut()} className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-danger/10 group transition-colors ">
                                                    <LogOut className="w-4 h-4 text-danger" />
                                                    <span className="font-sans text-sm text-danger group-hover:translate-x-1 transition-transform">Sign Out</span>
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    )}

                    {/* Mobile Menu Toggle */}
                    <button
                        className="md:hidden p-2 text-t1  z-50 relative"
                        onClick={() => setIsMobileOpen(!isMobileOpen)}
                    >
                        {isMobileOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: "100%" }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: "100%" }}
                        transition={{ type: "tween", duration: 0.3 }}
                        className="fixed inset-0 bg-[#000000]/95 backdrop-blur-3xl z-40 flex flex-col pt-24 px-6"
                    >
                        {session ? (
                            <div className="flex flex-col gap-6">
                                {navLinks.map((link, i) => (
                                    <motion.div
                                        key={link.name}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.1 + 0.2 }}
                                    >
                                        <Link onClick={() => setIsMobileOpen(false)} href={link.href} className="text-2xl font-syne font-bold hover:text-primary transition-colors ">
                                            {link.name}
                                        </Link>
                                    </motion.div>
                                ))}
                                <motion.button
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.7 }}
                                    onClick={() => signOut()}
                                    className="text-left text-2xl font-syne font-bold text-danger mt-8 "
                                >
                                    Sign Out
                                </motion.button>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-6">
                                <Link onClick={() => setIsMobileOpen(false)} href="/login" className="text-2xl font-syne font-bold hover:text-primary transition-colors ">
                                    Sign In
                                </Link>
                                <Link onClick={() => setIsMobileOpen(false)} href="/register" className="text-2xl font-syne font-bold text-primary transition-colors ">
                                    Get Started
                                </Link>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            <style jsx global>{`
        @keyframes shake {
          10%, 90% { transform: translate3d(-1px, 0, 0); }
          20%, 80% { transform: translate3d(2px, 0, 0); }
          30%, 50%, 70% { transform: translate3d(-3px, 0, 0); }
          40%, 60% { transform: translate3d(3px, 0, 0); }
        }
        @keyframes spin-slow {
           from { transform: rotate(0deg); }
           to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
           animation: spin-slow 4s linear infinite;
        }
      `}</style>
        </nav>
    );
}
