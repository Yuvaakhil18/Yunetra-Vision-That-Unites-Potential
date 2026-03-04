"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X, Calendar, Clock, Sparkles, AlertCircle, Loader2, Coins } from "lucide-react";
import toast from "react-hot-toast";

interface RequestSessionModalProps {
    match: any;
    onClose: () => void;
    balance?: number;
}

export default function RequestSessionModal({ match, onClose, balance: initialBalance }: RequestSessionModalProps) {
    const [balance, setBalance] = useState(initialBalance ?? 0);

    useEffect(() => {
        async function fetchBalance() {
            try {
                const res = await fetch("/api/credits/balance");
                if (res.ok) {
                    const data = await res.json();
                    setBalance(data.balance ?? 0);
                }
            } catch {}
        }
        fetchBalance();
    }, []);
    const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
    const [duration, setDuration] = useState(60);
    const [level, setLevel] = useState("Beginner");
    const [goal, setGoal] = useState("");
    const [loading, setLoading] = useState(false);
    const [selectedDate, setSelectedDate] = useState<number | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);

    const { name, skillsTeach } = match;
    const cost = Math.ceil(duration / 60);

    // Generate mock available dates starting tomorrow
    const dates = Array.from({ length: 5 }).map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() + i + 1);
        return d;
    });

    const timeSlots = ["10:00 AM", "12:00 PM", "03:00 PM", "05:00 PM", "08:00 PM"];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (balance < cost) {
            toast.error("Insufficient Skill Credits.");
            return;
        }
        if (!selectedSkill || !selectedDate || !selectedTime || goal.length < 20) {
            toast.error("Please fill in all required fields (Goal needs 20+ chars).");
            return;
        }

        setLoading(true);
        // Build simulated scheduledAt combined string 
        const scheduledAt = new Date(selectedDate);
        const [time, period] = selectedTime.split(" ");
        let [hours, minutes] = time.split(":");
        let h = parseInt(hours);
        if (period === "PM" && h !== 12) h += 12;
        if (period === "AM" && h === 12) h = 0;
        scheduledAt.setHours(h, parseInt(minutes), 0, 0);

        try {
            const res = await fetch("/api/sessions/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    teacherId: match.userId,
                    skill: selectedSkill,
                    scheduledAt: scheduledAt.toISOString(),
                    duration: duration,
                    learnerGoal: goal,
                    learnerLevel: level
                })
            });

            if (res.ok) {
                toast.success("Request sent!");
                onClose();
                // In reality, NextAuth requires a session update to reflect the new credit balance locally. 
                // A full page reload or specialized update hook handles that.
            } else {
                const errorData = await res.json();
                toast.error(errorData.message || "Failed to create session request.");
            }
        } catch (err) {
            toast.error("Network error. Try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 pb-20 sm:pb-6">
            <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 glass-overlay"
                onClick={onClose}
            />

            <motion.div
                initial={{ opacity: 0, y: "100%", scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: "100%", scale: 0.95 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="relative w-full max-w-2xl glass-elevated glass-shine rounded-[32px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary via-warning to-accent" />

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/[0.06]">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-primary to-transparent p-px">
                            <div className="w-full h-full bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center font-syne font-bold text-lg">
                                {name?.charAt(0) || "U"}
                            </div>
                        </div>
                        <div>
                            <h2 className="font-syne font-bold text-xl text-white">Request Session</h2>
                            <p className="font-sans text-xs text-t2 flex items-center gap-1">With {name} <Sparkles className="w-3 h-3 text-warning" /></p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full glass-btn text-t2 hover:text-white ">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content Scrollable */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-hide">

                    {/* Skill Selection */}
                    <section>
                        <h3 className="text-sm font-sans font-semibold text-white mb-3 flex items-center gap-2">
                            <span className="text-primary">01.</span> Which skill do you want to learn?
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {skillsTeach?.map((skill: string) => (
                                <button
                                    key={skill}
                                    type="button"
                                    onClick={() => setSelectedSkill(skill)}
                                    className={`px-4 py-2 rounded-xl text-sm font-mono font-bold transition-all  border ${selectedSkill === skill
                                        ? "bg-primary/15 backdrop-blur-md border-primary/30 text-primary shadow-[inset_0_0.5px_0_0_rgba(56,189,248,0.3),inset_0_0_15px_rgba(56,189,248,0.05)]"
                                        : "glass-pill text-t2 hover:text-white hover:bg-white/[0.04]"
                                        }`}
                                >
                                    {skill}
                                    {match.badges?.includes(skill) && " ✓"}
                                </button>
                            ))}
                        </div>
                    </section>

                    {/* Time & Duration */}
                    <section>
                        <div className="flex justify-between items-end mb-3">
                            <h3 className="text-sm font-sans font-semibold text-white flex items-center gap-2">
                                <span className="text-warning">02.</span> Pick a time slot
                            </h3>
                            <div className="flex glass-pill p-1 rounded-xl">
                                {[30, 60, 90].map(mins => (
                                    <button
                                        key={mins}
                                        onClick={() => setDuration(mins)}
                                        className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-none ${duration === mins ? "bg-subtle shadow-[0_2px_8px_rgba(0,0,0,0.5)] text-t1" : "text-t2 hover:text-t1"
                                            }`}
                                    >
                                        {mins}m
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
                            {dates.map((date) => (
                                <button
                                    key={date.getTime()}
                                    onClick={() => setSelectedDate(date.getTime())}
                                    className={`flex-shrink-0 w-16 h-20 rounded-2xl flex flex-col items-center justify-center cursor-none transition-all border ${selectedDate === date.getTime()
                                        ? "bg-warning/10 backdrop-blur-md border-warning/30 text-warning shadow-[inset_0_0.5px_0_0_rgba(245,158,11,0.3),inset_0_0_15px_rgba(245,158,11,0.05)]"
                                        : "glass-pill text-t2 hover:bg-white/[0.04]"
                                        }`}
                                >
                                    {/* Consistent weekday formatting to avoid hydration errors */}
                                    <span className="text-[10px] font-mono uppercase mb-1">{["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"][date.getDay()]}</span>
                                    <span className="text-xl font-syne font-bold">{date.getDate()}</span>
                                </button>
                            ))}
                        </div>

                        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                            {timeSlots.map(time => (
                                <button
                                    key={time}
                                    onClick={() => setSelectedTime(time)}
                                    disabled={!selectedDate}
                                    className={`px-3 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-none border ${!selectedDate ? "opacity-30 cursor-not-allowed border-transparent glass-pill" :
                                        selectedTime === time
                                            ? "bg-warning/90 backdrop-blur-md border-warning/50 text-base shadow-[0_0_15px_rgba(245,158,11,0.3)]"
                                            : "glass-pill text-t2 hover:bg-white/[0.04] hover:text-white"
                                        }`}
                                >
                                    {time}
                                </button>
                            ))}
                        </div>
                    </section>

                    {/* Goal & Level Section */}
                    <section>
                        <h3 className="text-sm font-sans font-semibold text-white mb-3 flex items-center gap-2">
                            <span className="text-accent">03.</span> Session Details
                        </h3>

                        <div className="flex glass-pill rounded-xl p-1 mb-4 select-none">
                            {["Beginner", "Intermediate", "Advanced"].map(l => (
                                <button
                                    key={l}
                                    onClick={() => setLevel(l)}
                                    className={`flex-1 py-2 rounded-lg text-xs font-mono font-bold transition-all cursor-none ${level === l ? "bg-accent/15 backdrop-blur-md border border-accent/30 text-accent shadow-[inset_0_0.5px_0_0_rgba(99,102,241,0.3)]" : "text-t2 hover:text-t1 border border-transparent"
                                        }`}
                                >
                                    {l}
                                </button>
                            ))}
                        </div>

                        <textarea
                            value={goal}
                            onChange={(e) => setGoal(e.target.value)}
                            placeholder="e.g. I want to understand React hooks and build a small project using them. I already know basic JS."
                            className="w-full h-32 glass-input rounded-2xl p-4 text-sm font-sans text-t1 resize-none cursor-none outline-none"
                        />
                        <div className="flex justify-between mt-2 px-1 text-xs font-mono">
                            <span className={goal.length < 20 ? "text-danger" : "text-t2"}>Min 20 characters</span>
                            <span className="text-t2">{goal.length} / 500</span>
                        </div>
                    </section>

                </div>

                {/* Footer actions */}
                <div className="p-6 border-t border-white/[0.06] glass flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-start gap-3 text-sm">
                        <Coins className={`w-5 h-5 flex-shrink-0 mt-0.5 ${balance < cost ? 'text-danger drop-shadow-[0_0_8px_#f43f5e]' : 'text-warning drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]'}`} />
                        <div>
                            <p className="font-sans text-white font-semibold">Total Cost: {cost} Credit{cost > 1 && 's'}</p>
                            <p className={`font-mono text-xs ${balance < cost ? 'text-danger font-bold' : 'text-t2'}`}>
                                {balance < cost ? `Insufficient Balance (Have ${balance})` : `Your balance: ${balance} 🪙`}
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={loading || balance < cost || !selectedSkill || !selectedDate || !selectedTime || goal.length < 20}
                        className="w-full sm:w-auto px-8 py-3 bg-primary/90 backdrop-blur-md text-base font-sans font-bold rounded-xl hover:shadow-[0_0_30px_rgba(56,189,248,0.3)] hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100 disabled:hover:shadow-none cursor-none flex justify-center items-center"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Send Request"}
                    </button>
                </div>

            </motion.div>
        </div>
    );
}
