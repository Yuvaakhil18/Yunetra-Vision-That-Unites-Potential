"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

interface SkillTagProps {
    skill: string;
    variant: "teach" | "learn" | "verified";
}

export function SkillTag({ skill, variant }: SkillTagProps) {
    const isTeach = variant === "teach";
    const isLearn = variant === "learn";
    const isVerified = variant === "verified";

    let bgClass = "";
    let textClass = "";
    let borderClass = "";

    if (isTeach) {
        bgClass = "bg-[#38bdf8]/10";
        textClass = "text-[#38bdf8]";
        borderClass = "border-[#38bdf8]/30";
    } else if (isLearn) {
        bgClass = "bg-[#6366f1]/10";
        textClass = "text-[#6366f1]";
        borderClass = "border-[#6366f1]/30";
    } else if (isVerified) {
        bgClass = "bg-[#00d4aa]/20";
        textClass = "text-[#00d4aa]";
        borderClass = "border-[#00d4aa]/50";
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05, filter: "brightness(1.2)" }}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border ${bgClass} ${textClass} ${borderClass} font-mono text-xs font-bold tracking-wide transition-all`}
        >
            {isVerified && <Check className="w-3 h-3" />}
            {skill}
        </motion.div>
    );
}
