"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import { Search, Filter, Trophy, Calendar, Users, Sparkles, Loader2, Target, Award } from "lucide-react";
import { ARENA_CATEGORIES } from "@/constants/arenaConstants";
import Link from "next/link";
import ChallengeCard from "./ChallengeCard";
import SubmissionModal from "./SubmissionModal";

type Challenge = any; // Will be properly typed with the model

export default function ArenaPage() {
    const { data: session } = useSession();
    const [challenges, setChallenges] = useState<Challenge[]>([]);
    const [filteredChallenges, setFilteredChallenges] = useState<Challenge[]>([]);
    const [loading, setLoading] =useState(true);
    const [activeCategory, setActiveCategory] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
    const [showSubmissionModal, setShowSubmissionModal] = useState(false);

    useEffect(() => {
        fetchChallenges();
    }, []);

    useEffect(() => {
        filterChallenges();
    }, [challenges, activeCategory, searchQuery]);

    const fetchChallenges = async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/arena');
            const data = await res.json();
            if (data.success) {
                setChallenges(data.challenges);
            }
        } catch (error) {
            console.error('Failed to fetch challenges:', error);
        } finally {
            setLoading(false);
        }
    };

    const filterChallenges = () => {
        let filtered = challenges;

        // Category filter
        if (activeCategory !== 'all') {
            filtered = filtered.filter(c => c.category === activeCategory);
        }

        // Search filter
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(c =>
                c.title.toLowerCase().includes(query) ||
                c.organization.toLowerCase().includes(query) ||
                c.description.toLowerCase().includes(query) ||
                c.skillsRequired.some((skill: string) => skill.toLowerCase().includes(query))
            );
        }

        setFilteredChallenges(filtered);
    };

    const handleSubmit = (challenge: Challenge) => {
        setSelectedChallenge(challenge);
        setShowSubmissionModal(true);
    };

    const categories = [
        { id: 'all', label: 'All', icon: '🎯', color: '#ffffff' },
        ...Object.values(ARENA_CATEGORIES)
    ];

    const stats = [
        { label: 'Active Challenges', value: challenges.filter(c => !c.isExpired).length, icon: Trophy, color: 'text-warning' },
        { label: 'Total Prize Pool', value: `₹${challenges.reduce((sum, c) => sum + (c.prizeAmount || 0), 0).toLocaleString()}`, icon: Award, color: 'text-primary' },
        { label: 'Internships', value: challenges.filter(c => c.prizeType === 'internship' || c.prizeType === 'both').length, icon: Target, color: 'text-accent' }
    ];

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 md:px-8 max-w-[1400px] mx-auto font-sans relative">
            {/* Header */}
            <div className="mb-12">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center">
                        <Sparkles className="w-7 h-7 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-4xl md:text-5xl font-syne font-extrabold tracking-tight text-white">
                            Arena
                        </h1>
                        <p className="text-t2 text-base md:text-lg">
                            Real challenges. Real prizes. Real opportunities.
                        </p>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
                    {stats.map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="glass-card rounded-2xl p-5 flex items-center gap-4"
                        >
                            <div className={`w-12 h-12 rounded-xl bg-card flex items-center justify-center ${stat.color}`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                            <div>
                                <div className="text-2xl font-syne font-bold text-white">{stat.value}</div>
                                <div className="text-t2 text-sm font-mono">{stat.label}</div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Search and Filters */}
            <div className="mb-8">
                {/* Search Bar */}
                <div className="relative mb-6">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-t2" />
                    <input
                        type="text"
                        placeholder="Search challenges by title, organization, or skill..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-card border border-white/[0.06] rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-t2 focus:outline-none focus:border-primary/50 transition-all font-sans"
                    />
                </div>

                {/* Category Tabs */}
                <div className="overflow-x-auto scrollbar-hide">
                    <div className="flex gap-3 pb-2">
                        {categories.map((category) => (
                            <button
                                key={category.id}
                                onClick={() => setActiveCategory(category.id)}
                                className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-syne font-bold text-sm whitespace-nowrap transition-all ${
                                    activeCategory === category.id
                                        ? 'shadow-lg'
                                        : 'bg-card border border-white/[0.06] text-t1 hover:border-white/[0.12] hover:text-white'
                                }`}
                                style={{
                                    backgroundColor: activeCategory === category.id ? category.color : undefined,
                                    color: activeCategory === category.id ? '#000' : undefined
                                }}
                            >
                                <span>{category.icon}</span>
                                <span>{category.label}</span>
                                {activeCategory === category.id && (
                                    <span className="bg-black/20 px-2 py-0.5 rounded-full text-xs font-mono">
                                        {activeCategory === 'all' ? challenges.length : filteredChallenges.length}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Challenges Grid */}
            {loading ? (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 w-full">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="w-full h-[320px] glass-card rounded-[28px] p-6 relative overflow-hidden">
                            <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent z-10" />
                            <div className="flex justify-between items-start mb-6">
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-full bg-card" />
                                    <div className="space-y-2">
                                        <div className="w-32 h-5 bg-card rounded" />
                                        <div className="w-24 h-3 bg-card rounded" />
                                    </div>
                                </div>
                                <div className="w-12 h-12 rounded-xl bg-card" />
                            </div>
                            <div className="space-y-4">
                                <div className="w-full h-4 bg-card rounded" />
                                <div className="w-3/4 h-4 bg-card rounded" />
                                <div className="flex gap-2 mt-4">
                                    <div className="w-16 h-6 bg-card rounded-full" />
                                    <div className="w-20 h-6 bg-card rounded-full" />
                                    <div className="w-14 h-6 bg-card rounded-full" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : filteredChallenges.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-20"
                >
                    <div className="w-20 h-20 rounded-full bg-card border border-white/[0.06] flex items-center justify-center mx-auto mb-6">
                        <Search className="w-10 h-10 text-t2" />
                    </div>
                    <h3 className="text-2xl font-syne font-bold text-t1 mb-2">No challenges found</h3>
                    <p className="text-t2 mb-6">Try adjusting your filters or search query</p>
                    <button
                        onClick={() => {
                            setActiveCategory('all');
                            setSearchQuery('');
                        }}
                        className="px-6 py-2 bg-primary/10 border border-primary/30 rounded-xl text-primary font-syne font-bold hover:bg-primary/20 transition-colors"
                    >
                        Clear Filters
                    </button>
                </motion.div>
            ) : (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 w-full">
                    {filteredChallenges.map((challenge, index) => (
                        <ChallengeCard
                            key={challenge._id}
                            challenge={challenge}
                            index={index}
                            onSubmit={handleSubmit}
                        />
                    ))}
                </div>
            )}

            {/* Submission Modal */}
            <AnimatePresence>
                {showSubmissionModal && selectedChallenge && (
                    <SubmissionModal
                        challenge={selectedChallenge}
                        onClose={() => {
                            setShowSubmissionModal(false);
                            setSelectedChallenge(null);
                        }}
                        onSuccess={() => {
                            fetchChallenges();
                            setShowSubmissionModal(false);
                            setSelectedChallenge(null);
                        }}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
