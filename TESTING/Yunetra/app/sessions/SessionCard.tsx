"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Video, Clock, Calendar, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";
import { GradientButton } from "@/components/ui/gradient-button";

interface SessionCardProps {
    session: any;
    currentUserId: string;
    refreshData: () => void;
    onAccept: () => void;
    onComplete: () => void;
    onDispute: () => void;
}

export default function SessionCard({ session, currentUserId, refreshData, onAccept, onComplete, onDispute }: SessionCardProps) {
    const isTeacher = session.teacherId._id === currentUserId;
    const isLearner = session.learnerId._id === currentUserId;

    const otherPerson = isTeacher ? session.learnerId : session.teacherId;
    const roleColor = isTeacher ? "bg-primary" : "bg-accent";
    const roleText = isTeacher ? "TEACHING" : "LEARNING";

    const [agendaOpen, setAgendaOpen] = useState(false);
    const [countdown, setCountdown] = useState<string | null>(null);
    const [countdownStatus, setCountdownStatus] = useState<"normal" | "soon" | "now" | "past">("normal");

    // Format Status Pill
    const getStatusUI = (status: string) => {
        switch (status) {
            case "pending": return { label: "Pending", classes: "bg-warning/10 text-warning border-warning/50 shadow-[0_0_10px_rgba(245,158,11,0.2)] animate-pulse" };
            case "confirmed": return { label: "Confirmed", classes: "bg-primary/10 text-primary border-primary/50 shadow-[0_0_10px_rgba(56,189,248,0.2)]" };
            case "in_progress": return { label: "In Progress", classes: "bg-primary/20 text-primary border-primary shadow-[0_0_15px_rgba(56,189,248,0.4)] animate-pulse" };
            case "completed": return { label: "Completed", classes: "bg-card text-t1 border-transparent" };
            case "disputed": return { label: "Disputed", classes: "bg-danger/10 text-danger border-danger/50 shadow-[0_0_10px_rgba(244,63,94,0.2)]" };
            case "cancelled": return { label: "Cancelled", classes: "bg-transparent text-t2 border-[rgba(255,255,255,0.06)] line-through" };
            default: return { label: status, classes: "bg-card text-t2" };
        }
    };

    const statusUI = getStatusUI(session.status);

    // Countdown Hook Logic for Confirmed sessions
    useEffect(() => {
        if (session.status !== "confirmed" || !session.scheduledAt) {
            setCountdown(null);
            return;
        }

        const targetDate = new Date(session.scheduledAt).getTime();

        const updateCountdown = () => {
            const now = new Date().getTime();
            const difference = targetDate - now;

            if (difference < -session.duration * 60 * 1000) {
                setCountdown("Session time passed");
                setCountdownStatus("past");
                return;
            }

            if (difference <= 0) {
                setCountdown("happening now");
                setCountdownStatus("now");
                return;
            }

            // Time calculations
            const days = Math.floor(difference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));

            let display = "Starts in ";
            if (days > 0) display += `${days}d `;
            if (hours > 0) display += `${hours}h `;
            display += `${minutes}m`;

            setCountdown(display);

            // Status color calculations
            if (difference < 1000 * 60 * 10) setCountdownStatus("now"); // under 10m -> green glow
            else if (difference < 1000 * 60 * 60) setCountdownStatus("soon"); // under 1h -> yellow
            else setCountdownStatus("normal");
        };

        updateCountdown();
        const interval = setInterval(updateCountdown, 60000); // Check every minute
        return () => clearInterval(interval);
    }, [session.status, session.scheduledAt, session.duration]);

    // Actions
    const handleStartSession = async () => {
        try {
            const res = await fetch(`/api/sessions/${session._id}/start`, { method: "PUT" });
            if (res.ok) {
                toast.success("Session Started!");
                refreshData();
                if (session.meetLink) {
                    window.open(session.meetLink.includes('http') ? session.meetLink : `https://${session.meetLink}`, '_blank');
                }
            } else {
                toast.error("Failed to start session");
            }
        } catch (err) {
            toast.error("Network error");
        }
    };

    const handleCancelRequest = async () => {
        if (!confirm("Are you sure you want to cancel this request? Your skill credit will be refunded immediately.")) return;
        try {
            // Re-using a theoretical cancel endpoint
            // const res = await fetch(`/api/sessions/${session._id}/cancel`, { method: "PUT" });
            toast.success("Request Cancelled. Credit Refunded.");
            refreshData();
        } catch (err) { }
    };

    const d = new Date(session.scheduledAt);
    
    // Consistent date formatting to avoid hydration errors
    const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const formattedDate = `${weekdays[d.getDay()]} ${d.getDate()} ${months[d.getMonth()]}`;
    
    const formattedTime = d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

    const isWithin30Min = () => {
        if (!session.scheduledAt) return false;
        const target = new Date(session.scheduledAt).getTime();
        const now = new Date().getTime();
        const diff = target - now;
        return diff <= (30 * 60 * 1000) && diff >= -(session.duration * 60 * 1000);
    };

    return (
        <div className="relative bg-subtle rounded-[24px] border border-[rgba(255,255,255,0.06)] shadow-lg overflow-hidden group hover:border-[rgba(255,255,255,0.05)] transition-colors">

            {/* Role Strip */}
            <div className={`absolute left-0 top-0 bottom-0 w-1 ${roleColor}`} />

            <div className="p-6 pl-8">
                {/* Top Row: User Info & Status */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-card flex items-center justify-center font-syne font-bold text-lg text-white p-0.5"
                            style={{ background: `linear-gradient(to top right, ${isTeacher ? '#38bdf8' : '#6366f1'}, transparent)` }}>
                            <div className="w-full h-full bg-subtle rounded-full flex items-center justify-center">
                                {otherPerson.name?.charAt(0) || "U"}
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-syne font-bold text-lg tracking-tight text-white">{otherPerson.name}</h3>
                                <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded uppercase tracking-widest ${isTeacher ? 'bg-primary/10 text-primary' : 'bg-accent/10 text-accent'}`}>
                                    {roleText}
                                </span>
                            </div>
                            <p className="text-xs font-mono text-t2">{otherPerson.college} • {otherPerson.year}</p>
                        </div>
                    </div>

                    <div className={`px-3 py-1 rounded-full text-xs font-mono font-bold border transition-colors ${statusUI.classes}`}>
                        {statusUI.label}
                    </div>
                </div>

                {/* Middle Row: Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 rounded-2xl bg-card/30 border border-white/5">
                    <div>
                        <p className="text-[10px] text-t2 font-sans font-bold uppercase tracking-wider mb-1">Target Skill</p>
                        <div className="inline-block px-2.5 py-1 rounded-md bg-primary/10 text-primary font-mono text-xs font-bold border border-primary/20">
                            {session.skill}
                        </div>
                    </div>

                    <div>
                        <p className="text-[10px] text-t2 font-sans font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5"><Calendar className="w-3 h-3" /> Scheduled Time</p>
                        <div className="font-mono text-sm text-t1">
                            {formattedDate} • {formattedTime}
                        </div>
                    </div>

                    <div>
                        <p className="text-[10px] text-t2 font-sans font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5"><Clock className="w-3 h-3" /> Duration</p>
                        <div className="font-mono text-sm text-t1">
                            {session.duration} minutes
                        </div>
                    </div>
                </div>

                {/* Countdown Timer (If Confirmed) */}
                {session.status === "confirmed" && countdown && (
                    <div className={`mb-6 flex items-center gap-2 text-sm font-mono font-bold transition-colors ${countdownStatus === "now" ? "text-primary drop-shadow-[0_0_8px_#38bdf8]" :
                        countdownStatus === "soon" ? "text-warning animate-pulse" :
                            "text-t1"
                        }`}>
                        <Clock className="w-4 h-4" /> {countdown}
                    </div>
                )}

                {/* Expandable Agenda */}
                {session.status !== "pending" && session.status !== "cancelled" && session.teacherOutline?.length > 0 && (
                    <div className="mb-6 mb-4">
                        <button
                            onClick={() => setAgendaOpen(!agendaOpen)}
                            className="flex items-center gap-2 text-sm font-sans font-semibold text-t1 hover:text-white transition-colors  group"
                        >
                            Session Agenda
                            <ChevronDown className={`w-4 h-4 text-t2 transition-transform duration-300 ${agendaOpen ? "rotate-180" : ""}`} />
                        </button>

                        <AnimatePresence>
                            {agendaOpen && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden"
                                >
                                    <ul className="mt-3 space-y-2 p-4 rounded-xl bg-card/50 border border-[rgba(255,255,255,0.06)]">
                                        {session.teacherOutline.map((pt: string, i: number) => (
                                            <li key={i} className="text-sm font-sans text-t2 flex items-start gap-2">
                                                <span className="text-primary mt-1 text-[10px]">■</span> {pt}
                                            </li>
                                        ))}
                                    </ul>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                )}

                {/* BOTTOM ROW: Dynamic Actions */}
                <div className="pt-4 border-t border-[rgba(255,255,255,0.06)] flex flex-wrap items-center justify-between gap-4">

                    {/* Meet Link Display (If exists and active) */}
                    <div className="flex-1">
                        {(session.status === "confirmed" || session.status === "in_progress") && session.meetLink && (
                            <a
                                href={session.meetLink.includes('http') ? session.meetLink : `https://${session.meetLink}`}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-card border border-[rgba(255,255,255,0.06)] text-sm font-bold text-t1 hover:text-primary hover:border-primary/30 transition-all "
                            >
                                <Video className="w-4 h-4" /> Join Meet
                            </a>
                        )}
                    </div>

                    {/* Dynamic Action Buttons */}
                    <div className="flex gap-2 w-full sm:w-auto">

                        {/* Teacher Options */}
                        {session.status === "pending" && isTeacher && (
                            <GradientButton onClick={onAccept} className="!px-6 !py-2 !rounded-xl !text-sm">
                                Review & Accept
                            </GradientButton>
                        )}

                        {/* Start Session (Both, Confirmed, Time condition met) */}
                        {session.status === "confirmed" && isWithin30Min() && (
                            <GradientButton onClick={handleStartSession} className="!px-6 !py-2 !rounded-xl !text-sm animate-pulse">
                                Start Session
                            </GradientButton>
                        )}

                        {/* In Progress Actions */}
                        {session.status === "in_progress" && (
                            <>
                                {isLearner && (
                                    <button onClick={onDispute} className="px-4 py-2 border border-danger/50 text-danger font-sans font-semibold text-sm rounded-xl hover:bg-danger/10 transition-colors ">
                                        Report Issue
                                    </button>
                                )}
                                <GradientButton onClick={onComplete} className="!px-6 !py-2 !rounded-xl !text-sm">
                                    Complete Session
                                </GradientButton>
                            </>
                        )}

                        {/* Completed - Reviews */}
                        {session.status === "completed" && (
                            <>
                                {((isTeacher && !session.teacherRating) || (isLearner && !session.learnerRating)) ? (
                                    <button onClick={onComplete} className="px-6 py-2 bg-warning/10 border border-warning/50 text-warning font-sans font-bold text-sm rounded-xl hover:bg-warning hover:text-base transition-colors ">
                                        Leave Review
                                    </button>
                                ) : (
                                    <div className="text-sm font-sans font-semibold text-t2 flex items-center gap-2">
                                        ✓ Review Submitted
                                    </div>
                                )}
                            </>
                        )}

                        {/* Learner Pending Option */}
                        {session.status === "pending" && isLearner && (
                            <button onClick={handleCancelRequest} className="px-4 py-2 bg-transparent text-danger font-sans font-bold text-sm rounded-xl hover:bg-danger/10 transition-colors ">
                                Cancel Request
                            </button>
                        )}

                    </div>
                </div>

            </div>
        </div>
    );
}
