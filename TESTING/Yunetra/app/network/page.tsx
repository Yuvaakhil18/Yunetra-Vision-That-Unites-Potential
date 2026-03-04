"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, RefreshCcw, Search, Users, UserPlus, Heart, Sparkles } from "lucide-react";
import { FollowButton } from "@/components/FollowButton";
import { FollowSuggestionCard } from "@/components/FollowSuggestionCard";
import { ConnectionCard } from "@/components/ConnectionCard";
import { ActivityFeed } from "@/components/ActivityFeed";
import { SkillTag } from "@/components/SkillTag";
import Link from "next/link";
import toast from "react-hot-toast";

type Tab = 'discover' | 'following' | 'followers' | 'connections';

export default function NetworkPage() {
    const { data: session, status } = useSession();
    const [activeTab, setActiveTab] = useState<Tab>('discover');
    const [loading, setLoading] = useState(false);
    
    // Data states
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [following, setFollowing] = useState<any[]>([]);
    const [followers, setFollowers] = useState<any[]>([]);
    const [connections, setConnections] = useState<any[]>([]);
    
    // UI states
    const [searchQuery, setSearchQuery] = useState('');
    const [refreshing, setRefreshing] = useState(false);
    const [dismissedSuggestions, setDismissedSuggestions] = useState<Set<string>>(new Set());

    useEffect(() => {
        if (status === "authenticated") {
            fetchTabData(activeTab);
        }
    }, [status, activeTab]);

    const fetchTabData = async (tab: Tab) => {
        setLoading(true);
        try {
            switch (tab) {
                case 'discover':
                    await fetchSuggestions();
                    break;
                case 'following':
                    await fetchFollowing();
                    break;
                case 'followers':
                    await fetchFollowers();
                    break;
                case 'connections':
                    await fetchConnections();
                    break;
            }
        } catch (error: any) {
            toast.error(error.message || 'Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    const fetchSuggestions = async () => {
        const res = await fetch('/api/follow/suggestions');
        if (res.ok) {
            const data = await res.json();
            setSuggestions(data.suggestions || []);
        }
    };

    const fetchFollowing = async () => {
        const res = await fetch('/api/follow/following');
        if (res.ok) {
            const data = await res.json();
            setFollowing(data.following || []);
        }
    };

    const fetchFollowers = async () => {
        const res = await fetch('/api/follow/followers');
        if (res.ok) {
            const data = await res.json();
            setFollowers(data.followers || []);
        }
    };

    const fetchConnections = async () => {
        const res = await fetch('/api/follow/connections');
        if (res.ok) {
            const data = await res.json();
            setConnections(data.connections || []);
        }
    };

    const handleRefresh = async () => {
        setRefreshing(true);
        await fetchTabData(activeTab);
        setRefreshing(false);
        toast.success('Refreshed!');
    };

    const handleDismiss = (userId: string) => {
        setDismissedSuggestions(prev => new Set(prev).add(userId));
    };

    const filteredFollowing = following.filter(user => 
        user.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredFollowers = followers.filter(user => 
        user.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const visibleSuggestions = suggestions.filter(s => !dismissedSuggestions.has(s._id));

    if (status === "loading") {
        return (
            <div className="min-h-screen pt-24 pb-12 px-4 md:px-8 max-w-[1400px] mx-auto flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (status === "unauthenticated") {
        return (
            <div className="min-h-screen pt-24 pb-12 px-4 md:px-8 max-w-[1400px] mx-auto text-center">
                <h1 className="text-3xl font-syne font-bold text-white mb-4">Sign in to view your network</h1>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 md:px-8 max-w-[1400px] mx-auto font-sans relative">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4 relative z-10">
                <div>
                    <h1 className="text-4xl md:text-5xl font-syne font-extrabold tracking-tight mb-2 text-white">
                        Your Network
                    </h1>
                    <p className="text-t2 text-sm md:text-base max-w-xl">
                        Build your professional student network — follow peers, discover mentors, and stay connected.
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={handleRefresh}
                        disabled={refreshing}
                        className="flex items-center gap-2 text-sm font-semibold text-t1 hover:text-primary transition-colors group"
                    >
                        <RefreshCcw className={`w-4 h-4 ${refreshing ? "animate-spin text-primary" : "group-hover:rotate-180 transition-transform duration-500"}`} />
                        Refresh
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
                {[
                    { id: 'discover', label: 'Discover', icon: Sparkles },
                    { id: 'following', label: 'Following', icon: UserPlus },
                    { id: 'followers', label: 'Followers', icon: Heart },
                    { id: 'connections', label: 'Connections', icon: Users }
                ].map(tab => {
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as Tab)}
                            className={`
                                relative px-6 py-3 rounded-full font-syne font-bold transition-all whitespace-nowrap
                                flex items-center gap-2
                                ${activeTab === tab.id 
                                    ? 'bg-primary/10 text-primary border border-primary/30' 
                                    : 'glass-btn text-t1 hover:text-primary'
                                }
                            `}
                        >
                            <Icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* Content */}
            <AnimatePresence mode="wait">
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                ) : (
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                    >
                        {activeTab === 'discover' && (
                            <div>
                                <div className="mb-6">
                                    <h2 className="text-2xl font-syne font-bold text-white mb-2">People You Should Follow</h2>
                                    <p className="text-t2 text-sm font-mono">
                                        Based on your skills and interests
                                    </p>
                                </div>

                                {visibleSuggestions.length === 0 ? (
                                    <div className="text-center py-12 glass-card rounded-2xl">
                                        <Sparkles className="w-16 h-16 text-t2/50 mx-auto mb-4" />
                                        <h3 className="text-xl font-syne font-bold text-t1 mb-2">No Suggestions Available</h3>
                                        <p className="text-t2 font-mono text-sm">
                                            Check back later for personalized recommendations
                                        </p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {visibleSuggestions.map(suggestion => (
                                            <FollowSuggestionCard
                                                key={suggestion._id}
                                                user={suggestion}
                                                reason={suggestion.reason}
                                                onDismiss={handleDismiss}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'following' && (
                            <div>
                                <div className="mb-6 flex items-center justify-between">
                                    <div>
                                        <h2 className="text-2xl font-syne font-bold text-white mb-2">
                                            Following ({following.length})
                                        </h2>
                                        <p className="text-t2 text-sm font-mono">
                                            People you follow
                                        </p>
                                    </div>

                                    {following.length > 0 && (
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-t2" />
                                            <input
                                                type="text"
                                                placeholder="Search..."
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                className="pl-10 pr-4 py-2 rounded-full glass-btn font-mono text-sm border border-white/[0.06] focus:border-primary/30 transition-colors"
                                            />
                                        </div>
                                    )}
                                </div>

                                {following.length === 0 ? (
                                    <div className="text-center py-12 glass-card rounded-2xl">
                                        <UserPlus className="w-16 h-16 text-t2/50 mx-auto mb-4" />
                                        <h3 className="text-xl font-syne font-bold text-t1 mb-2">
                                            Not Following Anyone Yet
                                        </h3>
                                        <p className="text-t2 font-mono text-sm mb-4">
                                            Discover people to follow
                                        </p>
                                        <button
                                            onClick={() => setActiveTab('discover')}
                                            className="px-6 py-2 rounded-full bg-primary/10 border border-primary/30 text-primary font-syne font-bold hover:bg-primary/20 transition-all"
                                        >
                                            Discover People →
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {filteredFollowing.map(user => (
                                            <UserListItem key={user._id} user={user} showFollowBack={false} />
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'followers' && (
                            <div>
                                <div className="mb-6 flex items-center justify-between">
                                    <div>
                                        <h2 className="text-2xl font-syne font-bold text-white mb-2">
                                            Followers ({followers.length})
                                        </h2>
                                        <p className="text-t2 text-sm font-mono">
                                            People who follow you
                                        </p>
                                    </div>

                                    {followers.length > 0 && (
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-t2" />
                                            <input
                                                type="text"
                                                placeholder="Search..."
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                className="pl-10 pr-4 py-2 rounded-full glass-btn font-mono text-sm border border-white/[0.06] focus:border-primary/30 transition-colors"
                                            />
                                        </div>
                                    )}
                                </div>

                                {followers.length === 0 ? (
                                    <div className="text-center py-12 glass-card rounded-2xl">
                                        <Heart className="w-16 h-16 text-t2/50 mx-auto mb-4" />
                                        <h3 className="text-xl font-syne font-bold text-t1 mb-2">
                                            No Followers Yet
                                        </h3>
                                        <p className="text-t2 font-mono text-sm">
                                            Keep teaching and contributing to gain followers
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {filteredFollowers.map(user => (
                                            <UserListItem 
                                                key={user._id} 
                                                user={user} 
                                                showFollowBack={!user.isFollowingBack}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'connections' && (
                            <div>
                                <div className="mb-6">
                                    <h2 className="text-2xl font-syne font-bold text-white mb-2">
                                        Connections ({connections.length})
                                    </h2>
                                    <p className="text-t2 text-sm font-mono">
                                        Your mutual connections
                                    </p>
                                </div>

                                {connections.length === 0 ? (
                                    <div className="text-center py-12 glass-card rounded-2xl">
                                        <Users className="w-16 h-16 text-t2/50 mx-auto mb-4" />
                                        <h3 className="text-xl font-syne font-bold text-t1 mb-2">
                                            No Connections Yet
                                        </h3>
                                        <p className="text-t2 font-mono text-sm">
                                            Follow someone and they follow back to connect
                                        </p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {connections.map(user => (
                                            <ConnectionCard
                                                key={user._id}
                                                user={user}
                                                showInviteButton={false}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// Helper component for user list items
function UserListItem({ user, showFollowBack }: { user: any; showFollowBack: boolean }) {
    return (
        <div className="glass-card rounded-2xl p-4 flex items-center gap-4 hover:bg-white/[0.02] transition-all border border-white/[0.06]">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-black font-bold text-lg flex-shrink-0">
                {user.name.charAt(0).toUpperCase()}
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    <Link href={`/profile/${user._id}`} className="font-syne font-bold text-white hover:text-primary transition-colors">
                        {user.name}
                    </Link>
                    {user.isFollowingBack && (
                        <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary border border-primary/20 rounded-full font-mono">
                            Connected 🤝
                        </span>
                    )}
                </div>
                <p className="text-t2 text-sm font-mono">{user.college}</p>
                
                {user.skillsTeach && user.skillsTeach.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                        {user.skillsTeach.slice(0, 3).map((skill: string) => (
                            <SkillTag key={skill} skill={skill} variant="teach" />
                        ))}
                    </div>
                )}
            </div>

            <div className="flex gap-2 flex-shrink-0">
                <Link 
                    href={`/profile/${user._id}`}
                    className="px-4 py-2 rounded-full glass-btn text-sm font-syne font-semibold text-t1 hover:text-primary transition-all"
                >
                    View Profile
                </Link>
                <FollowButton 
                    userId={user._id}
                    initialIsFollowing={!showFollowBack}
                    initialIsConnected={user.isFollowingBack}
                    size="md"
                />
            </div>
        </div>
    );
}
