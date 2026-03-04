"use client";

import { motion } from "framer-motion";
import { SlidersHorizontal, ChevronDown, Check } from "lucide-react";

interface MatchFilterSidebarProps {
    allSkills: string[];
    selectedSkills: string[];
    setSelectedSkills: (skills: string[]) => void;
    minScore: number;
    setMinScore: (score: number) => void;
    sortBy: "best" | "rating" | "experienced";
    setSortBy: (sort: "best" | "rating" | "experienced") => void;
    sameCollegeOnly: boolean;
    setSameCollegeOnly: (val: boolean) => void;
    totalMatches: number;
    matches: any[];
}

export default function MatchFilterSidebar({
    allSkills,
    selectedSkills,
    setSelectedSkills,
    minScore,
    setMinScore,
    sortBy,
    setSortBy,
    sameCollegeOnly,
    setSameCollegeOnly,
    totalMatches,
    matches
}: MatchFilterSidebarProps) {

    const toggleSkill = (skill: string) => {
        const currentSkills = selectedSkills || [];
        if (currentSkills.includes(skill)) {
            setSelectedSkills(currentSkills.filter(s => s !== skill));
        } else {
            setSelectedSkills([...currentSkills, skill]);
        }
    };

    const clearFilters = () => {
        setSelectedSkills([]);
        setMinScore(60);
        setSameCollegeOnly(false);
        setSortBy("best");
    };

    const hasActiveFilters = (selectedSkills || []).length > 0 || minScore > 0 || sameCollegeOnly || sortBy !== "best";

    return (
        <div className="md:sticky md:top-24 w-full glass-elevated glass-shine rounded-[28px] p-6 z-20">

            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2 text-white">
                    <SlidersHorizontal className="w-5 h-5 text-primary" />
                    <h2 className="font-syne font-bold text-lg">Filters</h2>
                </div>
                {hasActiveFilters && (
                    <button
                        onClick={clearFilters}
                        className="text-xs font-mono text-t2 hover:text-danger transition-colors uppercase tracking-wider "
                    >
                        Clear All
                    </button>
                )}
            </div>

            {/* 1. Skill Filters */}
            <div className="mb-8">
                <h3 className="text-sm font-sans font-semibold text-t2 mb-3 uppercase tracking-wide">Filter by Skill Taught</h3>
                <div className="flex flex-wrap gap-2">
                    {allSkills.length === 0 ? (
                        <p className="text-xs text-t2/50 italic">No skills available to filter</p>
                    ) : (
                        allSkills.map(skill => {
                            const isSelected = (selectedSkills || []).includes(skill);
                            return (
                                <button
                                    key={skill}
                                    onClick={() => toggleSkill(skill)}
                                    className={`px-3 py-1.5 rounded-full text-xs font-mono font-bold transition-all  border ${isSelected
                                        ? "bg-primary/15 backdrop-blur-md border-primary/40 text-primary shadow-[inset_0_0.5px_0_0_rgba(56,189,248,0.3),0_0_15px_rgba(56,189,248,0.2)]"
                                        : "glass-pill text-t2 hover:border-white/10 hover:text-white"
                                        }`}
                                >
                                    {skill}
                                </button>
                            );
                        })
                    )}
                </div>
            </div>

            {/* 2. Min Match Score Slider */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-sans font-semibold text-t2 uppercase tracking-wide">Minimum Match %</h3>
                    <span className="font-mono text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
                        Above {minScore}%
                    </span>
                </div>
                <div className="relative h-6 flex items-center group ">
                    {/* Custom Slider Track Base */}
                    <div className="absolute w-full h-2 glass-subtle rounded-full overflow-hidden">
                        {/* Filled Track */}
                        <div
                            className="h-full bg-gradient-to-r from-accent to-primary transition-all duration-75"
                            style={{ width: `${minScore}%` }}
                        />
                    </div>
                    {/* Custom Slider Thumb Handler */}
                    <input
                        type="range"
                        min="0"
                        max="100"
                        step="5"
                        value={minScore}
                        onChange={(e) => setMinScore(Number(e.target.value))}
                        className="absolute w-full h-full opacity-0  z-20"
                    />
                    {/* Visual Custom Thumb */}
                    <div
                        className="absolute w-5 h-5 bg-white rounded-full shadow-[0_0_15px_rgba(56,189,248,0.6)] border-2 border-primary pointer-events-none z-10 transition-transform group-hover:scale-125"
                        style={{ left: `calc(${minScore}% - 10px)` }}
                    />
                </div>
            </div>

            {/* 3. Sort By */}
            <div className="mb-8">
                <h3 className="text-sm font-sans font-semibold text-t2 mb-3 uppercase tracking-wide">Sort By</h3>
                <div className="flex flex-col gap-2">
                    {[
                        { id: "best", label: "Best Match %" },
                        { id: "rating", label: "Highest Rated" },
                        { id: "experienced", label: "Most Experienced" }
                    ].map(option => (
                        <button
                            key={option.id}
                            onClick={() => setSortBy(option.id as any)}
                            className={`w-full flex items-center justify-between px-4 py-2 rounded-xl text-sm font-sans font-semibold transition-all  border ${sortBy === option.id
                                ? "bg-primary/10 backdrop-blur-md border-primary/30 text-white shadow-[inset_0_0.5px_0_0_rgba(56,189,248,0.2),inset_0_0_10px_rgba(56,189,248,0.05)]"
                                : "glass-pill text-t2 hover:bg-white/[0.04]"
                                }`}
                        >
                            {option.label}
                            {sortBy === option.id && <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_5px_#38bdf8]" />}
                        </button>
                    ))}
                </div>
            </div>

            {/* 4. Same College Toggle */}
            <div className="mb-8 pt-6 border-t border-white/[0.04] flex items-center justify-between cursor-none group" onClick={() => setSameCollegeOnly(!sameCollegeOnly)}>
                <div>
                    <h3 className="text-sm font-sans font-semibold text-t1 group-hover:text-white transition-colors">Same College Only</h3>
                    <p className="text-xs text-t2 font-sans mt-1">Connect with students nearby</p>
                </div>
                <div className={`relative w-12 h-6 rounded-full transition-colors border ${sameCollegeOnly ? 'bg-primary/15 backdrop-blur-md border-primary/30' : 'glass-pill'}`}>
                    <motion.div
                        className={`absolute top-[2px] w-4 h-4 rounded-full transition-colors ${sameCollegeOnly ? 'bg-primary shadow-[0_0_8px_#38bdf8]' : 'bg-t2'}`}
                        animate={{ x: sameCollegeOnly ? 26 : 2 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                </div>
            </div>

            {/* Stats Bottom */}
            <div className="p-4 glass-subtle rounded-xl">
                <div className="flex justify-between items-end mb-2">
                    <span className="text-xs font-mono text-t2 uppercase">Showing Results</span>
                    <span className="text-xl font-syne font-bold text-white">{totalMatches}</span>
                </div>
            </div>

        </div>
    );
}
