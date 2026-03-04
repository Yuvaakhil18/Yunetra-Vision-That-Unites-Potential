"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Star, MessageSquare, Loader2, Sparkles } from "lucide-react";
import toast from "react-hot-toast";

export default function CompleteSessionModal({ session, isTeacher, onClose, onSuccess }: { session: any, isTeacher: boolean, onClose: () => void, onSuccess: () => void }) {
    const [q1, setQ1] = useState<number | null>(null);
    const [q2, setQ2] = useState<number | null>(null);
    const [q3, setQ3] = useState<number | null>(null);

    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [review, setReview] = useState("");
    const [loading, setLoading] = useState(false);

    const q1Text = "Did the teacher cover what was promised?";
    const q2Text = "Was the explanation clear?";
    const q3Text = "Would you recommend this person?";

    const getRatingLabel = (r: number) => {
        switch (r) {
            case 1: return "Poor";
            case 2: return "Fair";
            case 3: return "Good";
            case 4: return "Great";
            case 5: return "Excellent";
            default: return "-";
        }
    };

    const handleSubmit = async () => {
        if (rating === 0) {
            toast.error("Please provide a star rating.");
            return;
        }

        // Validate custom questions for learners implicitly here if needed
        // In actual implementation, we'd map generic feedback to DB fields. 
        // Here we compile the questions into the review body if not provided explicitly in model.
        let compiledReview = review;
        if (!isTeacher) {
            compiledReview = `[Q1: ${q1}] [Q2: ${q2}] [Q3: ${q3}] ${review}`;
        }

        setLoading(true);
        try {
            const res = await fetch(`/api/sessions/${session._id}/complete`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    rating,
                    review: compiledReview
                })
            });

            if (res.ok) {
                if (!isTeacher) {
                    toast.success("Review submitted! Credits will be released once both parties confirm.");
                } else {
                    toast("🎉 Session complete! Credits released. Check if you earned any new badges!", { icon: "🎉" });
                }
                onSuccess();
                onClose();
            } else {
                toast.error("Failed to complete session.");
            }
        } catch (err) {
            toast.error("Network error.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 pb-20 sm:pb-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 bg-[#000000]/80 backdrop-blur-sm"
                onClick={onClose}
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                className="relative w-full max-w-lg bg-subtle border border-[rgba(255,255,255,0.06)] rounded-[32px] shadow-2xl overflow-hidden flex flex-col"
            >
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-warning to-primary" />

                {/* Header */}
                <div className="p-6 border-b border-[rgba(255,255,255,0.06)] text-center relative">
                    <button onClick={onClose} className="absolute right-6 top-6 p-2 rounded-full hover:bg-card text-t2 hover:text-white transition-colors ">
                        <X className="w-5 h-5" />
                    </button>
                    <h2 className="font-syne font-bold text-2xl text-white mt-2">How did the session go?</h2>
                    <p className="text-sm font-sans text-t2 mt-2">Your feedback helps maintain community quality.</p>
                </div>

                <div className="p-6 space-y-6 overflow-y-auto max-h-[60vh] scrollbar-hide">

                    {/* Custom Learner Questions */}
                    {!isTeacher && (
                        <div className="space-y-4 border-b border-[rgba(255,255,255,0.06)] pb-6">
                            <div>
                                <label className="text-xs font-sans font-bold text-white mb-2 block">{q1Text}</label>
                                <div className="flex bg-card rounded-xl p-1 gap-1">
                                    {["No", "Partially", "Yes"].map((val, idx) => (
                                        <button key={val} onClick={() => setQ1(idx)} className={`flex-1 py-1.5 rounded-lg text-xs font-mono font-bold transition-all  ${q1 === idx ? "bg-primary/20 text-primary border border-primary/50 shadow-[0_0_10px_rgba(56,189,248,0.1)]" : "text-t2 hover:text-white border border-transparent"}`}>{val}</button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-sans font-bold text-white mb-2 block">{q2Text}</label>
                                <div className="flex bg-card rounded-xl p-1 gap-1">
                                    {["No", "Partially", "Yes"].map((val, idx) => (
                                        <button key={val} onClick={() => setQ2(idx)} className={`flex-1 py-1.5 rounded-lg text-xs font-mono font-bold transition-all  ${q2 === idx ? "bg-primary/20 text-primary border border-primary/50 shadow-[0_0_10px_rgba(56,189,248,0.1)]" : "text-t2 hover:text-white border border-transparent"}`}>{val}</button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-sans font-bold text-white mb-2 block">{q3Text}</label>
                                <div className="flex bg-card rounded-xl p-1 gap-1">
                                    {["No", "Yes"].map((val, idx) => (
                                        <button key={val} onClick={() => setQ3(idx)} className={`flex-1 py-1.5 rounded-lg text-xs font-mono font-bold transition-all  ${q3 === idx ? "bg-primary/20 text-primary border border-primary/50 shadow-[0_0_10px_rgba(56,189,248,0.1)]" : "text-t2 hover:text-white border border-transparent"}`}>{val}</button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Interactive Star Component */}
                    <div className="flex flex-col items-center justify-center py-4">
                        <h3 className="text-sm font-sans font-semibold text-white mb-4">Overall Rating</h3>
                        <div className="flex gap-2 mb-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                    onClick={() => setRating(star)}
                                    className="p-1  focus:outline-none transition-transform hover:scale-110 active:scale-95"
                                >
                                    <Star className={`w-10 h-10 transition-colors duration-200 ${(hoverRating || rating) >= star ? "fill-warning text-warning drop-shadow-[0_0_15px_rgba(245,158,11,0.6)]" : "fill-transparent text-t2/30"}`} />
                                </button>
                            ))}
                        </div>
                        <p className="font-mono text-xs font-bold uppercase tracking-widest text-warning w-24 text-center">
                            {getRatingLabel(hoverRating || rating)}
                        </p>
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="text-xs font-sans font-semibold text-white">Written Review</label>
                            <span className="text-[10px] font-mono text-t2 uppercase">Optional</span>
                        </div>
                        <textarea
                            value={review}
                            onChange={(e) => setReview(e.target.value)}
                            placeholder="Share what went well or what could improve..."
                            maxLength={300}
                            className="w-full h-28 bg-base border border-[rgba(255,255,255,0.06)] rounded-xl p-4 text-sm font-sans focus:border-warning focus:shadow-[0_0_10px_rgba(245,158,11,0.1)] outline-none resize-none cursor-none"
                        />
                        <p className="text-right text-[10px] font-mono text-t2 mt-1">{review.length} / 300</p>
                    </div>

                </div>

                <div className="p-6 border-t border-[rgba(255,255,255,0.06)] bg-subtle">
                    <button
                        onClick={handleSubmit}
                        disabled={loading || rating === 0}
                        className="w-full py-4 bg-warning text-base font-sans font-bold rounded-xl hover:shadow-[0_0_20px_rgba(245,158,11,0.6)] hover:scale-105 disabled:opacity-50 disabled:shadow-none disabled:scale-100 transition-all cursor-none flex justify-center items-center gap-2"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Submit & Release Credits"}
                    </button>
                </div>

            </motion.div>
        </div>
    );
}
