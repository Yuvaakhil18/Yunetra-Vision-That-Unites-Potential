"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { FollowButton } from './FollowButton';
import { Star, X } from 'lucide-react';
import { SkillTag } from './SkillTag';

interface FollowSuggestionCardProps {
    user: {
        _id: string;
        name: string;
        college: string;
        skillsTeach: string[];
        rating: number;
        totalSessions: number;
    };
    reason: string;
    onDismiss?: (userId: string) => void;
}

export function FollowSuggestionCard({ user, reason, onDismiss }: FollowSuggestionCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative glass-card rounded-2xl p-4 hover:bg-white/[0.02] transition-all border border-white/[0.06]"
        >
            {/* Dismiss button */}
            {onDismiss && (
                <button
                    onClick={() => onDismiss(user._id)}
                    className="absolute top-2 right-2 p-1 rounded-full glass-btn hover:bg-white/10 transition-colors"
                    aria-label="Dismiss suggestion"
                >
                    <X className="w-4 h-4 text-t2" />
                </button>
            )}

            {/* Avatar */}
            <div className="flex items-start gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-black font-bold text-lg flex-shrink-0">
                    {user.name.charAt(0).toUpperCase()}
                </div>
                
                <div className="flex-1 min-w-0">
                    <h3 className="text-white font-syne font-bold text-sm truncate">{user.name}</h3>
                    <p className="text-t2 text-xs font-mono truncate">{user.college}</p>
                    
                    {/* Reason badge */}
                    <div className="mt-1">
                        <span className="inline-block px-2 py-0.5 bg-primary/10 text-primary text-[0.65rem] font-mono uppercase tracking-wider rounded-full border border-primary/20">
                            {reason}
                        </span>
                    </div>
                </div>
            </div>

            {/* Skills */}
            <div className="flex flex-wrap gap-1 mb-3">
                {user.skillsTeach.slice(0, 2).map((skill) => (
                    <SkillTag key={skill} skill={skill} variant="teach" />
                ))}
            </div>

            {/* Stats and Follow Button */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-xs text-t2 font-mono">
                    <span className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-warning text-warning" />
                        {user.rating || 0}
                    </span>
                    <span>{user.totalSessions || 0} sessions</span>
                </div>
                
                <FollowButton userId={user._id} size="sm" />
            </div>
        </motion.div>
    );
}
