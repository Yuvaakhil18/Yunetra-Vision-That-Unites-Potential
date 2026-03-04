"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronUp, Bookmark, Link as LinkIcon, Filter, CheckCircle2, X } from "lucide-react";
import CountUp from "react-countup";
import toast from "react-hot-toast";

import { SkillTag } from "@/components/SkillTag";
import UploadResourceModal from "./UploadResourceModal";

// --- Helpers ---
const useDebounce = (val: string, delay: number) => {
    const [debouncedValue, setDebouncedValue] = useState(val);
    useEffect(() => {
        const handler = setTimeout(() => { setDebouncedValue(val); }, delay);
        return () => clearTimeout(handler);
    }, [val, delay]);
    return debouncedValue;
};

const SKILLS = ["React", "Figma", "DSA", "Node.js", "Python", "Machine Learning", "Canva", "UI Design"];
const TYPES = ["All Types", "Course", "Article", "Notes", "Internship", "Roadmap", "Tool"];
const SORTS = ["Popular", "Newest", "Top Rated"];

const TYPE_COLORS: Record<string, string> = {
    "course": "text-[#38bdf8] border-[#38bdf8]/30 bg-[#38bdf8]/10",
    "article": "text-t2 border-white/10 bg-white/5",
    "notes": "text-[#6366f1] border-[#6366f1]/30 bg-[#6366f1]/10",
    "roadmap": "text-[#0ea5e9] border-[#0ea5e9]/30 bg-[#0ea5e9]/10",
    "internship": "text-[#f59e0b] border-[#f59e0b]/30 bg-[#f59e0b]/10",
    "tool": "text-[#f43f5e] border-[#f43f5e]/30 bg-[#f43f5e]/10"
};

