"use client";

import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import { SkillTag } from "./SkillTag";
import { Star, Check } from "lucide-react";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { GradientButton } from "@/components/ui/gradient-button";

interface UserCardProps {
    name: string;
    college: string;
    year: string;
    compatibilityScore?: number;
    skillsTeach: string[];
    skillsLearn: string[];
    rating: number;
    sessionsCount: number;
    onRequest?: () => void;
}

export function UserCard({
    name,
    college,
    year,
    compatibilityScore,
    skillsTeach,
    skillsLearn,
    rating,
    sessionsCount,
    onRequest,
}: UserCardProps) {
    const [requested, setRequested] = useState(false);
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x);
    const mouseYSpring = useSpring(y);

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["8deg", "-8deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-8deg", "8deg"]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;
        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    const getScoreColor = (score: number) => {
        if (score >= 70) return "#00d4aa";
        if (score >= 40) return "#f59e0b";
        return "#f43f5e";
    };

    return (
        <motion.div
            style={{
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            whileHover={{ y: -6, scale: 1.02 }}
            className="relative w-full max-w-sm rounded-[28px] glass-card glass-shine p-6 group"
        >
            <div className="absolute inset-0 rounded-[28px] bg-gradient-to-br from-white/[0.04] to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

            {/* Top Section */}
            <div className="flex items-start justify-between mb-6" style={{ transform: "translateZ(30px)" }}>
                <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-full p-[2px] bg-gradient-to-tr from-primary to-accent relative">
                        <div className="w-full h-full bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center font-syne font-bold text-lg">
                            {name.charAt(0)}
                        </div>
                    </div>
                    <div>
                        <h3 className="font-syne font-bold font-lg text-t1 tracking-tight">{name}</h3>
                        <p className="text-t2 text-sm font-sans">{college} • {year}</p>
                    </div>
                </div>

                {compatibilityScore !== undefined && (
                    <div className="relative w-12 h-12 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90 absolute" viewBox="0 0 36 36">
                            <path
                                className="text-card"
                                strokeWidth="3"
                                stroke="currentColor"
                                fill="none"
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            />
                            <motion.path
                                stroke={getScoreColor(compatibilityScore)}
                                strokeWidth="3"
                                strokeDasharray={`${compatibilityScore}, 100`}
                                strokeLinecap="round"
                                fill="none"
                                initial={{ strokeDasharray: "0, 100" }}
                                animate={{ strokeDasharray: `${compatibilityScore}, 100` }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            />
                        </svg>
                        <span className="font-syne font-bold text-sm tracking-tighter" style={{ color: getScoreColor(compatibilityScore) }}>
                            {compatibilityScore}%
                        </span>
                    </div>
                )}
            </div>

            {/* Skills */}
            <div className="space-y-4 mb-6" style={{ transform: "translateZ(20px)" }}>
                {skillsTeach.length > 0 && (
                    <div>
                        <p className="text-xs uppercase text-t2 font-mono mb-2">Can Teach</p>
                        <div className="flex flex-wrap gap-2">
                            {skillsTeach.map(skill => (
                                <SkillTag key={skill} skill={skill} variant="teach" />
                            ))}
                        </div>
                    </div>
                )}
                {skillsLearn.length > 0 && (
                    <div>
                        <p className="text-xs uppercase text-t2 font-mono mb-2">Wants to Learn</p>
                        <div className="flex flex-wrap gap-2">
                            {skillsLearn.map(skill => (
                                <SkillTag key={skill} skill={skill} variant="learn" />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Bottom */}
            <div className="pt-4 border-t border-white/[0.04] flex items-center justify-between" style={{ transform: "translateZ(25px)" }}>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 text-warning">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="font-mono text-sm font-bold">{rating.toFixed(1)}</span>
                    </div>
                    <span className="text-t2 text-xs font-mono">{sessionsCount} sessions</span>
                </div>
                {requested ? (
                    <button
                        disabled
                        className="px-4 py-2 rounded-xl font-sans font-semibold text-sm transition-all duration-300 bg-green-500/15 backdrop-blur-md text-green-400 border border-green-500/20 shadow-[inset_0_0.5px_0_0_rgba(34,197,94,0.2)]"
                    >
                        <span className="flex items-center gap-1.5">
                            <Check className="w-3.5 h-3.5" /> Sent!
                        </span>
                    </button>
                ) : (
                    <GradientButton
                        onClick={() => {
                            setRequested(true);
                            onRequest?.();
                            toast.success('Request Sent!', {
                                icon: '🚀',
                                style: {
                                    borderRadius: '12px',
                                    background: '#1a1a2e',
                                    color: '#38bdf8',
                                    border: '1px solid rgba(56,189,248,0.3)',
                                    fontFamily: 'var(--font-sans)',
                                    fontWeight: 600,
                                },
                            });
                            setTimeout(() => setRequested(false), 3000);
                        }}
                        className="!px-4 !py-2 !rounded-xl !text-sm !min-w-[100px]"
                    >
                        Request
                    </GradientButton>
                )}
            </div>
        </motion.div>
    );
}
