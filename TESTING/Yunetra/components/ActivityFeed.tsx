"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Book, Award, Upload, Swords, Users, Loader2 } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

interface Activity {
    _id: string;
    type: string;
    description: string;
    userId: string;
    userName: string;
    relatedUser?: string;
    relatedUserName?: string;
    relatedChallenge?: string;
    relatedBadge?: string;
    createdAt: string;
}

const getActivityIcon = (type: string) => {
    switch (type) {
        case 'won_arena':
            return <Trophy className="w-5 h-5 text-yellow-500" />;
        case 'taught_session':
            return <Book className="w-5 h-5 text-blue-500" />;
        case 'earned_badge':
            return <Award className="w-5 h-5 text-purple-500" />;
        case 'shared_resource':
            return <Upload className="w-5 h-5 text-green-500" />;
        case 'joined_arena':
        case 'joined_team':
            return <Swords className="w-5 h-5 text-orange-500" />;
        case 'new_connection':
            return <Users className="w-5 h-5 text-emerald-500" />;
        default:
            return <Users className="w-5 h-5 text-gray-500" />;
    }
};

const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return `${Math.floor(seconds / 604800)}w ago`;
};

export function ActivityFeed() {
    const [activities, setActivities] = useState<Activity[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    useEffect(() => {
        fetchActivities();
        
        // Auto-refresh every 60 seconds
        const interval = setInterval(() => {
            fetchActivities(true);
        }, 60000);

        return () => clearInterval(interval);
    }, []);

    const fetchActivities = async (silent = false) => {
        if (!silent) setLoading(true);
        
        try {
            const response = await fetch('/api/follow/activity-feed');
            
            if (!response.ok) {
                throw new Error('Failed to fetch activity feed');
            }

            const data = await response.json();
            setActivities(data.activities || []);
            setHasMore(data.activities?.length >= 50);
        } catch (error: any) {
            if (!silent) {
                toast.error(error.message || 'Failed to load activity feed');
            }
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (activities.length === 0) {
        return (
            <div className="text-center py-12">
                <Users className="w-16 h-16 text-t2/50 mx-auto mb-4" />
                <h3 className="text-xl font-syne font-bold text-t1 mb-2">No Activity Yet</h3>
                <p className="text-t2 font-mono text-sm">
                    Follow people to see their activity here
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            <AnimatePresence>
                {activities.slice(0, page * 20).map((activity, index) => (
                    <motion.div
                        key={activity._id || index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ delay: index * 0.03 }}
                        className="flex items-start gap-3 p-4 glass-card rounded-2xl hover:bg-white/[0.02] transition-all group border border-white/[0.06]"
                    >
                        {/* Icon */}
                        <div className="mt-1 flex-shrink-0">
                            {getActivityIcon(activity.type)}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                                <div className="flex-1">
                                    <Link 
                                        href={`/profile/${activity.userId}`}
                                        className="font-syne font-bold text-white hover:text-primary transition-colors"
                                    >
                                        {activity.userName}
                                    </Link>
                                    <span className="text-t2 text-sm ml-2">
                                        {activity.description}
                                    </span>
                                </div>
                                
                                <span className="text-xs text-t2 font-mono flex-shrink-0">
                                    {getTimeAgo(activity.createdAt)}
                                </span>
                            </div>

                            {/* Related content */}
                            {activity.relatedUserName && (
                                <Link
                                    href={`/profile/${activity.relatedUser}`}
                                    className="text-sm text-primary hover:text-primary/80 transition-colors font-mono mt-1 inline-block"
                                >
                                    @{activity.relatedUserName}
                                </Link>
                            )}
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>

            {/* Load More */}
            {hasMore && activities.length > page * 20 && (
                <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onClick={() => setPage(p => p + 1)}
                    className="w-full py-3 rounded-2xl glass-btn text-t1 hover:text-primary font-syne font-semibold transition-all border border-white/[0.06]"
                >
                    Load More
                </motion.button>
            )}
        </div>
    );
}
