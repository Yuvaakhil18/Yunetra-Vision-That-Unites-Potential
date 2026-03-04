"use client";

import { useState, useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, BookOpen, Coins, CheckCircle, Edit3, Grid, Lock, CheckCircle2, Maximize2, Share2, Loader2, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";
import CountUp from "react-countup";
import Link from "next/link";

// Components
import { SkillTag } from "@/components/SkillTag";
import { FollowButton } from "@/components/FollowButton";
import RequestSessionModal from "../match/RequestSessionModal";
import EditProfileDrawer from "./EditProfileDrawer";
import { GradientButton } from "@/components/ui/gradient-button";

// Types
interface ProfileClientProps {
    userId?: string; // If undefined, it's the "me" route
}

// Deterministic Color Generator from Avatar Gradient Pool
const AVATAR_COLORS = ['#38bdf8', '#6366f1', '#00d4aa', '#f59e0b', '#f43f5e', '#a78bfa'];
function stringToColor(str: string) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

export default function ProfileClient({ userId }: ProfileClientProps) {
    const { data: session, status } = useSession();
    const currentUserId = session?.user && (session.user as any).id;

    const isOwnProfile = !userId || userId === currentUserId;
    const targetId = isOwnProfile ? currentUserId : userId;

    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState<any>(null);
    const [sessionsData, setSessionsData] = useState<any[]>([]);

    // Modals / Drawers
    const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
    const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);

    useEffect(() => {
        if (status === "loading") return;
        if (!targetId) {
            if (status === "unauthenticated") {
                setLoading(false);
            }
            return;
        }

        const fetchData = async () => {
            setLoading(true);
            try {
                let res, data;
                if (isOwnProfile) {
                    res = await fetch("/api/profile/me");
                } else {
                    res = await fetch(`/api/profile/${targetId}`);
                }
                data = await res.json();
                if (!res.ok) throw new Error(data.message || "Failed to fetch profile");
                setProfile(data);
                // TODO: Fetch sessions/reviews from API if available
                setSessionsData([]);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [status, targetId, isOwnProfile, session]);

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        toast.success("Profile link copied to clipboard", {
            style: { background: "#111111", color: "#38bdf8", border: "1px solid rgba(56,189,248,0.2)" }
        });
    };

    if (loading) return (
        <div className="min-h-screen bg-base">
            {/* Banner Skeleton */}
            <div className="w-full h-[200px] bg-card relative overflow-hidden">
                <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent z-10" />
            </div>
            <div className="max-w-6xl mx-auto px-4 sm:px-8 -mt-12 relative z-20">
                <div className="w-24 h-24 rounded-full bg-subtle border-4 border-base mb-4 overflow-hidden relative">
                    <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent z-10" />
                </div>
                <div className="w-48 h-8 bg-card rounded mb-2" />
                <div className="w-32 h-4 bg-card rounded mb-8" />

                <div className="flex flex-col md:flex-row gap-8">
                    <div className="w-full md:w-[380px] space-y-6">
                        <div className="h-40 glass-card rounded-[24px]" />
                        <div className="h-64 glass-card rounded-[24px]" />
                    </div>
                    <div className="flex-1 space-y-6">
                        <div className="h-48 glass-card rounded-[24px]" />
                        <div className="h-96 glass-card rounded-[24px]" />
                    </div>
                </div>
            </div>
        </div>
    );

    if (!profile) return (
        <div className="min-h-screen pt-32 pb-12 flex flex-col items-center justify-center text-center px-4">
            <h1 className="text-3xl font-syne text-white mb-2">Profile not found</h1>
            <p className="text-t2 font-sans mb-8">This student hasn't joined Yunetra yet.</p>
            <Link href="/match" className="px-6 py-3 rounded-xl glass-btn bg-primary/10 text-primary font-bold hover:bg-primary hover:text-base transition-colors">
                Back to Matches
            </Link>
        </div>
    );

    // Derive Banner Gradient
    const color1 = stringToColor(profile.name);
    const color2 = stringToColor(profile._id); // subtle difference

    const initials = profile.name.split(" ").map((n: string) => n[0]).join("").substring(0, 2).toUpperCase();
    
    // Consistent date formatting to avoid hydration errors
    const createdDate = new Date(profile.createdAt);
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const joinDate = `${months[createdDate.getMonth()]} ${createdDate.getFullYear()}`;

    // Calculate completeness
    let completeness = 0;
    let missingItems = [];
    if (profile.bio) completeness += 20; else missingItems.push({ id: 'bio', label: "Add a bio" });
    if ((profile.verifiedSkills || []).length > 0) completeness += 25; else missingItems.push({ id: 'verify', label: "Verify a skill" });
    if ((profile.skillsTeach || []).length >= 2) completeness += 20; else missingItems.push({ id: 'teach', label: "Add skills to teach" });
    if ((profile.skillsLearn || []).length >= 2) completeness += 15; else missingItems.push({ id: 'learn', label: "Add skills to learn" });
    if (profile.sessionsCompleted > 0) completeness += 20; else missingItems.push({ id: 'session', label: "Complete your first session" });

    const ringColor = completeness < 40 ? "#f43f5e" : completeness < 80 ? "#f59e0b" : "#00d4aa";

    return (
        <div className="min-h-screen bg-base pb-24">

            {/* 1. PROFILE HERO BANNER */}
            <div
                className="w-full h-[200px] relative overflow-hidden flex items-center justify-center"
                style={{
                    background: `radial-gradient(circle at 30% 0%, ${color1}50, transparent 60%), radial-gradient(circle at 80% 100%, ${color2}40, transparent 60%), #111111`
                }}
            >
                <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay" />
                {/* Animated Mesh Overlay (Subtle) */}
                <motion.div
                    animate={{ backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 opacity-30"
                    style={{ backgroundImage: `repeating-linear-gradient(45deg, ${color1}20 0px, transparent 2px, transparent 100px)` }}
                />
                {/* SVG Curve at bottom */}
                <svg className="absolute bottom-0 w-full h-12 text-base drop-shadow-[-30px_0_10px_#000000]" preserveAspectRatio="none" viewBox="0 0 1440 48" fill="currentColor">
                    <path d="M0 48h1440V0c-211 40-525 48-720 48S211 40 0 0v48z" />
                </svg>
            </div>

            <div className="max-w-6xl mx-auto px-4 sm:px-8 relative z-10 -mt-[48px]">

                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
                    {/* Avatar & Basic Info */}
                    <div className="flex flex-col items-start">
                        <div className="relative mb-4">
                            {/* Rotating Gradient Ring */}
                            <motion.div
                                animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                                className="absolute -inset-1 rounded-full bg-gradient-to-br from-primary via-transparent to-accent opacity-50 blur-[2px]"
                            />
                            <div
                                className="relative w-24 h-24 rounded-full flex items-center justify-center font-syne text-3xl font-bold text-white shadow-2xl border-[4px] border-base z-10"
                                style={{ background: `linear-gradient(135deg, ${color1}, ${color2})` }}
                            >
                                {initials}
                            </div>
                            {/* Online Indicator */}
                            <div className="absolute bottom-1 right-1 w-5 h-5 bg-base rounded-full flex items-center justify-center z-20">
                                <div className="w-3 h-3 bg-primary rounded-full shadow-[0_0_10px_#38bdf8]" />
                            </div>
                        </div>

                        <div className="flex items-center gap-3 mb-1">
                            <h1 className="text-3xl font-syne font-extrabold text-white tracking-tight">{profile.name}</h1>
                            <button onClick={handleShare} className="p-1.5 rounded-full glass-btn text-t2 hover:text-white ">
                                <Share2 className="w-4 h-4" />
                            </button>
                        </div>

                        <p className="font-mono text-sm text-t2 mb-1">
                            {profile.college} <span className="opacity-50 mx-1">•</span> {profile.branch} <span className="opacity-50 mx-1">•</span> {profile.year}
                        </p>
                        <p className="font-mono text-xs text-t2/60 mb-2">Member since {joinDate}</p>
                        
                        {/* Follow Stats */}
                        <div className="flex items-center gap-4 font-mono text-sm text-t2">
                            <Link href="/network" className="hover:text-white transition-colors">
                                <span className="font-bold text-white">{profile.followersCount || 0}</span> Followers
                            </Link>
                            <Link href="/network" className="hover:text-white transition-colors">
                                <span className="font-bold text-white">{profile.followingCount || 0}</span> Following
                            </Link>
                        </div>
                    </div>

                    {/* Actions & High Level Stats */}
                    <div className="flex flex-col items-start md:items-end gap-4 w-full md:w-auto">

                        <div className="flex gap-2">
                            {isOwnProfile ? (
                                <button onClick={() => setIsEditDrawerOpen(true)} className="px-6 py-2.5 rounded-full glass-btn text-white font-sans font-bold text-sm flex items-center gap-2 ">
                                    <Edit3 className="w-4 h-4" /> Edit Profile
                                </button>
                            ) : (
                                <>
                                    <GradientButton 
                                        onClick={() => setIsRequestModalOpen(true)}
                                        className="!px-8 !py-2.5 !rounded-full !text-sm"
                                    >
                                        Request Session
                                    </GradientButton>
                                    <FollowButton userId={targetId} size="lg" />
                                </>
                            )}
                        </div>

                        <motion.div
                            variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } }}
                            initial="hidden" animate="show"
                            className="flex flex-wrap gap-2"
                        >
                            <motion.div variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }} className="px-3 py-1.5 rounded-full glass-pill bg-warning/10 text-warning font-mono text-xs font-bold flex items-center gap-1.5 shadow-[0_0_10px_rgba(245,158,11,0.1)]">
                                <Star className="w-3.5 h-3.5 fill-warning" /> {profile.rating} Rating
                            </motion.div>
                            <motion.div variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }} className="px-3 py-1.5 rounded-full glass-pill text-white font-mono text-xs font-bold flex items-center gap-1.5">
                                <BookOpen className="w-3.5 h-3.5 text-t2" /> {profile.sessionsCompleted} Sessions
                            </motion.div>
                            {isOwnProfile && (
                                <motion.div variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }} className="px-3 py-1.5 rounded-full glass-pill text-white font-mono text-xs font-bold flex items-center gap-1.5">
                                    <Coins className="w-3.5 h-3.5 text-t2" /> {profile.skillCredits} Credits
                                </motion.div>
                            )}
                            <motion.div variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }} className="px-3 py-1.5 rounded-full glass-pill bg-primary/10 text-primary font-mono text-xs font-bold flex items-center gap-1.5 shadow-[0_0_10px_rgba(56,189,248,0.1)]">
                                <CheckCircle2 className="w-3.5 h-3.5" /> {profile.verifiedSkills.length} Verified
                            </motion.div>
                        </motion.div>

                    </div>
                </div>

                {/* MAIN 2-COLUMN LAYOUT */}
                <div className="flex flex-col lg:flex-row gap-8">

                    {/* 2. LEFT COLUMN */}
                    <div className="w-full lg:w-[380px] flex flex-col gap-6">

                        {/* About Section */}
                        {(profile.bio || isOwnProfile) && (
                            <div className="p-6 rounded-[24px] glass-card glass-shine">
                                <h3 className="text-lg font-syne font-bold text-white mb-3 flex items-center gap-2">About</h3>
                                {profile.bio ? (
                                    <p className="text-sm font-sans text-t2 leading-relaxed">{profile.bio}</p>
                                ) : (
                                    <button onClick={() => setIsEditDrawerOpen(true)} className="text-sm font-sans text-primary hover:underline ">
                                        Add a bio <ArrowRight className="w-3 h-3 inline" />
                                    </button>
                                )}
                            </div>
                        )}

                        {/* Profile Completeness (OWN ONLY) */}
                        {isOwnProfile && (
                            <div className="p-6 rounded-[24px] glass-elevated">
                                <h3 className="text-lg font-syne font-bold text-white mb-6">Profile Strength</h3>
                                <div className="flex items-center gap-6 mb-6">
                                    <div className="relative w-20 h-20 flex items-center justify-center">
                                        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                                            <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                                            <motion.circle
                                                cx="50" cy="50" r="45" fill="none" stroke={ringColor} strokeWidth="8"
                                                strokeLinecap="round" strokeDasharray="283"
                                                initial={{ strokeDashoffset: 283 }}
                                                animate={{ strokeDashoffset: 283 - (283 * completeness) / 100 }}
                                                transition={{ duration: 1.5, ease: "easeOut" }}
                                            />
                                        </svg>
                                        <span className="absolute font-mono font-bold text-lg text-white"><CountUp end={completeness} duration={2} />%</span>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-sans text-t2 leading-tight mb-2">
                                            {completeness === 100 ? "Looking great! You're ready to teach." : "A complete profile gets 3x more match requests."}
                                        </p>
                                    </div>
                                </div>
                                <div className="space-y-3 border-t border-white/[0.06] pt-4">
                                    {missingItems.length === 0 ? (
                                        <div className="flex items-center gap-2 text-xs font-sans text-primary"><CheckCircle className="w-4 h-4" /> All tasks completed!</div>
                                    ) : (
                                        missingItems.slice(0, 3).map(item => (
                                            <button key={item.id} onClick={() => setIsEditDrawerOpen(true)} className="flex items-start gap-2 text-left group/task  w-full">
                                                <span className="text-danger mt-0.5"><XCircle className="w-4 h-4" /></span>
                                                <span className="text-sm font-sans text-t1 group-hover/task:text-white transition-colors">{item.label} <ArrowRight className="w-3 h-3 inline opacity-0 group-hover/task:opacity-100 transition-opacity" /></span>
                                            </button>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Verified Skills */}
                        <div className="p-6 rounded-[24px] glass-card glass-shine">
                            <h3 className="text-lg font-syne font-bold text-white mb-4 flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5 text-primary" /> Verified Skills
                            </h3>
                            {profile.verifiedSkills.length > 0 ? (
                                <div className="flex flex-col gap-3">
                                    {profile.verifiedSkills.map((skill: string) => (
                                        <div key={skill} className="flex items-center justify-between p-3 rounded-xl glass-subtle bg-primary/5 group/ver hover:bg-primary/10 transition-colors">
                                            <span className="font-syne font-bold text-white tracking-tight">{skill}</span>
                                            <div className="bg-primary/10 backdrop-blur-md text-primary text-[10px] font-mono font-bold px-2 py-0.5 rounded-full flex gap-1 items-center shadow-[0_0_10px_rgba(56,189,248,0.1)]">
                                                <CheckCircle2 className="w-3 h-3" /> Verified
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm font-sans text-t2">No verified skills yet.</p>
                            )}
                        </div>

                        {/* Teaches */}
                        <div className="p-6 rounded-[24px] glass-card glass-shine">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-syne font-bold text-white flex items-center gap-2">🎓 Can Teach</h3>
                                {isOwnProfile && <button onClick={() => setIsEditDrawerOpen(true)} className="text-xs font-mono text-primary hover:underline cursor-none">+ Add</button>}
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {(profile.skillsTeach && profile.skillsTeach.length > 0) ? profile.skillsTeach.map((s: string) => (
                                    <SkillTag key={s} skill={s} variant="teach" />
                                )) : (
                                    <p className="text-sm font-sans text-t2">No teaching skills listed.</p>
                                )}
                            </div>
                        </div>

                        {/* Wants to Learn */}
                        <div className="p-6 rounded-[24px] glass-card glass-shine">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-syne font-bold text-white flex items-center gap-2">🎯 Wants to Learn</h3>
                                {isOwnProfile && <button onClick={() => setIsEditDrawerOpen(true)} className="text-xs font-mono text-accent hover:underline cursor-none">+ Add</button>}
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {(profile.skillsLearn && profile.skillsLearn.length > 0) ? profile.skillsLearn.map((s: string) => (
                                    <SkillTag key={s} skill={s} variant="learn" />
                                )) : (
                                    <p className="text-sm font-sans text-t2">No learning goals listed.</p>
                                )}
                            </div>
                        </div>

                        {/* Badges Section */}
                        <div className="p-6 rounded-[24px] glass-card glass-shine">
                            <h3 className="text-lg font-syne font-bold text-white mb-6 flex items-center gap-2">🏅 Badges</h3>
                            <div className="grid grid-cols-3 gap-4">
                                {profile.badges && profile.badges.length > 0 ? (
                                    profile.badges.map((badge: string, i: number) => {
                                        const isMentor = i % 2 === 0;
                                        const gradient = isMentor ? "from-warning to-danger" : "from-primary to-success";
                                        return (
                                            <motion.div
                                                key={badge}
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                whileInView={{ opacity: 1, scale: 1 }}
                                                viewport={{ once: true }}
                                                transition={{ delay: i * 0.1 }}
                                                className="relative group text-center flex flex-col items-center"
                                            >
                                                <div className="relative w-20 h-22 mb-3 cursor-none transition-transform group-hover:scale-110 flex items-center justify-center">
                                                    <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-50 blur-[10px] group-hover:opacity-100 transition-opacity`} />
                                                    <div
                                                        className={`relative w-20 h-20 bg-gradient-to-br ${gradient} flex items-center justify-center`}
                                                        style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}
                                                    >
                                                        <div className="w-[76px] h-[76px] glass-subtle flex items-center justify-center" style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}>
                                                            <Star className={`w-8 h-8 ${isMentor ? "text-warning fill-warning/20" : "text-primary fill-primary/20"} drop-shadow-[0_0_8px_currentColor]`} />
                                                        </div>
                                                    </div>

                                                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-max max-w-[150px] p-2 rounded-xl glass-elevated text-center opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none shadow-2xl">
                                                        <div className="text-xs font-syne font-bold text-white mb-0.5">{badge}</div>
                                                        <div className="text-[9px] font-mono text-t2">Earned recently</div>
                                                    </div>
                                                </div>
                                                <span className="text-[10px] font-mono text-t2 group-hover:text-t1 transition-colors leading-tight line-clamp-2">{badge}</span>
                                            </motion.div>
                                        )
                                    })
                                ) : (
                                    [1, 2, 3].map(i => (
                                        <div key={i} className="flex flex-col items-center text-center opacity-50">
                                            <div className="w-16 h-16 glass-subtle flex items-center justify-center mb-2" style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}>
                                                <Lock className="w-5 h-5 text-t2" />
                                            </div>
                                            <span className="text-[9px] font-mono text-t2/50">Locked</span>
                                        </div>
                                    ))
                                )}
                            </div>
                            {!profile.badges?.length && (
                                <p className="text-xs font-sans text-center text-t2 mt-4">Complete sessions to earn.</p>
                            )}
                        </div>

                    </div>

                    {/* 3. RIGHT COLUMN */}
                    <div className="flex-1 flex flex-col gap-6">

                        {/* Reputation Score Card */}
                        <div className="p-8 rounded-[32px] glass-elevated glass-shine relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-warning/5 blur-[50px] rounded-full pointer-events-none" />
                            <h3 className="text-xl font-syne font-bold text-white mb-8">Reputation Score</h3>

                            <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                                {/* Overall Score Circle */}
                                <div className="relative w-32 h-32 flex-shrink-0 flex items-center justify-center">
                                    <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                                        <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
                                        <motion.circle
                                            cx="50" cy="50" r="45" fill="none" stroke="#f59e0b" strokeWidth="6" strokeLinecap="round" strokeDasharray="283"
                                            initial={{ strokeDashoffset: 283 }}
                                            animate={{ strokeDashoffset: 283 - (283 * 92) / 100 }} // mock overall 92
                                            transition={{ duration: 2, ease: "easeOut" }}
                                        />
                                    </svg>
                                    <div className="absolute flex flex-col items-center">
                                        <span className="font-syne font-bold text-3xl text-white"><CountUp end={92} duration={2} /></span>
                                        <span className="text-[9px] font-mono text-warning uppercase tracking-widest mt-1">Overall</span>
                                    </div>
                                </div>

                                {/* Breakdown Bars */}
                                <div className="flex-1 w-full space-y-5">
                                    <div className="flex flex-col gap-1.5">
                                        <div className="flex justify-between text-xs font-mono font-bold">
                                            <span className="text-white">Skill Impact</span>
                                            <span className="text-primary">95/100</span>
                                        </div>
                                        <div className="h-1.5 bg-base rounded-full overflow-hidden">
                                            <motion.div initial={{ width: 0 }} animate={{ width: "95%" }} transition={{ duration: 1.5 }} className="h-full bg-primary shadow-[0_0_5px_#38bdf8]" />
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <div className="flex justify-between text-xs font-mono font-bold">
                                            <span className="text-white">Collaboration</span>
                                            <span className="text-accent">88/100</span>
                                        </div>
                                        <div className="h-1.5 bg-base rounded-full overflow-hidden">
                                            <motion.div initial={{ width: 0 }} animate={{ width: "88%" }} transition={{ duration: 1.5 }} className="h-full bg-accent shadow-[0_0_5px_#6366f1]" />
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <div className="flex justify-between text-xs font-mono font-bold">
                                            <span className="text-white">Knowledge Contrib</span>
                                            <span className="text-warning">80/100</span>
                                        </div>
                                        <div className="h-1.5 bg-base rounded-full overflow-hidden">
                                            <motion.div initial={{ width: 0 }} animate={{ width: "80%" }} transition={{ duration: 1.5 }} className="h-full bg-warning shadow-[0_0_5px_#f59e0b]" />
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-1.5 opacity-50">
                                        <div className="flex justify-between text-xs font-mono font-bold">
                                            <span className="text-t2">Team Reliability</span>
                                            <span className="text-t2">Coming soon</span>
                                        </div>
                                        <div className="h-1.5 bg-base rounded-full overflow-hidden">
                                            <div className="h-full w-0 bg-t2" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Recent Reviews */}
                        <div className="p-8 rounded-[32px] glass-card glass-shine">
                            <h3 className="text-xl font-syne font-bold text-white mb-6">What people say</h3>
                            {sessionsData.length > 0 ? (
                                <div className="flex flex-col gap-4">
                                    {sessionsData.map((rev, idx) => (
                                        <motion.div
                                            key={rev._id}
                                            initial={{ opacity: 0, y: 20 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: idx * 0.1 }}
                                            className="p-5 rounded-2xl glass-subtle border-l-4 border-l-primary relative"
                                        >
                                            <div className="flex justify-between items-start mb-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full glass-subtle mb-1 flex items-center justify-center font-bold text-xs">{rev.reviewer[0]}</div>
                                                    <div>
                                                        <div className="text-sm font-bold text-white font-syne">{rev.reviewer}</div>
                                                        <div className="flex gap-0.5">
                                                            {[...Array(5)].map((_, i) => (
                                                                <Star key={i} className={`w-3 h-3 ${i < Math.floor(rev.rating) ? "fill-warning text-warning" : "fill-transparent text-t2/30"}`} />
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                                <span className="text-[10px] font-mono text-t2">{rev.date}</span>
                                            </div>
                                            <p className="text-sm font-sans text-t1 italic mb-3 leading-relaxed">"{rev.review}"</p>
                                            <div className="inline-block px-2 py-0.5 rounded glass-pill text-xs font-mono font-bold text-primary">
                                                {rev.skill} session
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm font-sans text-t2">No reviews yet.</p>
                            )}
                        </div>

                        {/* Activity Timeline (OWN ONLY) Mocked */}
                        {isOwnProfile && (
                            <div className="p-8 rounded-[32px] glass-card glass-shine relative overflow-hidden">
                                <h3 className="text-xl font-syne font-bold text-white mb-8">Your Activity</h3>
                                <div className="relative border-l-2 border-card pl-6 ml-2 space-y-8">
                                    {/* Event 1 */}
                                    <div className="relative">
                                        <div className="absolute -left-[31px] top-1 w-3 h-3 rounded-full bg-primary ring-4 ring-base shadow-[0_0_10px_#38bdf8]" />
                                        <p className="text-sm font-sans text-white mb-1">Completed a <strong className="text-primary">React</strong> session with Rahul</p>
                                        <span className="text-xs font-mono text-t2">2 hours ago</span>
                                    </div>
                                    {/* Event 2 */}
                                    <div className="relative">
                                        <div className="absolute -left-[31px] top-1 w-3 h-3 rounded-full bg-warning ring-4 ring-base shadow-[0_0_10px_#f59e0b]" />
                                        <p className="text-sm font-sans text-white mb-1">Earned <strong className="text-warning">Figma Expert</strong> Badge</p>
                                        <span className="text-xs font-mono text-t2">Yesterday</span>
                                    </div>
                                    {/* Event 3 */}
                                    <div className="relative">
                                        <div className="absolute -left-[31px] top-1 w-3 h-3 rounded-full bg-accent ring-4 ring-base shadow-[0_0_10px_#6366f1]" />
                                        <p className="text-sm font-sans text-white mb-1">Passed the <strong className="text-accent">Node.js</strong> verification test</p>
                                        <span className="text-xs font-mono text-t2">Oct 12, 2026</span>
                                    </div>
                                    {/* Faded Line Extender */}
                                    <div className="absolute -left-[2px] bottom-0 w-0.5 h-16 bg-gradient-to-t from-subtle to-card" />
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </div>

            {/* Internal Modals Map */}
            {isRequestModalOpen && (
                <RequestSessionModal
                    match={{ matchedUser: { ...profile, skillsTeach: profile.skillsToTeach } }}
                    onClose={() => setIsRequestModalOpen(false)}
                    balance={(session?.user as any)?.skillCredits || 0}
                />
            )}
            <AnimatePresence>
                {isEditDrawerOpen && (
                    <EditProfileDrawer profile={profile} onClose={() => setIsEditDrawerOpen(false)} onUpdate={(newProfile) => setProfile(newProfile)} />
                )}
            </AnimatePresence>

        </div>
    );
}

// Inline fallback for xcircle icon missing from initial imports above
function XCircle(props: any) {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="m15 9-6 6" /><path d="m9 9 6 6" /></svg>
    );
}
