"use client";

import { motion } from "framer-motion";
import { Calendar, Trophy, Users, Clock, Tag, Building, ArrowRight } from "lucide-react";
import { ARENA_CATEGORIES, DIFFICULTY_LABELS, PRIZE_TYPE_LABELS } from "@/constants/arenaConstants";
import { SkillTag } from "@/components/SkillTag";
import { GradientButton } from "@/components/ui/gradient-button";

type Challenge = any;

interface ChallengeCardProps {
    challenge: Challenge;
    index: number;
    onSubmit: (challenge: Challenge) => void;
}

export default function ChallengeCard({ challenge, index, onSubmit }: ChallengeCardProps) {
    const category = ARENA_CATEGORIES[challenge.category as keyof typeof ARENA_CATEGORIES];
    const difficulty = DIFFICULTY_LABELS[challenge.difficulty as keyof typeof DIFFICULTY_LABELS];
    
    const daysText = challenge.daysRemaining > 0 
        ? `${challenge.daysRemaining} days left`
        : 'Deadline passed';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, type: "spring", stiffness: 300, damping: 24 }}
            whileHover={{ y: -4, scale: 1.01 }}
            className="relative w-full rounded-[28px] glass-card glass-shine p-6 group transition-all duration-300"
        >
            <div className="absolute inset-0 rounded-[28px] bg-gradient-to-br from-white/[0.04] to-transparent pointer-events-none" />
            
            {/* Top colored bar */}
            <div 
                className="absolute top-0 left-0 right-0 h-1 rounded-t-[28px]"
                style={{ backgroundColor: category.color }}
            />
            
            {/* Category Icon Badge */}
            <div
                className="absolute top-6 right-6 w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                style={{
                    backgroundColor: `${category.color}15`,
                    border: `1px solid ${category.color}30`
                }}
            >
                {category.icon}
            </div>

            {/* Organization */}
            <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-lg">
                    {challenge.orgLogo || <Building className="w-4 h-4" />}
                </div>
                <span className="text-t2 font-mono text-sm">{challenge.organization}</span>
            </div>

            {/* Title */}
            <h3 className="text-xl font-syne font-bold text-white mb-3 pr-14 leading-tight">
                {challenge.title}
            </h3>

            {/* Description */}
            <p className="text-t2 text-sm leading-relaxed mb-5 line-clamp-3">
                {challenge.description}
            </p>

            {/* Skills Required */}
            <div className="mb-5">
                <div className="flex items-center gap-2 mb-2">
                    <Tag className="w-4 h-4 text-t2" />
                    <span className="text-t2 font-mono text-xs uppercase tracking-wider">Skills Required</span>
                </div>
                <div className="flex flex-wrap gap-2">
                    {challenge.skillsRequired.slice(0, 4).map((skill: string) => (
                        <SkillTag key={skill} skill={skill} variant="teach" />
                    ))}
                    {challenge.skillsRequired.length > 4 && (
                        <div className="px-3 py-1 rounded-full bg-white/5 text-t2 text-xs font-mono">
                            +{challenge.skillsRequired.length - 4} more
                        </div>
                    )}
                </div>
            </div>

            {/* Meta Info */}
            <div className="grid grid-cols-2 gap-3 mb-5 pb-5 border-b border-white/[0.06]">
                <div className="flex items-center gap-2">
                    <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{
                            backgroundColor: `${difficulty.color}15`,
                            color: difficulty.color
                        }}
                    >
                        <Trophy className="w-4 h-4" />
                    </div>
                    <div>
                        <div className="text-t2 text-xs font-mono">Difficulty</div>
                        <div className="text-white text-sm font-syne font-bold">{difficulty.label}</div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        challenge.daysRemaining > 7 ? 'bg-green-500/15 text-green-400' :
                        challenge.daysRemaining > 3 ? 'bg-warning/15 text-warning' :
                        'bg-danger/15 text-danger'
                    }`}>
                        <Clock className="w-4 h-4" />
                    </div>
                    <div>
                        <div className="text-t2 text-xs font-mono">Deadline</div>
                        <div className="text-white text-sm font-syne font-bold">{daysText}</div>
                    </div>
                </div>
            </div>

            {/* Prize Info */}
            <div className="mb-5">
                <div className="flex items-center gap-2 mb-2">
                    <Trophy className="w-4 h-4 text-warning" />
                    <span className="text-warning font-mono text-xs uppercase tracking-wider">
                        {PRIZE_TYPE_LABELS[challenge.prizeType as keyof typeof PRIZE_TYPE_LABELS]}
                    </span>
                </div>
                <div className="flex flex-col gap-1">
                    {challenge.prizeAmount && (
                        <div className="text-2xl font-syne font-extrabold text-primary">
                            ₹{challenge.prizeAmount.toLocaleString()}
                        </div>
                    )}
                    {challenge.internshipDetails && (
                        <div className="text-t1 text-sm font-sans">
                            {challenge.internshipDetails}
                        </div>
                    )}
                </div>
            </div>

            {/* Team Info */}
            {!challenge.allowSolo && (
                <div className="flex items-center gap-2 mb-5 px-3 py-2 rounded-xl bg-accent/10 border border-accent/30">
                    <Users className="w-4 h-4 text-accent" />
                    <span className="text-accent text-xs font-mono">
                        Team Challenge ({challenge.minTeamSize}-{challenge.maxTeamSize} members)
                    </span>
                </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-5 border-t border-white/[0.04]">
                <button 
                    className="flex-1 px-4 py-2.5 rounded-xl glass-btn text-t1 font-syne font-semibold text-sm hover:text-white transition-colors"
                    onClick={() => {
                        // View details logic
                    }}
                >
                    View Details
                </button>
                <GradientButton
                    onClick={() => onSubmit(challenge)}
                    disabled={challenge.isExpired}
                    className="flex-1 !px-4 !py-2.5 !rounded-xl !text-sm group"
                >
                    {challenge.isExpired ? 'Closed' : (
                        <>
                            Submit Entry
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </>
                    )}
                </GradientButton>
            </div>

            {/* Submission Count */}
            <div className="mt-4 text-center text-t2 text-xs font-mono">
                {challenge.totalSubmissions} {challenge.totalSubmissions === 1 ? 'submission' : 'submissions'} so far
            </div>
        </motion.div>
    );
}
