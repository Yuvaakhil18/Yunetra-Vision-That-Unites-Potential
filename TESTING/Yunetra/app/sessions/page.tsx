"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, BookOpen, GraduationCap } from "lucide-react";
import CountUp from "react-countup";
import toast from "react-hot-toast";
import SessionCard from "./SessionCard";
import { GradientButton } from "@/components/ui/gradient-button";
import Link from "next/link";

// Modals
import AcceptSessionModal from "./AcceptSessionModal";
import CompleteSessionModal from "./CompleteSessionModal";
import DisputeModal from "./DisputeModal";

export default function SessionsPage() {
    const { data: session, status } = useSession();

    const [sessions, setSessions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<"All" | "Upcoming" | "As Teacher" | "As Learner">("All");

    // Modal States
    const [acceptModalSession, setAcceptModalSession] = useState<any>(null);
    const [completeModalSession, setCompleteModalSession] = useState<any>(null);
    const [disputeModalSession, setDisputeModalSession] = useState<any>(null);

    const fetchSessions = useCallback(async (silent = false) => {
        try {
            const res = await fetch("/api/sessions/my");
            if (res.ok) {
                const data = await res.json();
                // Look for changes to trigger a toast (simplified comparison)
                if (silent && sessions.length > 0) {
                    const hasChanges = JSON.stringify(data.sessions) !== JSON.stringify(sessions);
                    if (hasChanges) {
                        toast("A session was updated", { icon: "🔄", style: { background: "#111111", color: "#f1f5f9", border: "1px solid rgba(255,255,255,0.1)" } });
                    }
                }
                setSessions(data.sessions || []);
            }
        } catch (error) {
            console.error("Failed to fetch sessions", error);
        } finally {
            setLoading(false);
        }
    }, [sessions]);

    useEffect(() => {
        if (status === "authenticated") {
            fetchSessions(false);

            // Poll every 30 seconds
            const interval = setInterval(() => {
                fetchSessions(true);
            }, 30000);

            return () => clearInterval(interval);
        }
    }, [status, fetchSessions]);

    const currentUserId = session?.user && (session.user as any).id;

    // Stats
    const { teacherCount, learnerCount } = useMemo(() => {
        let t = 0; let l = 0;
        sessions.forEach(s => {
            if (s.teacherId._id === currentUserId) t++;
            if (s.learnerId._id === currentUserId) l++;
        });
        return { teacherCount: t, learnerCount: l };
    }, [sessions, currentUserId]);

    // Tab Filtering Logic
    const filteredSessions = useMemo(() => {
        if (!currentUserId) return [];

        return sessions.filter(s => {
            switch (activeTab) {
                case "All": return true;
                case "Upcoming": return s.status === "pending" || s.status === "confirmed";
                case "As Teacher": return s.teacherId._id === currentUserId;
                case "As Learner": return s.learnerId._id === currentUserId;
                default: return true;
            }
        });
    }, [sessions, activeTab, currentUserId]);

    const tabCounts = useMemo(() => {
        if (!currentUserId) return { "All": 0, "Upcoming": 0, "As Teacher": 0, "As Learner": 0 };
        return {
            "All": sessions.length,
            "Upcoming": sessions.filter(s => s.status === "pending" || s.status === "confirmed").length,
            "As Teacher": teacherCount,
            "As Learner": learnerCount
        };
    }, [sessions, teacherCount, learnerCount, currentUserId]);

    const tabs: ("All" | "Upcoming" | "As Teacher" | "As Learner")[] = ["All", "Upcoming", "As Teacher", "As Learner"];

    // Empty State Renders
    const renderEmptyState = () => {
        const defaultClasses = "min-h-[400px] flex flex-col items-center justify-center p-8 bg-subtle border border-[rgba(255,255,255,0.06)] border-dashed rounded-[32px] text-center max-w-2xl mx-auto my-12 relative overflow-hidden group";
        const bgBlur = "absolute inset-0 bg-gradient-to-tr opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none";

        if (activeTab === "All") {
            return (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={defaultClasses}>
                    <div className={`${bgBlur} from-accent to-primary`} />
                    <h3 className="text-2xl font-syne font-bold text-white mb-2 relative z-10">No sessions yet</h3>
                    <p className="text-t2 font-sans text-sm mb-6 relative z-10">Find someone to learn from and book your first session</p>
                    <GradientButton asChild>
                        <Link href="/match" className="relative z-10">
                            Find Matches
                        </Link>
                    </GradientButton>
                </motion.div>
            );
        }
        if (activeTab === "Upcoming") {
            return (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={defaultClasses}>
                    <div className={`${bgBlur} from-warning to-primary`} />
                    <h3 className="text-2xl font-syne font-bold text-white mb-2 relative z-10">Nothing scheduled</h3>
                    <p className="text-t2 font-sans text-sm mb-6 relative z-10">Your confirmed upcoming sessions will appear here</p>
                    <a href="/match" className="px-6 py-3 rounded-xl bg-card text-white border border-[rgba(255,255,255,0.06)] font-bold hover:bg-card/80 transition-colors relative z-10">Browse Matches</a>
                </motion.div>
            );
        }
        if (activeTab === "As Teacher") {
            return (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={defaultClasses}>
                    <div className={`${bgBlur} from-primary to-transparent`} />
                    <h3 className="text-2xl font-syne font-bold text-white mb-2 relative z-10">You haven't taught anyone yet</h3>
                    <p className="text-t2 font-sans text-sm relative z-10">Accept session requests to start earning credits</p>
                </motion.div>
            );
        }
        if (activeTab === "As Learner") {
            return (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={defaultClasses}>
                    <div className={`${bgBlur} from-accent to-transparent`} />
                    <h3 className="text-2xl font-syne font-bold text-white mb-2 relative z-10">You haven't booked any sessions yet</h3>
                    <p className="text-t2 font-sans text-sm mb-6 relative z-10">Find a match and request your first session</p>
                    <a href="/match" className="px-6 py-3 rounded-xl bg-accent/10 text-accent border border-accent/30 font-bold hover:bg-accent hover:text-base transition-colors relative z-10">Find a Teacher</a>
                </motion.div>
            );
        }
    };

    if (status === "loading") {
        return (
            <div className="min-h-screen pt-24 flex items-center justify-center text-primary">
                <Loader2 className="w-8 h-8 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 md:px-8 max-w-5xl mx-auto font-sans relative">

            {/* Page Header */}
            <div className="mb-12">
                <h1 className="text-4xl md:text-5xl font-syne font-extrabold tracking-tight mb-6 text-white text-center md:text-left">
                    My Sessions
                </h1>
                <div className="flex flex-wrap justify-center md:justify-start gap-4">
                    <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-subtle border border-accent/20 shadow-[0_0_20px_rgba(99,102,241,0.05)]">
                        <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                            <BookOpen className="w-5 h-5 text-accent drop-shadow-[0_0_5px_#6366f1]" />
                        </div>
                        <div>
                            <div className="text-2xl font-mono font-bold text-white leading-none">
                                {loading ? "-" : <CountUp end={learnerCount} duration={1.5} />}
                            </div>
                            <div className="text-xs font-sans text-t2 font-semibold uppercase tracking-wider mt-1">As Learner</div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-subtle border border-primary/20 shadow-[0_0_20px_rgba(56,189,248,0.05)]">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <GraduationCap className="w-5 h-5 text-primary drop-shadow-[0_0_5px_#38bdf8]" />
                        </div>
                        <div>
                            <div className="text-2xl font-mono font-bold text-white leading-none">
                                {loading ? "-" : <CountUp end={teacherCount} duration={1.5} />}
                            </div>
                            <div className="text-xs font-sans text-t2 font-semibold uppercase tracking-wider mt-1">As Teacher</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modern Pill Tab Bar */}
            <div className="flex justify-center md:justify-start mb-8 overflow-x-auto scrollbar-hide">
                <div className="flex p-1.5 bg-card/80 backdrop-blur-md rounded-full border border-[rgba(255,255,255,0.06)] shadow-xl">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`relative px-5 py-2.5 rounded-full text-sm font-syne font-bold transition-colors  whitespace-nowrap ${activeTab === tab ? "text-base" : "text-t2 hover:text-t1"
                                }`}
                        >
                            {activeTab === tab && (
                                <motion.div
                                    layoutId="activeTabPill"
                                    className="absolute inset-0 bg-primary rounded-full shadow-[0_0_15px_rgba(56,189,248,0.4)]"
                                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                />
                            )}
                            <span className="relative z-10 flex items-center gap-2">
                                {tab}
                                <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${activeTab === tab ? "bg-base/20 text-base" : "bg-subtle text-t2"}`}>
                                    {tabCounts[tab]}
                                </span>
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Content Area */}
            <div className="relative min-h-[400px]">
                {loading ? (
                    <div className="flex flex-col gap-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="w-full h-48 bg-subtle rounded-[24px] border border-[rgba(255,255,255,0.06)] p-6 relative overflow-hidden">
                                <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent z-10" />
                                <div className="flex justify-between items-start mb-4">
                                    <div className="w-48 h-6 bg-card rounded" />
                                    <div className="w-24 h-8 bg-card rounded-full" />
                                </div>
                                <div className="w-64 h-4 bg-card rounded mb-6" />
                                <div className="flex gap-4">
                                    <div className="w-20 h-4 bg-card rounded" />
                                    <div className="w-20 h-4 bg-card rounded" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : filteredSessions.length === 0 ? (
                    renderEmptyState()
                ) : (
                    <motion.div
                        variants={{
                            hidden: { opacity: 0 },
                            show: { opacity: 1, transition: { staggerChildren: 0.1 } }
                        }}
                        initial="hidden"
                        animate="show"
                        className="flex flex-col gap-4"
                    >
                        {filteredSessions.map(sessionItem => (
                            <motion.div
                                key={sessionItem._id}
                                layout="position"
                                variants={{
                                    hidden: { opacity: 0, y: 20 },
                                    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
                                }}
                            >
                                <SessionCard
                                    session={sessionItem}
                                    currentUserId={currentUserId}
                                    refreshData={() => fetchSessions(false)}
                                    onAccept={() => setAcceptModalSession(sessionItem)}
                                    onComplete={() => setCompleteModalSession(sessionItem)}
                                    onDispute={() => setDisputeModalSession(sessionItem)}
                                />
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </div>

            {/* Modals */}
            <AnimatePresence>
                {acceptModalSession && (
                    <AcceptSessionModal
                        session={acceptModalSession}
                        onClose={() => setAcceptModalSession(null)}
                        onSuccess={() => fetchSessions(false)}
                    />
                )}
                {completeModalSession && (
                    <CompleteSessionModal
                        session={completeModalSession}
                        isTeacher={completeModalSession.teacherId._id === currentUserId}
                        onClose={() => setCompleteModalSession(null)}
                        onSuccess={() => fetchSessions(false)}
                    />
                )}
                {disputeModalSession && (
                    <DisputeModal
                        session={disputeModalSession}
                        onClose={() => setDisputeModalSession(null)}
                        onSuccess={() => fetchSessions(false)}
                    />
                )}
            </AnimatePresence>

        </div>
    );
}
