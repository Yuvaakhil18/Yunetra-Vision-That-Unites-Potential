"use client";

import { motion } from "framer-motion";
import MatchCard from "./MatchCard";

interface MatchGridProps {
    matches?: any[];
    loading?: boolean;
    onRequestSession?: (match: any) => void;
    onViewProfile?: (match: any) => void;
}

export default function MatchGrid({ matches = [], loading = false, onRequestSession, onViewProfile }: MatchGridProps) {

    if (loading) {
        return (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 w-full">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="w-full h-[320px] glass-card rounded-[28px] p-6 relative overflow-hidden">
                        {/* Shimmer Effect */}
                        <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent z-10" />

                        <div className="flex justify-between items-start mb-6">
                            <div className="flex gap-4">
                                <div className="w-12 h-12 rounded-full bg-card" />
                                <div className="space-y-2">
                                    <div className="w-32 h-5 bg-card rounded" />
                                    <div className="w-24 h-3 bg-card rounded" />
                                </div>
                            </div>
                            <div className="w-12 h-12 rounded-full bg-card" />
                        </div>

                        <div className="space-y-4">
                            <div>
                                <div className="w-16 h-3 bg-card rounded mb-2" />
                                <div className="flex gap-2">
                                    <div className="w-16 h-6 bg-card rounded-full" />
                                    <div className="w-20 h-6 bg-card rounded-full" />
                                </div>
                            </div>
                            <div>
                                <div className="w-24 h-3 bg-card rounded mb-2" />
                                <div className="flex gap-2">
                                    <div className="w-14 h-6 bg-card rounded-full" />
                                </div>
                            </div>
                        </div>

                        <div className="absolute bottom-6 left-6 right-6 flex justify-between pt-4 border-t border-[rgba(255,255,255,0.06)]">
                            <div className="w-32 h-4 bg-card rounded" />
                            <div className="w-24 h-8 bg-card rounded-xl" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <motion.div
            className="grid grid-cols-1 xl:grid-cols-2 gap-5 w-full"
            initial="hidden"
            animate="show"
            variants={{
                hidden: { opacity: 0 },
                show: {
                    opacity: 1,
                    transition: { staggerChildren: 0.1 }
                }
            }}
        >
            {matches.map((match) => (
                <motion.div
                    key={match.userId}
                    layout
                    variants={{
                        hidden: { opacity: 0, scale: 0.95, y: 10 },
                        show: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
                    }}
                    exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                >
                    <MatchCard
                        match={match}
                        onRequestSession={onRequestSession}
                        onViewProfile={() => onViewProfile?.(match)}
                    />
                </motion.div>
            ))}
        </motion.div>
    );
}
