"use client";

import { useState, useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, RefreshCcw, Filter, X } from "lucide-react";
import MatchFilterSidebar from "./MatchFilterSidebar";
import MatchGrid from "./MatchGrid";
import RequestSessionModal from "./RequestSessionModal";
import ProfileDrawer from "./ProfileDrawer";
import EmptyMatchState from "./EmptyMatchState";

export default function MatchFeedPage() {
    const { data: session, status } = useSession();
    const [matches, setMatches] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

    // Filter States
    const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
    const [minScore, setMinScore] = useState(60);
    const [sortBy, setSortBy] = useState<"best" | "rating" | "experienced">("best");
    const [sameCollegeOnly, setSameCollegeOnly] = useState(false);

    // Modals and Drawers
    const [selectedMatchForSession, setSelectedMatchForSession] = useState<any>(null);
    const [selectedMatchForProfile, setSelectedMatchForProfile] = useState<any>(null);

    const fetchMatches = async () => {
        try {
            setRefreshing(true);
            const res = await fetch("/api/match");
            if (res.ok) {
                const data = await res.json();
                setMatches(data.matches || []);
            }
        } catch (error) {
            console.error("Failed to fetch matches", error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        if (status === "authenticated") {
            fetchMatches();
        }
    }, [status]);

    // Derive unique teachable skills from all matches for the filter sidebar
    const allTeachableSkills = useMemo(() => {
        const skills = new Set<string>();
        matches.forEach(m => {
            if (m.skillsTeach && Array.isArray(m.skillsTeach)) {
                m.skillsTeach.forEach((s: string) => skills.add(s));
            }
        });
        return Array.from(skills).sort();
    }, [matches]);

    // Filter logic
    const filteredAndSortedMatches = useMemo(() => {
        let result = [...matches];

        // Filter by Min Score
        result = result.filter(m => m.compatibilityScore >= minScore);

        // Filter by Skills Taught
        if (selectedSkills && selectedSkills.length > 0) {
            result = result.filter(m =>
                m.skillsTeach && Array.isArray(m.skillsTeach) &&
                selectedSkills.some(skill => m.skillsTeach.includes(skill))
            );
        }

        // Filter by College (assuming user's college is in the session)
        if (sameCollegeOnly && session?.user && (session.user as any).college) {
            result = result.filter(m => m.college === (session.user as any).college);
        }

        // Sort
        result.sort((a, b) => {
            if (sortBy === "best") return b.compatibilityScore - a.compatibilityScore;
            if (sortBy === "rating") return (b.rating || 0) - (a.rating || 0);
            if (sortBy === "experienced") return (b.totalSessions || 0) - (a.totalSessions || 0);
            return 0;
        });

        return result;
    }, [matches, minScore, selectedSkills, sameCollegeOnly, sortBy, session]);

    if (status === "loading") {
        return (
            <div className="min-h-screen pt-24 pb-12 px-4 md:px-8 max-w-7xl mx-auto flex items-center justify-center text-primary">
                <Loader2 className="w-8 h-8 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 md:px-8 max-w-[1400px] mx-auto font-sans relative">

            {/* HEADER SECTION */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4 relative z-10 block">
                <div>
                    <h1 className="text-4xl md:text-5xl font-syne font-extrabold tracking-tight mb-2 text-white">Your Matches</h1>
                    <p className="text-t2 text-sm md:text-base max-w-xl">
                        Ranked by compatibility — people who need what you teach and teach what you need.
                    </p>
                </div>

                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full glass-pill">
                        {/* Removed green dot */}
                        <span className="font-mono text-xs font-bold text-t1 uppercase tracking-widest">
                            {loading ? "Loading..." : `${filteredAndSortedMatches.length} Matches Found`}
                        </span>
                    </div>

                    <button
                        onClick={fetchMatches}
                        disabled={refreshing}
                        className="flex items-center gap-2 text-sm font-semibold text-t1 hover:text-primary transition-colors  group"
                    >
                        <RefreshCcw className={`w-4 h-4 ${refreshing ? "animate-spin text-primary" : "group-hover:rotate-180 transition-transform duration-500"}`} />
                        Refresh
                    </button>

                    {/* Mobile Filter Toggle */}
                    <button
                        className="md:hidden p-2 rounded-xl glass-btn text-t1 hover:text-primary"
                        onClick={() => setMobileFilterOpen(true)}
                    >
                        <Filter className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* TWO COLUMN LAYOUT */}
            <div className="flex flex-col md:flex-row gap-8 relative">

                {/* LEFT COMPONENT - Filters (Desktop) */}
                <div className="hidden md:block w-[340px] flex-shrink-0">
                    <MatchFilterSidebar
                        allSkills={allTeachableSkills}
                        selectedSkills={selectedSkills}
                        setSelectedSkills={setSelectedSkills}
                        minScore={minScore}
                        setMinScore={setMinScore}
                        sortBy={sortBy}
                        setSortBy={setSortBy}
                        sameCollegeOnly={sameCollegeOnly}
                        setSameCollegeOnly={setSameCollegeOnly}
                        totalMatches={filteredAndSortedMatches.length}
                        matches={filteredAndSortedMatches}
                    />
                </div>

                {/* RIGHT COMPONENT - Grid */}
                <div className="flex-1 min-w-0">
                    {loading ? (
                        <MatchGrid loading={true} />
                    ) : filteredAndSortedMatches.length === 0 ? (
                        <EmptyMatchState
                            clearFilters={() => {
                                setMinScore(0);
                                setSelectedSkills([]);
                                setSameCollegeOnly(false);
                            }}
                        />
                    ) : (
                        <MatchGrid
                            matches={filteredAndSortedMatches}
                            loading={false}
                            onRequestSession={setSelectedMatchForSession}
                            onViewProfile={setSelectedMatchForProfile}
                        />
                    )}
                </div>
            </div>

            {/* MOBILE FILTER MODAL */}
            <AnimatePresence>
                {mobileFilterOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: "100%" }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed inset-0 z-50 glass-overlay p-4 overflow-y-auto md:hidden pt-20"
                    >
                        <button
                            className="absolute top-6 right-6 p-2 glass-btn rounded-full"
                            onClick={() => setMobileFilterOpen(false)}
                        >
                            <X className="w-5 h-5" />
                        </button>
                        <MatchFilterSidebar
                            allSkills={allTeachableSkills}
                            selectedSkills={selectedSkills}
                            setSelectedSkills={setSelectedSkills}
                            minScore={minScore}
                            setMinScore={setMinScore}
                            sortBy={sortBy}
                            setSortBy={setSortBy}
                            sameCollegeOnly={sameCollegeOnly}
                            setSameCollegeOnly={setSameCollegeOnly}
                            totalMatches={filteredAndSortedMatches.length}
                            matches={filteredAndSortedMatches}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* MODALS AND DRAWERS */}
            <AnimatePresence>
                {selectedMatchForSession && (
                    <RequestSessionModal
                        match={selectedMatchForSession}
                        onClose={() => setSelectedMatchForSession(null)}
                    />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {selectedMatchForProfile && (
                    <ProfileDrawer
                        match={selectedMatchForProfile}
                        onClose={() => setSelectedMatchForProfile(null)}
                        onRequestSession={() => {
                            setSelectedMatchForProfile(null);
                            setTimeout(() => setSelectedMatchForSession(selectedMatchForProfile), 300);
                        }}
                    />
                )}
            </AnimatePresence>

        </div>
    );
}
