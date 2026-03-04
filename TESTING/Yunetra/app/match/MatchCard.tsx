"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import CountUp from "react-countup";
import { Star, BookOpen, Clock, Zap, Target, Award, Users } from "lucide-react";
import { SkillTag } from "@/components/SkillTag";
import { FollowButton } from "@/components/FollowButton";
import { GradientButton } from "@/components/ui/gradient-button";

type MatchCardProps = {
    match: any;
    onRequestSession: (match: any) => void;
    onViewProfile: () => void;
};

export default function MatchCard({ match, onRequestSession, onViewProfile }: MatchCardProps) {
    const { name, college, year, skillsTeach, skillsLearn, rating, totalSessions, badges, compatibilityScore, matchReasons } = match;

    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
    const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["6deg", "-6deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-6deg", "6deg"]);

    // Calculate correct circumference for the SVG circle (radius = 15.9155)
    const CIRCUMFERENCE = 100; // 2 * π * 15.9155 ≈ 100
    const strokeDashArray = `${(compatibilityScore / 100) * CIRCUMFERENCE} ${CIRCUMFERENCE}`;

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

    const getThemeColor = (score: number) => {
        if (score >= 80) return "#38bdf8"; // Primary
        if (score >= 50) return "#f59e0b"; // Warning
        return "#6366f1"; // Accent
    };

    const themeColor = getThemeColor(compatibilityScore);

    // Generate match reasons for display
    const displayReasons = matchReasons?.slice(0, 3).map((reason, i) => ({
        text: reason,
        dot: i === 0 ? "bg-primary" : i === 1 ? "bg-accent" : "bg-warning"
    })) || [];

    return (
        <motion.div
            style={{
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            whileHover={{ y: -8, scale: 1.02 }}
            className="relative w-full rounded-[28px] glass-card glass-shine p-6 group transition-all duration-300"
        >
            <style jsx>{`
        .group:hover {
          border-color: ${themeColor}30;
          box-shadow: inset 0 0.5px 0 0 rgba(255,255,255,0.12), 0 16px 50px rgba(0,0,0,0.35), 0 0 80px ${themeColor}10;
        }
      `}</style>

            <div className="absolute inset-0 rounded-[28px] bg-gradient-to-br from-white/[0.04] to-transparent pointer-events-none" />

            {/* TOP: Score & User Info */}
            <div className="flex items-start justify-between mb-6" style={{ transform: "translateZ(30px)" }}>

                {/* User Info Left */}
                <div className="flex gap-4">
                    <div
                        className="w-14 h-14 rounded-full p-[2px] relative group-hover:scale-105 transition-transform"
                        style={{ background: `linear-gradient(to top right, ${themeColor}, transparent)` }}
                    >
                        <div className="w-full h-full bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center font-syne font-bold text-xl relative z-10">
                            {name?.charAt(0) || "U"}
                        </div>
                        {badges?.length > 0 && (
                            <div className="absolute -bottom-1 -right-1 w-5 h-5 glass-pill rounded-full flex items-center justify-center z-20">
                                <Award className="w-3.5 h-3.5 text-primary drop-shadow-[0_0_4px_#38bdf8]" />
                            </div>
                        )}
                    </div>
                    <div>
                        <h3 className="font-syne font-bold font-xl text-t1 tracking-tight group-hover:text-white transition-colors">{name}</h3>
                        <p className="text-t2 text-xs font-mono mt-1 flex gap-2">
                            <span>{college || "College Unknown"}</span>
                            <span className="opacity-50">•</span>
                            <span>{year || "Year Unknown"}</span>
                        </p>
                    </div>
                </div>

                {/* Compatibility Ring Right */}
                <div className="relative w-16 h-16 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <svg 
                        className="absolute inset-0 w-full h-full transform -rotate-90" 
                        viewBox="0 0 36 36" 
                        style={{ objectFit: 'contain' }}
                    >
                        <path
                            className="text-card/30 group-hover:text-card/50 transition-colors duration-300"
                            strokeWidth="2.5"
                            stroke="currentColor"
                            fill="none"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <motion.path
                            stroke={themeColor}
                            strokeWidth="2.5"
                            strokeDasharray={strokeDashArray}
                            strokeLinecap="round"
                            fill="none"
                            style={{ 
                                filter: `drop-shadow(0 0 3px ${themeColor}40)`,
                                strokeDashoffset: 0,
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                            }}
                            initial={{ strokeDasharray: `0 ${CIRCUMFERENCE}` }}
                            animate={{ strokeDasharray: strokeDashArray }}
                            transition={{ 
                                duration: 2, 
                                ease: "easeInOut", 
                                delay: 0.2 
                            }}
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            className="group-hover:stroke-[3.5px] group-hover:drop-shadow-[0_0_8px_currentColor] transition-all duration-300 ease-out"
                        />
                    </svg>
                    <div className="relative z-10 flex flex-col items-center justify-center">
                        <span 
                            className="font-syne font-black text-sm leading-none tracking-tighter group-hover:scale-110 transition-all duration-300 ease-out" 
                            style={{ 
                                color: themeColor,
                                textShadow: `0 0 8px ${themeColor}20`
                            }}
                        >
                            <CountUp end={compatibilityScore} duration={2} delay={0.2} />%
                        </span>
                    </div>
                </div>

            </div>

            {/* MIDDLE: Skills Stack */}
            <div className="space-y-4 mb-5" style={{ transform: "translateZ(20px)" }}>
                {skillsTeach?.length > 0 && (
                    <div>
                        <p className="text-[10px] text-primary font-mono font-bold mb-2 uppercase tracking-widest flex items-center gap-1.5 opacity-80 group-hover:opacity-100">
                            <BookOpen className="w-3 h-3" /> They Teach
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {skillsTeach.slice(0, 3).map((skill: string) => (
                                <SkillTag
                                    key={skill}
                                    skill={skill}
                                    variant={badges?.includes(skill) ? "verified" : "teach"}
                                />
                            ))}
                            {skillsTeach.length > 3 && (
                                <span className="text-xs text-t2 font-mono flex items-center px-1">+{skillsTeach.length - 3}</span>
                            )}
                        </div>
                    </div>
                )}

                {skillsLearn?.length > 0 && (
                    <div>
                        <p className="text-[10px] text-accent font-mono font-bold mb-2 uppercase tracking-widest flex items-center gap-1.5 opacity-80 group-hover:opacity-100">
                            <Target className="w-3 h-3" /> They Want to Learn
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {skillsLearn.slice(0, 3).map((skill: string) => (
                                <SkillTag key={skill} skill={skill} variant="learn" />
                            ))}
                            {skillsLearn.length > 3 && (
                                <span className="text-xs text-t2 font-mono flex items-center px-1">+{skillsLearn.length - 3}</span>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* MATCH REASONS */}
            <div className="mb-6 p-3 rounded-xl glass-subtle space-y-2 group-hover:bg-white/[0.04] transition-colors" style={{ transform: "translateZ(15px)" }}>
                {displayReasons.map((reason, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs font-sans text-t2 group-hover:text-t1 transition-colors">
                        <div className={`w-1.5 h-1.5 rounded-full ${reason.dot} shadow-[0_0_5px_${reason.dot.replace('bg-', '')}] flex-shrink-0`} />
                        <span className="truncate">{reason.text}</span>
                    </div>
                ))}
            </div>

            {/* BOTTOM: Stats and Actions */}
            <div className="pt-5 border-t border-white/[0.04] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4" style={{ transform: "translateZ(25px)" }}>

                {/* Stats */}
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5" title="Average Rating">
                        <Star className="w-4 h-4 text-warning fill-warning drop-shadow-[0_0_4px_rgba(245,158,11,0.5)] group-hover:scale-110 transition-transform" />
                        <span className="font-mono text-sm font-bold text-white">{rating?.toFixed(1) || "5.0"}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-t2 group-hover:text-t1 transition-colors" title="Sessions Completed">
                        <Users className="w-4 h-4" />
                        <span className="font-mono text-xs font-bold">{totalSessions || 0}</span>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 w-full sm:w-auto">
                    <FollowButton userId={match._id} size="sm" />
                    <button
                        onClick={onViewProfile}
                        className="flex-1 sm:flex-none px-4 py-2 glass-btn rounded-xl font-sans text-sm font-semibold text-t1 cursor-pointer"
                    >
                        Profile
                    </button>
                    <GradientButton
                        onClick={() => {
                            console.log('Request button clicked', match);
                            onRequestSession(match);
                        }}
                        className="flex-1 sm:flex-none !px-4 !py-2 !rounded-xl !text-sm group/btn"
                    >
                        <Zap className="w-3.5 h-3.5" /> Request
                    </GradientButton>
                </div>
            </div>
        </motion.div>
    );
}
