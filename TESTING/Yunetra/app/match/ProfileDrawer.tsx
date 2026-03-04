"use client";

import { motion } from "framer-motion";
import { X, Star, Calendar, MessageSquare, Award, BookOpen, Target, ExternalLink } from "lucide-react";
import CountUp from "react-countup";
import { SkillTag } from "@/components/SkillTag";
import { GradientButton } from "@/components/ui/gradient-button";

export default function ProfileDrawer({ match, onClose, onRequestSession }: { match: any, onClose: () => void, onRequestSession: () => void }) {
    const { name, college, year, rating, totalSessions, badges, skillsTeach, skillsLearn, compatibilityScore } = match;

    // Mock Reviews
    const reviews = [
        { name: "Rahul D.", rating: 5, text: `Great session! ${name} explained React hooks very clearly.` },
        { name: "Sneha K.", rating: 4, text: "Very helpful, but we ran out of time. Would book again!" },
        { name: "Aditya P.", rating: 5, text: "Awesome mentor. Solved my bug in 10 minutes." },
    ];

    return (
        <>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-40 glass-overlay"
                onClick={onClose}
            />

            <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-[450px] glass-elevated flex flex-col shadow-2xl overflow-hidden"
            >
                {/* Animated Gradient Border Top */}
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-accent via-primary to-warning" />

                <div className="p-6 border-b border-white/[0.06] flex items-center justify-between glass sticky top-0 z-20">
                    <h2 className="font-syne font-bold text-lg text-white">Profile Details</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-card text-t2 hover:text-white transition-colors ">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto scrollbar-hide">

                    {/* Header & Avatar */}
                    <div className="p-8 pb-6 flex flex-col items-center text-center border-b border-white/[0.04] bg-gradient-to-b from-white/[0.02] to-transparent">
                        <div className="relative mb-6">
                            <div className="absolute inset-0 bg-gradient-to-tr from-primary to-accent rounded-full animate-spin-slow opacity-50 blur-md pointer-events-none" />
                            <div className="w-24 h-24 rounded-full p-[2px] bg-gradient-to-tr from-primary to-accent relative z-10">
                                <div className="w-full h-full bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center font-syne font-bold text-4xl text-white">
                                    {name?.charAt(0) || "U"}
                                </div>
                            </div>
                            <div className="absolute -bottom-3 -right-3 w-10 h-10 glass rounded-full flex items-center justify-center z-20">
                                <span className="font-syne font-black text-sm text-primary">{compatibilityScore}%</span>
                            </div>
                        </div>

                        <h1 className="text-2xl font-syne font-bold text-white mb-2">{name}</h1>
                        <p className="font-mono text-sm text-t2">{college} • {year}</p>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-3 divide-x divide-white/[0.06] border-b border-white/[0.04]">
                        <div className="p-4 flex flex-col items-center justify-center">
                            <Star className="w-5 h-5 text-warning mb-2 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
                            <span className="font-mono font-bold text-lg text-white"><CountUp end={rating || 5.0} decimals={1} duration={2} /></span>
                            <span className="text-[10px] font-sans font-semibold text-t2 uppercase tracking-wider mt-1">Rating</span>
                        </div>
                        <div className="p-4 flex flex-col items-center justify-center">
                            <Calendar className="w-5 h-5 text-accent mb-2 drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
                            <span className="font-mono font-bold text-lg text-white"><CountUp end={totalSessions || 0} duration={2} /></span>
                            <span className="text-[10px] font-sans font-semibold text-t2 uppercase tracking-wider mt-1">Sessions</span>
                        </div>
                        <div className="p-4 flex flex-col items-center justify-center">
                            <Award className="w-5 h-5 text-primary mb-2 drop-shadow-[0_0_8px_rgba(56,189,248,0.5)]" />
                            <span className="font-mono font-bold text-lg text-white"><CountUp end={badges?.length || 0} duration={2} /></span>
                            <span className="text-[10px] font-sans font-semibold text-t2 uppercase tracking-wider mt-1">Badges</span>
                        </div>
                    </div>

                    <div className="p-6 space-y-8">
                        {/* Badges Section */}
                        {badges?.length > 0 ? (
                            <section>
                                <h3 className="text-xs font-sans font-bold text-t2 mb-4 uppercase tracking-wider flex items-center gap-2">
                                    <Award className="w-4 h-4 text-warning" /> Badges Earned
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {badges.map((b: string) => (
                                        <div key={b} className="px-3 py-1.5 rounded-lg glass-pill bg-warning/10 text-warning font-mono text-xs font-bold flex items-center gap-1.5">
                                            <Star className="w-3 h-3 fill-warning" />
                                            {b}
                                        </div>
                                    ))}
                                </div>
                            </section>
                        ) : (
                            <section>
                                <h3 className="text-xs font-sans font-bold text-t2 mb-4 uppercase tracking-wider flex items-center gap-2">
                                    <Award className="w-4 h-4 text-t2/50" /> Badges Earned
                                </h3>
                                <p className="text-sm font-sans text-t2/50 italic">No badges earned yet.</p>
                            </section>
                        )}

                        {/* Skills */}
                        <section className="space-y-6">
                            <div>
                                <h3 className="text-xs font-sans font-bold text-primary mb-3 uppercase tracking-wider flex items-center gap-2">
                                    <BookOpen className="w-4 h-4" /> They Teach
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {skillsTeach?.map((s: string) => (
                                        <SkillTag key={s} skill={s} variant={badges?.includes(s) ? 'verified' : 'teach'} />
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-xs font-sans font-bold text-accent mb-3 uppercase tracking-wider flex items-center gap-2">
                                    <Target className="w-4 h-4" /> They want to learn
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {skillsLearn?.map((s: string) => (
                                        <SkillTag key={s} skill={s} variant="learn" />
                                    ))}
                                </div>
                            </div>
                        </section>

                        {/* Recent Reviews (Mocked) */}
                        <section>
                            <h3 className="text-xs font-sans font-bold text-t2 mb-4 uppercase tracking-wider flex items-center gap-2">
                                <MessageSquare className="w-4 h-4 text-white" /> Recent Reviews
                            </h3>
                            {totalSessions > 0 ? (
                                <div className="space-y-3">
                                    {reviews.map((r, i) => (
                                        <div key={i} className="p-4 rounded-2xl glass-subtle">
                                            <div className="flex justify-between items-start mb-2">
                                                <span className="font-sans text-sm font-bold text-white">{r.name}</span>
                                                <div className="flex gap-0.5 text-warning">
                                                    {[...Array(r.rating)].map((_, j) => <Star key={j} className="w-3 h-3 fill-current" />)}
                                                </div>
                                            </div>
                                            <p className="font-sans text-xs text-t2 leading-relaxed">"{r.text}"</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm font-sans text-t2/50 italic">No reviews yet.</p>
                            )}
                        </section>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-white/[0.06] glass">
                    <GradientButton
                        onClick={onRequestSession}
                        className="w-full group"
                    >
                        <span>Request Session</span>
                        <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </GradientButton>
                </div>
            </motion.div>
        </>
    );
}
