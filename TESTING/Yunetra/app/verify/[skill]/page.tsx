"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Loader2, CheckCircle, XCircle } from "lucide-react";
import toast from "react-hot-toast";
import confetti from "canvas-confetti";
import Link from "next/link";

interface Question {
    _id: string;
    skill: string;
    question: string;
    options: string[];
}

export default function QuizPage({ params }: { params: { skill: string } }) {
    const decodedSkill = decodeURIComponent(params.skill);
    const router = useRouter();
    const { status } = useSession();

    const [questions, setQuestions] = useState<Question[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<number, number>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // result = null (quiz in progress), "passed", "failed"
    const [result, setResult] = useState<"passed" | "failed" | null>(null);
    const [scoreData, setScoreData] = useState<any>(null); // from API

    const fetchQuestions = useCallback(async () => {
        try {
            const res = await fetch(`/api/verify/${encodeURIComponent(decodedSkill)}`);
            if (res.ok) {
                const data = await res.json();
                if (data.questions && data.questions.length === 5) {
                    setQuestions(data.questions);
                } else {
                    setError("Not enough questions available for this skill.");
                }
            } else {
                const err = await res.json();
                setError(err.error || "Failed to load test.");
            }
        } catch (e) {
            setError("Network error fetching test.");
        } finally {
            setLoading(false);
        }
    }, [decodedSkill]);

    useEffect(() => {
        if (status === "authenticated") {
            fetchQuestions();
        }
    }, [status, fetchQuestions]);

    // Prevent accidental navigation
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (result === null && Object.keys(answers).length > 0) {
                e.preventDefault();
                e.returnValue = "You have an active quiz. Are you sure you want to leave?";
            }
        };
        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => window.removeEventListener("beforeunload", handleBeforeUnload);
    }, [answers, result]);

    const handleSelectOption = (optIndex: number) => {
        setAnswers(prev => ({ ...prev, [currentIndex]: optIndex }));
    };

    const handleNext = () => {
        if (currentIndex < 4) setCurrentIndex(prev => prev + 1);
    };

    const handlePrev = () => {
        if (currentIndex > 0) setCurrentIndex(prev => prev - 1);
    };

    const fireConfetti = () => {
        const duration = 3000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

        const interval: any = setInterval(function () {
            const timeLeft = animationEnd - Date.now();
            if (timeLeft <= 0) return clearInterval(interval);

            const particleCount = 50 * (timeLeft / duration);
            confetti(Object.assign({}, defaults, { particleCount, origin: { x: Math.random(), y: Math.random() - 0.2 }, colors: ['#38bdf8', '#6366f1', '#f59e0b'] }));
        }, 250);
    };

    const handleSubmit = async () => {
        if (Object.keys(answers).length < 5) return;
        setIsSubmitting(true);

        // API Expects `answers` array in same order as the questions returned
        const answersArray = questions.map((_, idx) => answers[idx]);

        try {
            const res = await fetch(`/api/verify/${encodeURIComponent(decodedSkill)}/submit`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ answers: answersArray })
            });

            const data = await res.json();

            if (res.ok) {
                setScoreData(data); // e.g. { passed: true, score: 4, results: [true, false,...] }
                setResult(data.passed ? "passed" : "failed");
                if (data.passed) fireConfetti();

                if (!data.passed) {
                    // Store client-side cooldown timestamp for demo simulation
                    const userId = (status as any)?.user?.id || "temp";
                    const localCooldowns = JSON.parse(localStorage.getItem(`yunetra_cooldowns_${userId}`) || "{}");
                    localCooldowns[decodedSkill] = (new Date().getTime() + (24 * 60 * 60 * 1000)).toString();
                    localStorage.setItem(`yunetra_cooldowns_${userId}`, JSON.stringify(localCooldowns));
                }

            } else {
                toast.error(data.error || "Failed to submit test.");
            }
        } catch (e) {
            toast.error("Network error during submission.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // --- Rendering Functions ---

    const renderQuizContent = () => {
        const isSummary = currentIndex === 5;
        const currentQ = questions[currentIndex];

        if (isSummary) {
            return (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                    <h2 className="text-xl font-syne font-bold text-white mb-2 text-center">Ready to submit?</h2>
                    <p className="text-center text-t2 font-sans text-sm mb-8">You've answered all 5 questions. Review your choices below.</p>

                    <div className="space-y-3 mb-8">
                        {questions.map((q, idx) => (
                            <div key={q._id} className="p-4 rounded-xl bg-card/30 border border-white/5 flex gap-4">
                                <div className="font-mono text-primary font-bold">Q{idx + 1}</div>
                                <div className="flex-1 text-sm font-sans text-t2 truncate">
                                    {q.question}
                                </div>
                                <div className="w-8 h-8 rounded-full bg-card flex items-center justify-center font-mono text-white text-xs border border-[rgba(255,255,255,0.06)]">
                                    {['A', 'B', 'C', 'D'][answers[idx]]}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex gap-4">
                        <button onClick={() => setCurrentIndex(4)} className="flex-1 py-3 bg-card text-white font-sans font-bold rounded-xl border border-[rgba(255,255,255,0.06)] hover:bg-card/80 transition-colors">
                            Edit Answers
                        </button>
                        <button onClick={handleSubmit} disabled={isSubmitting} className="flex-1 py-3 bg-primary text-black font-sans font-bold rounded-xl hover:shadow-[0_0_20px_rgba(56,189,248,0.4)] transition-all flex justify-center items-center">
                            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Submit Test"}
                        </button>
                    </div>
                </motion.div>
            );
        }

        return (
            <div className="w-full relative min-h-[400px] flex flex-col">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="flex-1"
                    >
                        <div className="font-mono text-4xl font-extrabold text-primary/20 mb-2">Q{currentIndex + 1}</div>
                        <h2 className="text-2xl font-syne font-semibold text-white mb-8 leading-snug">{currentQ.question}</h2>

                        <div className="space-y-3">
                            {currentQ.options.map((opt, oIdx) => {
                                const isSelected = answers[currentIndex] === oIdx;
                                const letter = ['A', 'B', 'C', 'D'][oIdx];
                                return (
                                    <button
                                        key={oIdx}
                                        onClick={() => handleSelectOption(oIdx)}
                                        className={`w-full group/btn relative flex items-center p-4 rounded-xl border text-left transition-all duration-300 ${isSelected ? "border-primary bg-primary/5 shadow-[0_0_15px_rgba(56,189,248,0.1)] scale-[1.02]" : "border-[rgba(255,255,255,0.06)] bg-subtle hover:border-white/20 hover:bg-card"}`}
                                    >
                                        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-mono text-sm mr-4 transition-colors ${isSelected ? "bg-primary text-black font-bold shadow-[0_0_10px_rgba(56,189,248,0.5)]" : "bg-card text-t2 group-hover/btn:text-white"}`}>
                                            {letter}
                                        </div>
                                        <span className={`font-sans text-sm md:text-base flex-1 ${isSelected ? "text-white" : "text-t1"}`}>{opt}</span>
                                        <div className={`flex-shrink-0 w-5 h-5 rounded-full border-2 ml-4 transition-colors ${isSelected ? "border-primary bg-primary shadow-[0_0_10px_rgba(56,189,248,0.5)]" : "border-t2 group-hover/btn:border-white/50"}`} />
                                    </button>
                                );
                            })}
                        </div>
                    </motion.div>
                </AnimatePresence>

                <div className="mt-12 flex items-center justify-between border-t border-[rgba(255,255,255,0.06)] pt-6">
                    <button
                        onClick={handlePrev}
                        disabled={currentIndex === 0}
                        className="px-6 py-2.5 rounded-xl font-sans font-bold text-sm bg-card text-white border border-[rgba(255,255,255,0.06)] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-card/80 transition-colors"
                    >
                        Previous
                    </button>

                    <div className="flex gap-2">
                        {[0, 1, 2, 3, 4].map(idx => (
                            <div key={idx} className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${idx === currentIndex ? "bg-primary scale-150 shadow-[0_0_8px_rgba(56,189,248,0.6)]" : answers[idx] !== undefined ? "bg-primary/50" : "bg-card border border-[rgba(255,255,255,0.06)]"}`} />
                        ))}
                    </div>

                    <button
                        onClick={() => {
                            if (currentIndex === 4) setCurrentIndex(5); // Go to summary
                            else handleNext();
                        }}
                        disabled={answers[currentIndex] === undefined}
                        className="px-6 py-2.5 rounded-xl font-sans font-bold text-sm bg-primary text-black shadow-[0_0_15px_rgba(56,189,248,0.2)] disabled:opacity-30 disabled:shadow-none hover:shadow-[0_0_20px_rgba(56,189,248,0.5)] transition-all"
                    >
                        {currentIndex === 4 ? "Review Answers" : "Next"}
                    </button>
                </div>
            </div>
        );
    };

    const renderResults = () => {
        if (result === "passed") {
            return (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center p-8 max-w-xl mx-auto">
                    <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary/10 border-2 border-primary shadow-[0_0_50px_rgba(56,189,248,0.3)] mb-8">
                        <CheckCircle className="w-12 h-12 text-primary" />
                    </div>

                    <h1 className="text-4xl font-syne font-extrabold text-white mb-4">You're Verified! 🎉</h1>
                    <p className="text-2xl font-mono text-primary font-bold mb-6">{scoreData?.score} / 5 correct</p>

                    <p className="text-t2 font-sans mb-10 leading-relaxed text-lg">
                        <strong className="text-white">{decodedSkill}</strong> has been added to your verified skills. You can now teach this skill and earn Skill Credits.
                    </p>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="p-4 bg-card/50 border border-warning/30 rounded-2xl inline-flex flex-col items-center mb-10 shadow-[0_0_30px_rgba(245,158,11,0.1)]">
                        <span className="text-[10px] font-mono text-warning uppercase tracking-widest mb-2 animate-pulse">New Badge Earned!</span>
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-warning/20 flex items-center justify-center"><CheckCircle className="w-4 h-4 text-warning" /></div>
                            <span className="font-syne font-bold text-white tracking-tight">{decodedSkill} Expert</span>
                        </div>
                    </motion.div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/dashboard" className="px-8 py-3.5 bg-card text-white font-sans font-bold rounded-xl border border-[rgba(255,255,255,0.06)] hover:bg-card/80 transition-colors shadow-lg">
                            Dashboard
                        </Link>
                        <Link href="/verify" className="px-8 py-3.5 bg-primary text-black font-sans font-bold rounded-xl hover:shadow-[0_0_20px_rgba(56,189,248,0.4)] transition-all shadow-[0_0_15px_rgba(56,189,248,0.2)]">
                            Take Another Test
                        </Link>
                    </div>
                </motion.div>
            );
        }

        return (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center p-8 max-w-xl mx-auto">
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-danger/10 border-2 border-danger/50 shadow-[0_0_50px_rgba(244,63,94,0.15)] mb-8">
                    <XCircle className="w-12 h-12 text-danger" />
                </div>

                <h1 className="text-4xl font-syne font-extrabold text-white mb-4">Not quite this time</h1>
                <p className="text-lg font-mono text-t2 mb-6">
                    <span className="text-white font-bold">{scoreData?.score} / 5 correct</span> — need 3 to pass
                </p>

                <div className="p-6 bg-card/30 border border-white/5 rounded-2xl mb-10 text-left">
                    <p className="text-warning text-sm font-sans mb-4 leading-relaxed font-bold">
                        You can retry in 24 hours. Use this time to brush up on {decodedSkill}.
                    </p>
                    <div className="flex justify-between items-center text-xs font-mono text-t1">
                        <span>Result Breakdown:</span>
                        <div className="flex gap-1.5">
                            {scoreData?.results?.map((res: boolean, i: number) => (
                                <div key={i} className={`w-5 h-5 rounded flex items-center justify-center ${res ? "bg-primary/20 text-primary border border-primary/50" : "bg-danger/20 text-danger border border-danger/50"}`}>
                                    {res ? "✓" : "✗"}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/verify" className="px-8 py-3.5 bg-card text-white font-sans font-bold rounded-xl border border-[rgba(255,255,255,0.06)] hover:bg-card/80 transition-colors shadow-lg">
                        Back to Skills
                    </Link>
                </div>
            </motion.div>
        );
    };

    // Global Progress percentage
    const progressPercent = currentIndex < 5 ? (Object.keys(answers).length / 5) * 100 : 100;

    return (
        <div className="min-h-screen pt-24 pb-20 px-4 md:px-8 max-w-[800px] mx-auto font-sans">

            {/* Quiz Header */}
            {!result && (
                <div className="mb-12">
                    <Link href="/verify" className="inline-flex items-center gap-2 text-sm font-sans text-t2 hover:text-white transition-colors mb-6 ">
                        <ArrowLeft className="w-4 h-4" /> All Skills
                    </Link>

                    <div className="flex justify-between items-end mb-4">
                        <h1 className="text-3xl font-syne font-bold text-white tracking-tight">{decodedSkill} Assessment</h1>
                        <div className="text-xs font-mono text-primary font-bold">
                            {currentIndex < 5 ? `Question ${currentIndex + 1} of 5` : "Summary"}
                        </div>
                    </div>

                    {/* Progress Bar Container */}
                    <div className="w-full h-1.5 bg-card rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-primary shadow-[0_0_10px_rgba(56,189,248,0.5)]"
                            initial={{ width: 0 }}
                            animate={{ width: `${progressPercent}%` }}
                            transition={{ duration: 0.3 }}
                        />
                    </div>
                </div>
            )}

            {/* Main Card */}
            <div className={`w-full bg-subtle border border-[rgba(255,255,255,0.06)] rounded-[32px] overflow-hidden ${!result ? 'shadow-2xl' : 'border-transparent shadow-none bg-transparent'}`}>

                {loading ? (
                    <div className="p-8 md:p-12 relative min-h-[400px]">
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent h-[150%] animate-[scan_2s_ease-in-out_infinite] pointer-events-none" />
                        <div className="w-16 h-10 bg-card rounded mb-8 mask filter blur-[1px]" />
                        <div className="w-3/4 h-8 bg-card rounded mb-4" />
                        <div className="w-1/2 h-8 bg-card rounded mb-12" />

                        <div className="space-y-4">
                            {[1, 2, 3, 4].map(i => <div key={i} className="w-full h-14 rounded-xl bg-card/50 border border-white/5" />)}
                        </div>
                    </div>
                ) : error ? (
                    <div className="p-12 text-center">
                        <div className="w-16 h-16 rounded-full bg-card flex items-center justify-center mx-auto mb-4 border border-[rgba(255,255,255,0.06)]">
                            <XCircle className="w-8 h-8 text-t2" />
                        </div>
                        <p className="text-white font-syne font-bold text-xl mb-4">{error}</p>
                        <Link href="/verify" className="inline-flex px-6 py-2 rounded-xl bg-card/50 text-t1 hover:bg-card transition-colors border border-[rgba(255,255,255,0.06)]">Go Back</Link>
                    </div>
                ) : result ? (
                    renderResults()
                ) : (
                    <div className="p-6 md:p-12">
                        {renderQuizContent()}
                    </div>
                )}

            </div>

        </div>
    );
}
