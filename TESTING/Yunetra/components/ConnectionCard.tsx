"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { FollowButton } from './FollowButton';
import { Star, Users } from 'lucide-react';
import { SkillTag } from './SkillTag';
import Link from 'next/link';

interface ConnectionCardProps {
    user: {
        _id: string;
        name: string;
        college: string;
        skillsTeach: string[];
        rating: number;
        totalSessions: number;
        followersCount?: number;
        followingCount?: number;
    };
    showInviteButton?: boolean;
    onInvite?: (userId: string) => void;
}

export function ConnectionCard({ user, showInviteButton, onInvite }: ConnectionCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ y: -4, scale: 1.02 }}
            className="relative glass-card rounded-2xl p-6 group overflow-hidden border border-white/[0.06] hover:border-primary/30 transition-all"
        >
            {/* Connected badge */}
            <div className="absolute top-4 right-4 flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary text-[0.65rem] font-mono uppercase tracking-wider rounded-full border border-primary/20">
                <span>Connected 🤝</span>
            </div>

            {/* Avatar */}
            <div className="flex items-start gap-4 mb-4">
                <div className="relative">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-black font-bold text-2xl">
                        {user.name.charAt(0).toUpperCase()}
                    </div>
                </div>
                
                <div className="flex-1 min-w-0">
                    <Link href={`/profile/${user._id}`} className="hover:text-primary transition-colors">
                        <h3 className="text-white font-syne font-bold text-lg truncate">{user.name}</h3>
                    </Link>
                    <p className="text-t2 text-sm font-mono mb-2 truncate">{user.college}</p>
                    
                    {/* Network stats */}
                    {(user.followersCount !== undefined || user.followingCount !== undefined) && (
                        <div className="flex items-center gap-3 text-xs text-t2 font-mono">
                            <span className="flex items-center gap-1">
                                <Users className="w-3 h-3" />
                                {user.followersCount || 0} followers
                            </span>
                            <span>·</span>
                            <span>{user.followingCount || 0} following</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Skills */}
            <div className="flex flex-wrap gap-2 mb-4">
                {user.skillsTeach.slice(0, 5).map((skill) => (
                    <SkillTag key={skill} skill={skill} variant="teach" />
                ))}
            </div>

            {/* Stats row */}
            <div className="flex items-center gap-4 text-sm text-t2 font-mono mb-4">
                <span className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-warning text-warning" />
                    {user.rating?.toFixed(1) || '0.0'}
                </span>
                <span>·</span>
                <span>{user.totalSessions || 0} sessions</span>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
                <Link 
                    href={`/profile/${user._id}`}
                    className="flex-1 px-4 py-2 rounded-full glass-btn text-center text-sm font-syne font-semibold text-t1 hover:text-primary transition-all"
                >
                    View Profile
                </Link>
                
                {showInviteButton && onInvite && (
                    <button
                        onClick={() => onInvite(user._id)}
                        className="flex-1 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-primary text-sm font-syne font-bold hover:bg-primary/20 transition-all"
                    >
                        Invite to Team
                    </button>
                )}
            </div>
        </motion.div>
    );
}
