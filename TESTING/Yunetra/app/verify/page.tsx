"use client";

import { useState, useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { Sparkles, CheckCircle2, Lock, ArrowRight, Loader2, Code2, Paintbrush, Database, Server, Terminal, BrainCircuit, Layout, PenTool } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Define the static list of available skills based on the seeding script
const AVAILABLE_SKILLS = [
    { id: "React", name: "React", icon: Code2, desc: "hooks, state, props, routing", diff: "Beginner-Intermediate" },
    { id: "Figma", name: "Figma", icon: Paintbrush, desc: "components, auto-layout, prototyping", diff: "Beginner-Intermediate" },
    { id: "DSA", name: "DSA", icon: Database, desc: "arrays, trees, graphs, dynamic programming", diff: "Intermediate-Advanced" },
    { id: "Node.js", name: "Node.js", icon: Server, desc: "express, middleware, event loop", diff: "Beginner-Intermediate" },
    { id: "Python", name: "Python", icon: Terminal, desc: "lists, dicts, clean code, OOP", diff: "Beginner-Intermediate" },
    { id: "Machine Learning", name: "Machine Learning", icon: BrainCircuit, desc: "models, training, evaluation, bias", diff: "Intermediate-Advanced" },
    { id: "Canva", name: "Canva", icon: Layout, desc: "templates, typography, branding", diff: "Beginner" },
    { id: "UI Design", name: "UI Design", icon: PenTool, desc: "color theory, typography, spacing", diff: "Beginner-Intermediate" },
];

export default function VerifyPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    const [verifiedSkills, setVerifiedSkills] = useState<string[]>([]);
    const [cooldowns, setCooldowns] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(true);
    const [now, setNow] = useState(new Date().getTime());

    // Fetch user data mapping for verified skills and any stored cooldowns
    useEffect(() => {
        if (status === "authenticated" && session?.user) {
            const fetchUserData = async () => {
                try {
                    const userId = (session.user as any).id;
                    // Using local badges API to fetch user object explicitly
                    const res = await fetch(`/api/badges/${userId}`);
                    if (res.ok) {
                        const data = await res.json();
                        setVerifiedSkills(data.verifiedSkills || []);

                        // Map simulated cooldowns from test attempts (If we had a dedicated attempt history).
                        // Since the spec implies cooldown state mapping, we read from localStorage for this demo
                        // as a temporary lightweight "cooldown" engine unless DB supports it directly.
                        const localCooldowns = JSON.parse(localStorage.getItem(`yunetra_cooldowns_${userId}`) || "{}");
                        setCooldowns(localCooldowns);
                    }
                } catch (e) {
                    console.error(e);
                } finally {
                    setLoading(false);
                }
            };
            fetchUserData();
        }
    }, [status, session]);

    // Live countdown timer updater
    useEffect(() => {
        const interval = setInterval(() => setNow(new Date().getTime()), 60000); // UI updates every minute
        return () => clearInterval(interval);
    }, []);

    const getCooldownText = (targetEpoch: number) => {
        const diff = targetEpoch - now;
        if (diff <= 0) return null;
        const h = Math.floor(diff / (1000 * 60 * 60));
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        return `${h}h ${m}m`;
    };

    if (status === "loading" || loading) {
        return (
            <div className="min-h-screen pt-24 pb-12 px-4 md:px-8 max-w-7xl mx-auto flex items-center justify-center text-primary">
                <Loader2 className="w-8 h-8 animate-spin" />
            </div>
        );
    }

    // Calculate separated lists
    const verifiedList = AVAILABLE_SKILLS.filter(s => verifiedSkills.includes(s.id));

    return (
        <div className="min-h-screen pt-24 pb-20 px-4 md:px-8 max-w-[1200px] mx-auto font-sans relative">

            {/* HEADER */}
            <div className="text-center max-w-3xl mx-auto mb-16 relative z-10">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 border border-primary/30 shadow-[0_0_30px_rgba(56,189,248,0.1)] mb-6">
                    <Sparkles className="w-8 h-8 text-primary" />
                </div>
                <h1 className="text-4xl md:text-5xl font-syne font-extrabold tracking-tight mb-4 text-white">
                    Prove Your Skills
                </h1>
                <p className="text-t2 text-base md:text-lg mb-8 leading-relaxed">
                    Pass a quick 5-question test to become a Verified Teacher.
                    Verified skills earn more session requests and higher trust scores.
                </p>
                <div className="inline-flex flex-wrap items-center justify-center gap-3 md:gap-6 px-6 py-3 rounded-full bg-card/50 border border-[rgba(255,255,255,0.06)] text-xs md:text-sm font-mono font-semibold text-t1 backdrop-blur-md">
                    <span className="text-primary">3/5 correct to pass</span>
                    <span className="hidden md:inline text-[rgba(255,255,255,0.06)]">•</span>
                    <span className="text-warning">24hr cooldown on retry</span>
                    <span className="hidden md:inline text-[rgba(255,255,255,0.06)]">•</span>
                    <span className="text-white">Instant badge if you pass</span>
                </div>
            </div>

            {/* VERIFIED SKILLS SECTION */}
            <div className="mb-20">
                <h2 className="text-lg font-syne font-bold text-white mb-6 flex items-center gap-2">
                    Your Verified Skills <span className="text-t2 font-mono font-normal">({verifiedList.length})</span>
                </h2>

                {verifiedList.length === 0 ? (
                    <div className="p-8 rounded-[24px] border border-[rgba(255,255,255,0.06)] border-dashed bg-subtle/30 text-center">
                        <p className="text-t2 text-sm font-sans">No verified skills yet. Take a test below to earn your first badge!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {verifiedList.map(skill => {
                            const Icon = skill.icon;
                            return (
                                <motion.div
                                    key={`verified-${skill.id}`}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="relative p-6 rounded-[24px] bg-gradient-to-br from-primary/10 to-subtle border border-primary/30 overflow-hidden group/card"
                                >
                                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/20 blur-[30px] rounded-full group-hover/card:bg-primary/30 transition-colors pointer-events-none" />

                                    <div className="flex justify-between items-start mb-4 relative z-10">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/30">
                                                <Icon className="w-5 h-5 text-primary" />
                                            </div>
                                            <h3 className="font-syne font-bold text-xl text-white tracking-tight">{skill.name}</h3>
                                        </div>
                                        <div className="bg-primary/20 text-primary p-1.5 rounded-full shadow-[0_0_10px_rgba(56,189,248,0.3)]">
                                            <CheckCircle2 className="w-4 h-4" />
                                        </div>
                                    </div>

                                    <p className="text-xs font-mono text-t2 mb-6 flex gap-2">
                                        <span className="text-primary">✓ Verified Active</span>
                                        <span className="opacity-30">•</span>
                                        <span>Boosts ranking x2</span>
                                    </p>

                                    <Link href={`/verify/${skill.id}`} className="inline-flex items-center gap-2 text-xs font-sans font-bold text-t1 hover:text-white px-3 py-1.5 rounded-lg bg-card/50 hover:bg-card transition-colors  border border-transparent hover:border-[rgba(255,255,255,0.06)]">
                                        <RefreshCcw className="w-3 h-3" /> Retake to improve
                                    </Link>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* AVAILABLE SKILLS GRID */}
            <div>
                <h2 className="text-lg font-syne font-bold text-white mb-6">Available Skill Tests</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {AVAILABLE_SKILLS.map(skill => {
                        const Icon = skill.icon;
                        const isVerified = verifiedSkills.includes(skill.id);

                        // Cooldown parsing
                        const cooldownEpoch = cooldowns[skill.id] ? parseInt(cooldowns[skill.id]) : 0;
                        const isOnCooldown = cooldownEpoch > now;
                        const cooldownText = isOnCooldown ? getCooldownText(cooldownEpoch) : null;

                        return (
                            <Link
                                key={skill.id}
                                href={isOnCooldown ? "#" : `/verify/${skill.id}`}
                                onClick={(e) => { if (isOnCooldown) e.preventDefault(); }}
                                className={`relative p-6 bg-subtle border rounded-[24px] overflow-hidden transition-all duration-300 flex flex-col justify-between min-h-[220px] ${isVerified ? "border-primary shadow-[0_0_20px_rgba(56,189,248,0.05)]" :
                                    isOnCooldown ? "border-[rgba(255,255,255,0.03)] opacity-60 cursor-not-allowed" :
                                        "border-[rgba(255,255,255,0.06)] hover:border-primary/50 hover:bg-card/30 hover:-translate-y-1 group/skill"
                                    }`}
                            >
                                {/* Hover Glow effect for normal state */}
                                {!isVerified && !isOnCooldown && (
                                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-primary/5 opacity-0 group-hover/skill:opacity-100 transition-opacity pointer-events-none" />
                                )}

                                {/* Top Section */}
                                <div className="relative z-10 flex justify-between items-start mb-4">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${isVerified ? "bg-primary/20" : isOnCooldown ? "bg-card" : "bg-card group-hover/skill:bg-primary/10"}`}>
                                        <Icon className={`w-6 h-6 ${isVerified ? "text-primary" : isOnCooldown ? "text-t2" : "text-t1 group-hover/skill:text-primary transition-colors"}`} />
                                    </div>

                                    {isVerified && (
                                        <div className="text-[10px] font-mono font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-full border border-primary/20 flex items-center gap-1 shadow-[0_0_10px_rgba(56,189,248,0.2)]">
                                            <CheckCircle2 className="w-3 h-3" /> Verified
                                        </div>
                                    )}
                                    {isOnCooldown && (
                                        <div className="w-8 h-8 rounded-full bg-card flex items-center justify-center border border-[rgba(255,255,255,0.06)]">
                                            <Lock className="w-4 h-4 text-t2" />
                                        </div>
                                    )}
                                </div>

                                {/* Middle Info */}
                                <div className="relative z-10 mb-6">
                                    <h3 className="font-syne font-bold text-xl text-white tracking-tight mb-2">{skill.name}</h3>
                                    <div className="flex flex-col gap-1.5 text-xs font-mono text-t2">
                                        <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-white/30" /> {skill.diff}</span>
                                        <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-white/30" /> 5 Questions • ~3 min</span>
                                    </div>
                                </div>

                                {/* Bottom Action / Overlay */}
                                <div className="relative z-10 mt-auto">
                                    {isOnCooldown ? (
                                        <div className="w-full text-center py-2.5 bg-card rounded-xl text-xs font-mono font-bold text-warning border border-[rgba(255,255,255,0.06)] animate-pulse">
                                            Available in {cooldownText}
                                        </div>
                                    ) : isVerified ? (
                                        // Minimal interaction prompt if verified
                                        <div className="text-xs font-sans text-t2/50">Test passed recently</div>
                                    ) : (
                                        <div className="w-full flex justify-between items-center px-4 py-2.5 bg-primary/10 text-primary border border-primary/30 rounded-xl font-bold font-sans text-sm group-hover/skill:bg-primary group-hover/skill:text-black transition-colors">
                                            Start Test <ArrowRight className="w-4 h-4" />
                                        </div>
                                    )}
                                </div>


                            </Link>
                        );
                    })}
                </div>

            </div>
        </div>
    );
}

// Minimal stub for the Refresh icon
function RefreshCcw(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
            <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
            <path d="M16 21v-5h5" />
        </svg>
    );
}
