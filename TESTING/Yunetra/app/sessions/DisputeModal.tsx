"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { X, AlertTriangle, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export default function DisputeModal({ session, onClose, onSuccess }: { session: any, onClose: () => void, onSuccess: () => void }) {
    const [reason, setReason] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (reason.length < 20) {
            toast.error("Please provide more details (min 20 characters).");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(`/api/sessions/${session._id}/dispute`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ reason })
            });

            if (res.ok) {
                toast.success("Dispute raised. Your credit has been refunded.");
                onSuccess();
                onClose();
            } else {
                toast.error("Failed to submit dispute.");
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
                className="absolute inset-0 bg-[#000000]/80 backdrop-blur-md"
                onClick={onClose}
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                className="relative w-full max-w-md bg-subtle border border-danger/30 rounded-[32px] shadow-[0_0_50px_rgba(244,63,94,0.1)] overflow-hidden flex flex-col"
            >
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-danger via-danger to-transparent" />

                <div className="p-6 border-b border-[rgba(255,255,255,0.06)] text-center relative">
                    <button onClick={onClose} className="absolute right-6 top-6 p-2 rounded-full hover:bg-card text-t2 hover:text-white transition-colors ">
                        <X className="w-5 h-5" />
                    </button>

                    <div className="w-16 h-16 rounded-full bg-danger/10 flex items-center justify-center mx-auto mb-4 border border-danger/30 shadow-[0_0_15px_rgba(244,63,94,0.2)]">
                        <AlertTriangle className="w-8 h-8 text-danger" />
                    </div>

                    <h2 className="font-syne font-bold text-2xl text-danger">Report an Issue</h2>
                    <p className="text-xs font-sans text-t2 mt-2 leading-relaxed">
                        If the teacher didn't deliver what was promised, you can dispute this session. Your credit will be refunded automatically.
                    </p>
                </div>

                <div className="p-6 space-y-4 bg-card/30">
                    <div>
                        <label className="text-xs font-sans font-semibold text-white mb-2 block">What went wrong?</label>
                        <textarea
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="e.g. The teacher didn't show up, or they didn't know the material..."
                            className="w-full h-32 bg-base border border-[rgba(255,255,255,0.06)] rounded-xl p-4 text-sm font-sans focus:border-danger focus:shadow-[0_0_10px_rgba(244,63,94,0.1)] outline-none resize-none "
                        />
                        <div className="flex justify-between items-center mt-2 px-1">
                            <span className={`text-[10px] font-mono ${reason.length < 20 ? 'text-danger animate-pulse' : 'text-primary'}`}>
                                {reason.length < 20 ? "Min 20 characters required" : "Looks good"}
                            </span>
                            <span className="text-[10px] font-mono text-t2">{reason.length} chars</span>
                        </div>
                    </div>

                    <div className="p-3 rounded-lg bg-danger/5 border border-danger/20 text-xs font-sans text-white/70">
                        <span className="font-bold text-danger">Warning:</span> This will flag the teacher's profile for review by moderators.
                    </div>
                </div>

                <div className="p-6 border-t border-[rgba(255,255,255,0.06)] bg-subtle flex gap-3">
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="flex-1 py-3 bg-transparent text-t1 font-sans font-semibold border border-[rgba(255,255,255,0.06)] rounded-xl hover:bg-card transition-all "
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading || reason.length < 20}
                        className="flex-1 py-3 bg-danger/20 text-danger border border-danger/50 font-sans font-bold rounded-xl hover:bg-danger hover:text-base hover:shadow-[0_0_20px_rgba(244,63,94,0.4)] disabled:opacity-50 disabled:shadow-none disabled:bg-card disabled:border-[rgba(255,255,255,0.06)] disabled:text-t2 transition-all  flex justify-center items-center"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Submit Dispute"}
                    </button>
                </div>

            </motion.div>
        </div>
    );
}