export default function ResourceHubClient() {
    const { data: session } = useSession();

    // Filters
    const [searchQuery, setSearchQuery] = useState("");
    const debouncedSearch = useDebounce(searchQuery, 300);
    const [activeTab, setActiveTab] = useState<"Browse" | "Saved">("Browse");
    const [activeSkill, setActiveSkill] = useState("All");
    const [activeType, setActiveType] = useState("All Types");
    const [activeSort, setActiveSort] = useState("Popular");
    const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);

    // Data
    const [resources, setResources] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Modals
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

    const fetchResources = async () => {
        setLoading(true);
        try {
            const queryParams = new URLSearchParams();
            if (activeSkill !== "All") queryParams.set("skill", activeSkill);
            if (activeType !== "All Types") queryParams.set("type", activeType);
            if (debouncedSearch) queryParams.set("search", debouncedSearch);

            let sortCode = "newest";
            if (activeSort === "Popular") sortCode = "popular";
            if (activeSort === "Top Rated") sortCode = "top";
            queryParams.set("sort", sortCode);

            const res = await fetch(`/api/resources?${queryParams.toString()}`);
            const data = await res.json();
            if (Array.isArray(data)) {
                setResources(data);
            } else {
                console.error("API error or unexpected response format:", data);
                setResources([]);
                if (data.error) toast.error(data.error);
            }
        } catch (err) {
            console.error(err);
            setResources([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchResources();
    }, [activeSkill, activeType, activeSort, debouncedSearch]);

    const handleUpvote = async (resourceId: string) => {
        if (!session) {
            toast.error("You must be logged in to upvote", { style: { background: "#111111", color: "#f1f5f9" } });
            return;
        }

        // Optimistic toggle
        setResources(prev => prev.map(r => {
            if (r._id === resourceId) {
                return { ...r, isUpvoted: !r.isUpvoted, upvoteCount: r.isUpvoted ? r.upvoteCount - 1 : r.upvoteCount + 1 };
            }
            return r;
        }));

        try {
            await fetch(`/api/resources/${resourceId}/upvote`, { method: "POST" });
        } catch (err) {
            fetchResources(); // revert on fail
        }
    };

    const handleSave = async (resourceId: string) => {
        if (!session) {
            toast.error("You must be logged in to save resources", { style: { background: "#111111", color: "#f1f5f9" } });
            return;
        }

        // Optimistic toggle
        setResources(prev => prev.map(r => {
            if (r._id === resourceId) {
                const saving = !r.isSaved;
                if (saving) toast.success("Saved to your collection!", { style: { background: "#111111", color: "#38bdf8", border: "1px solid rgba(56,189,248,0.2)" } });
                return { ...r, isSaved: saving, saveCount: saving ? r.saveCount + 1 : r.saveCount - 1 };
            }
            return r;
        }));

        try {
            await fetch(`/api/resources/${resourceId}/save`, { method: "POST" });
        } catch (err) {
            fetchResources(); // revert on fail
        }
    };

    const handleAddNewResource = (newRes: any) => {
        setResources(prev => [newRes, ...prev]);
        setActiveSkill("All");
        setActiveType("All Types");
        setSearchQuery("");
    };

    const displayedResources = activeTab === "Browse"
        ? (Array.isArray(resources) ? resources : [])
        : (Array.isArray(resources) ? resources.filter(r => r.isSaved) : []);

    return (
        <div className="min-h-screen bg-base pb-24 pt-24">

            {/* Header Area */}
            <div className="max-w-[1400px] mx-auto px-4 md:px-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-syne font-extrabold text-white mb-3">Resource Hub</h1>
                        <p className="text-t2 font-sans text-lg max-w-xl">
                            Free courses, notes, internships and roadmaps — shared by students, for students.
                        </p>
                        <div className="flex gap-6 mt-6 border-l-2 border-primary/30 pl-4">
                            <div className="text-white font-mono flex flex-col items-start gap-0.5">
                                <span className="text-2xl font-bold"><CountUp end={(Array.isArray(resources) ? resources.length : 0) > 50 ? resources.length : 15} duration={2} />+</span>
                                <span className="text-xs text-t2 uppercase tracking-widest">Resources</span>
                            </div>
                            <div className="text-white font-mono flex flex-col items-start gap-0.5">
                                <span className="text-2xl font-bold"><CountUp end={850} duration={2} separator="," />+</span>
                                <span className="text-xs text-t2 uppercase tracking-widest">Total Saves</span>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={() => {
                            if (!session) return toast.error("Please login to share a resource");
                            setIsUploadModalOpen(true);
                        }}
                        className="self-start md:self-auto px-6 py-3 rounded-xl bg-primary text-base font-sans font-bold hover:shadow-[0_0_20px_rgba(56,189,248,0.4)] transition-all  border border-transparent flex items-center gap-2"
                    >
                        Share a Resource
                    </button>
                </div>

                {/* Main Content Area - Grid */}
                <div className="flex flex-col xl:flex-row gap-8 items-start">

                    {/* Left: Interactive Filters + Masonry Board */}
                    <div className="flex-1 w-full">

                        {/* Sticky Search & Filter Bar */}
                        <div className="sticky top-20 z-40 bg-base/90 backdrop-blur-xl border-y border-[rgba(255,255,255,0.06)] py-4 mb-8 -mx-4 px-4 md:mx-0 md:px-0 md:border-x md:rounded-2xl shadow-xl">

                            {/* Top Filter Row */}
                            <div className="flex flex-col md:flex-row gap-4 px-4">

                                {/* Search */}
                                <div className="relative flex-1 md:max-w-[40%]">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-t2" />
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Search resources, skills, topics..."
                                        className="w-full bg-subtle border border-[rgba(255,255,255,0.06)] rounded-xl pl-11 pr-10 py-2.5 text-sm text-white placeholder-t2 focus:outline-none focus:border-primary/50 transition-colors font-sans"
                                    />
                                    {searchQuery && (
                                        <button onClick={() => setSearchQuery("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-t2 hover:text-white ">
                                            <X className="w-3.5 h-3.5" />
                                        </button>
                                    )}
                                </div>

                                {/* Type Dropdown */}
                                <div className="relative">
                                    <button
                                        onClick={() => setIsTypeDropdownOpen(!isTypeDropdownOpen)}
                                        className="w-full md:w-auto px-4 py-2.5 bg-subtle border border-[rgba(255,255,255,0.06)] rounded-xl text-sm font-mono text-white flex items-center justify-between gap-3 hover:bg-card transition-colors "
                                    >
                                        <span className="flex items-center gap-2"><Filter className="w-4 h-4 text-primary" /> {activeType}</span>
                                    </button>
                                    {isTypeDropdownOpen && (
                                        <div className="absolute top-full left-0 mt-2 w-48 bg-subtle border border-[rgba(255,255,255,0.06)] rounded-xl shadow-2xl py-2 z-50">
                                            {TYPES.map(t => (
                                                <button
                                                    key={t}
                                                    onClick={() => { setActiveType(t); setIsTypeDropdownOpen(false); }}
                                                    className={`w-full text-left px-4 py-2 text-sm font-mono hover:bg-card transition-colors  ${activeType === t ? "text-primary bg-primary/5 font-bold" : "text-t1"}`}
                                                >
                                                    {t}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Sort Toggle Row */}
                                <div className="flex bg-subtle border border-[rgba(255,255,255,0.06)] p-1 rounded-xl ml-auto self-start">
                                    {SORTS.map(s => (
                                        <button
                                            key={s}
                                            onClick={() => setActiveSort(s)}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all  ${activeSort === s ? "bg-base text-primary shadow-[0_0_10px_rgba(56,189,248,0.1)]" : "text-t2 hover:text-white"}`}
                                        >
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Bottom Skill Pills (Scrollable) */}
                            <div className="w-full overflow-x-auto custom-scrollbar mt-4 px-4 pb-2">
                                <div className="flex gap-2 w-max">
                                    {["All", ...SKILLS].map(s => (
                                        <button
                                            key={s}
                                            onClick={() => setActiveSkill(s)}
                                            className={`px-4 py-1.5 rounded-full border text-xs font-mono font-bold whitespace-nowrap transition-all  ${activeSkill === s ? "bg-primary text-base border-primary" : "bg-transparent border-[rgba(255,255,255,0.06)] text-t2 hover:border-white/20"}`}
                                        >
                                            {s}
                                        </button>
                                    ))}
                                    <div className="flex gap-4 border-l border-[rgba(255,255,255,0.06)] pl-4">
                                        <button onClick={() => setActiveTab("Browse")} className={`text-xs font-mono transition-colors  ${activeTab === "Browse" ? "text-white font-bold" : "text-t2"}`}>Browse All</button>
                                        <button onClick={() => setActiveTab("Saved")} className={`text-xs font-mono transition-colors  ${activeTab === "Saved" ? "text-primary font-bold" : "text-t2"}`}>My Saved Lists ({(Array.isArray(resources) ? resources.filter(r => r.isSaved) : []).length})</button>
                                    </div>
                                </div>
                            </div>

                        </div>

                        {/* Status Message */}
                        <div className="mb-6 text-sm font-mono text-t2">
                            {loading ? "Discovering resources..." : `Showing ${displayedResources.length} resources`}
                        </div>

                        {/* MASONRY GRID (CSS Columns implementation) */}
                        <div className="columns-1 md:columns-2 xl:columns-3 gap-6 space-y-6">

                            {!loading && displayedResources.length === 0 && (
                                <div className="col-span-full py-16 text-center break-inside-avoid">
                                    <div className="w-20 h-20 bg-card rounded-full flex items-center justify-center mx-auto mb-4 border border-[rgba(255,255,255,0.06)]">
                                        <Search className="w-8 h-8 text-t2" />
                                    </div>
                                    <h3 className="text-xl font-syne font-bold text-white mb-2">No resources found</h3>
                                    <p className="text-t2 font-sans text-sm mb-6 max-w-sm mx-auto">Try adjusting your filters or be the first to share a valuable link for this skill category.</p>
                                    <button onClick={() => setIsUploadModalOpen(true)} className="px-6 py-2 rounded-xl bg-subtle border border-[rgba(255,255,255,0.06)] text-white text-sm hover:border-primary/50 hover:text-primary  transition-colors">
                                        Clear filters
                                    </button>
                                </div>
                            )}

                            {loading ? (
                                // Skeletons
                                [...Array(6)].map((_, i) => (
                                    <div key={i} className={`bg-subtle rounded-3xl p-6 border border-[rgba(255,255,255,0.06)] break-inside-avoid transform-gpu h-[${200 + (Math.random() * 100)}px]`}>
                                        <div className="animate-pulse space-y-4">
                                            <div className="flex justify-between"><div className="w-16 h-6 bg-card rounded-full" /><div className="w-20 h-6 bg-card rounded-full" /></div>
                                            <div className="w-3/4 h-6 bg-card rounded" />
                                            <div className="w-full h-12 bg-card rounded" />
                                            <div className="w-full h-10 bg-card rounded mt-4" />
                                        </div>
                                    </div>
                                ))
                            ) : (
                                displayedResources.map((res, index) => {
                                    const domain = res.url ? res.url.replace(/^https?:\/\//, '').split('/')[0].replace('www.', '') : "resource";

                                    return (
                                        <motion.div
                                            key={res._id}
                                            initial={{ opacity: 0, y: 30, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            transition={{ delay: index * 0.06, type: "spring", stiffness: 100, damping: 20 }}
                                            className="group break-inside-avoid bg-subtle rounded-[24px] p-6 border border-[rgba(255,255,255,0.06)] hover:border-white/10 hover:shadow-2xl transition-all relative overflow-hidden flex flex-col transform-gpu hover:-translate-y-1"
                                        >
                                            {/* Hover Glow Background behind card */}
                                            <div className={`absolute -inset-1 opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500 bg-gradient-to-br from-white to-transparent`} />

                                            {/* Top Row: Type & Skill */}
                                            <div className="flex justify-between items-start mb-4 relative z-10">
                                                <div className="flex items-center gap-2">
                                                    <span className={`px-2 py-1 rounded text-[10px] font-mono font-bold uppercase tracking-wider border ${TYPE_COLORS[res.type] || TYPE_COLORS.article}`}>
                                                        {res.type}
                                                    </span>
                                                    {res.verified && (
                                                        <span className="hidden md:flex items-center gap-1 text-[10px] font-mono text-primary bg-primary/10 px-2 py-1 rounded">
                                                            <CheckCircle2 className="w-3 h-3" /> Verified
                                                        </span>
                                                    )}
                                                </div>
                                                <SkillTag skill={res.skill} variant="teach" /> {/* Recycled green style */}
                                            </div>

                                            {/* Title */}
                                            <h3 className="text-lg font-syne font-bold text-white mb-2 leading-snug group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-white/60 transition-colors">
                                                {res.title}
                                            </h3>

                                            {/* Description */}
                                            {res.description && (
                                                <p className="text-sm font-sans text-t2 leading-relaxed line-clamp-3 mb-4">
                                                    {res.description}
                                                </p>
                                            )}

                                            {/* Uploader Meta */}
                                            <div className="flex items-center justify-between mb-5 mt-auto pt-2">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded-full bg-card flex items-center justify-center text-[10px] font-bold text-white border border-white/5">
                                                        {res.uploadedBy?.name?.[0] || 'U'}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-[10px] font-mono text-white leading-none">{res.uploadedBy?.name || 'Unknown User'}</span>
                                                        <span className="text-[9px] font-mono text-t2 leading-none mt-1">{res.uploadedBy?.college || 'Unknown College'}</span>
                                                    </div>
                                                </div>
                                                <span className="text-[10px] font-mono text-t2/60 bg-card px-2 py-0.5 rounded">
                                                    {/* Consistent date formatting to avoid hydration errors */}
                                                    {(() => {
                                                        const date = new Date(res.createdAt);
                                                        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                                                        return `${months[date.getMonth()]} ${date.getDate()}`;
                                                    })()}
                                                </span>
                                            </div>

                                            {/* Actions Bottom Bar */}
                                            <div className="flex items-center justify-between border-t border-[rgba(255,255,255,0.06)] pt-4 relative z-10 bg-subtle">
                                                <button
                                                    onClick={() => handleUpvote(res._id)}
                                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-mono font-bold transition-all  ${res.isUpvoted ? "bg-accent/20 text-accent" : "text-t2 hover:bg-card hover:text-white"}`}
                                                >
                                                    <ChevronUp className={`w-4 h-4 ${res.isUpvoted ? "fill-accent stroke-accent stroke-[3px]" : ""}`} />
                                                    <CountUp end={res.upvoteCount} preserveValue duration={0.8} />
                                                </button>

                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleSave(res._id)}
                                                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-mono transition-all  border ${res.isSaved ? "bg-primary/10 text-primary border-primary/30" : "text-t2 border-transparent hover:border-[rgba(255,255,255,0.06)] hover:bg-card"}`}
                                                    >
                                                        <Bookmark className={`w-4 h-4 ${res.isSaved ? "fill-primary border-0" : ""}`} />
                                                        <span className="font-bold hidden sm:inline">{res.isSaved ? "Saved" : "Save"}</span>
                                                    </button>
                                                    <a
                                                        href={res.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center justify-center p-2 rounded-lg bg-card text-t1 hover:bg-white hover:text-base transition-colors  border border-[rgba(255,255,255,0.06)]"
                                                        title={`Open ${domain}`}
                                                    >
                                                        <LinkIcon className="w-4 h-4" />
                                                    </a>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )
                                })
                            )}
                        </div>

                    </div>

                    {/* Right: Top Contributors Sidebar */}
                    <div className="hidden xl:flex flex-col w-[320px] gap-6 shrink-0 sticky top-24">

                        {/* Weekly Leaders */}
                        <div className="p-6 rounded-[24px] bg-gradient-to-br from-subtle to-card border border-[rgba(255,255,255,0.06)] shadow-xl">
                            <h3 className="text-lg font-syne font-bold text-white mb-6">Top Curators Weekly</h3>
                            <div className="space-y-4">
                                {[
                                    { rank: 1, name: "Sakshi Verma", count: 24, col: "text-warning" },
                                    { rank: 2, name: "Rahul Singh", count: 18, col: "text-t2" },
                                    { rank: 3, name: "Aman Gupta", count: 12, col: "text-warning" }
                                ].map(u => (
                                    <div key={u.rank} className="flex items-center gap-3">
                                        <div className={`text-base font-syne font-bold ${u.col}`}>#{u.rank}</div>
                                        <div className="w-8 h-8 rounded-full bg-subtle border border-white/5 flex items-center justify-center text-xs font-bold text-t2">{u.name[0]}</div>
                                        <div className="flex-1">
                                            <div className="text-sm font-bold text-white font-sans leading-none mb-1">{u.name}</div>
                                            <div className="text-[10px] font-mono text-t2">Shared {u.count} resources</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Trending Skills Bar Chart */}
                        <div className="p-6 rounded-[24px] bg-subtle relative overflow-hidden border border-[rgba(255,255,255,0.06)]">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-[40px] rounded-full" />
                            <h3 className="text-lg font-syne font-bold text-white mb-6 relative">Trending Now</h3>
                            <div className="space-y-3 relative">
                                {[
                                    { skill: "React", pct: "90%" },
                                    { skill: "DSA", pct: "75%" },
                                    { skill: "Node.js", pct: "60%" },
                                    { skill: "Figma", pct: "40%" },
                                ].map(s => (
                                    <div key={s.skill} className="flex items-center gap-3">
                                        <span className="text-xs font-mono font-bold text-t2 w-16 text-right shrink-0">{s.skill}</span>
                                        <div className="flex-1 h-2 rounded-full bg-card relative overflow-hidden shadow-inner">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: s.pct }}
                                                transition={{ duration: 1.5, delay: 0.5 }}
                                                className="absolute top-0 left-0 h-full bg-primary shadow-[0_0_8px_#38bdf8]"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            <AnimatePresence>
                {isUploadModalOpen && (
                    <UploadResourceModal
                        onClose={() => setIsUploadModalOpen(false)}
                        onSuccess={handleAddNewResource}
                    />
                )}
            </AnimatePresence>

        </div>
    );
}
