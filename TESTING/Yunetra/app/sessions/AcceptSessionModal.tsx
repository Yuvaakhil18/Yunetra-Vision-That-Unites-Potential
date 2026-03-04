"use client";

import { useState } from "react";
import { motion, Reorder } from "framer-motion";
import { X, Calendar, Plus, Link as LinkIcon, AlertCircle, GripVertical, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export default function AcceptSessionModal({ session, onClose, onSuccess }: { session: any, onClose: () => void, onSuccess: () => void }) {
    const [agenda, setAgenda] = useState([{ id: '1', text: "" }, { id: '2', text: "" }, { id: '3', text: "" }]);
    const [meetLink, setMeetLink] = useState("");
    const [loading, setLoading] = useState(false);

    const isValidMeetLink = meetLink.includes("meet.google.com");

    const handleAddPoint = () => {
        if (agenda.length < 8) {
            setAgenda([...agenda, { id: Date.now().toString(), text: "" }]);
        }
    };

    const handleRemovePoint = (id: string) => {
        if (agenda.length > 3) {
            setAgenda(agenda.filter(p => p.id !== id));
        } else {
            toast.error("You must provide at least 3 agenda points.");
        }
    };

    const handleUpdatePoint = (id: string, text: string) => {
        setAgenda(agenda.map(p => p.id === id ? { ...p, text } : p));
    };

    const handleSubmit = async () => {
        const validPoints = agenda.filter(p => p.text.trim().length > 0);
        if (validPoints.length < 3) {
            toast.error("Please fill out at least 3 agenda points.");
            return;
        }
        if (!isValidMeetLink) {
            toast.error("Please provide a valid Google Meet link.");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(`/api/sessions/${session._id}/confirm`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    meetLink,
                    teacherOutline: validPoints.map(p => p.text)
                })
            });

            if (res.ok) {
                toast.success("Session confirmed! Agenda sent to learner.");
                onSuccess();
                onClose();
            } else {
                toast.error("Failed to confirm session.");
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
                initial={{ opacity: 0, y: "100%", scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: "100%", scale: 0.95 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="relative w-full max-w-2xl bg-subtle border border-[rgba(255,255,255,0.06)] rounded-[32px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
                {/* Header */}
                <div className="p-6 border-b border-[rgba(255,255,255,0.06)] flex items-center justify-between">
                    <h2 className="font-syne font-bold text-xl text-white">Accept Session Request</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-card text-t2 hover:text-white transition-colors ">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">

                    {/* Learner Info Panel */}
                    <div className="p-4 bg-card/50 border border-white/5 rounded-2xl">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center font-syne font-bold text-accent">
                                {session.learnerId.name?.charAt(0) || "U"}
                            </div>
                            <div>
                                <h3 className="font-syne font-bold text-white tracking-tight">{session.learnerId.name}</h3>
                                <p className="text-xs font-mono text-t2">{session.learnerId.college}</p>
                            </div>
                            <div className="ml-auto px-3 py-1 rounded-full bg-primary/10 text-primary font-mono text-xs font-bold border border-primary/30">
                                {session.skill}
                            </div>
                        </div>

                        {session.learnerGoal && (
                            <div className="relative p-4 rounded-xl bg-base border border-[rgba(255,255,255,0.06)]">
                                <span className="absolute -top-3 left-4 text-2xl text-accent font-serif opacity-50">"</span>
                                <p className="text-sm font-sans text-t2 italic relative z-10">{session.learnerGoal}</p>
                                {session.learnerLevel && (
                                    <span className="absolute top-2 right-2 text-[10px] uppercase font-mono bg-card px-2 py-0.5 rounded text-white">{session.learnerLevel}</span>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Dynamic Agenda */}
                    <div>
                        <h3 className="text-sm font-sans font-semibold text-white mb-1">What will you cover?</h3>
                        <p className="text-xs text-t2 mb-4">Provide a high-level agenda so the learner knows what to expect. (Min 3 points).</p>

                        <Reorder.Group axis="y" values={agenda} onReorder={setAgenda} className="space-y-3">
                            {agenda.map((point, index) => (
                                <Reorder.Item key={point.id} value={point} className="flex gap-2 group relative">
                                    <div className="mt-3 cursor-grab text-t2/30 group-hover:text-t2 transition-colors"><GripVertical className="w-4 h-4" /></div>
                                    <input
                                        type="text"
                                        value={point.text}
                                        onChange={(e) => handleUpdatePoint(point.id, e.target.value)}
                                        placeholder={`Point ${index + 1}`}
                                        className="flex-1 bg-base border border-[rgba(255,255,255,0.06)] rounded-xl px-4 py-2.5 text-sm text-t1 focus:border-primary focus:shadow-[0_0_10px_rgba(56,189,248,0.1)] outline-none transition-all "
                                    />
                                    <button onClick={() => handleRemovePoint(point.id)} className="px-3 hover:text-danger text-t2 transition-colors"><X className="w-4 h-4" /></button>
                                </Reorder.Item>
                            ))}
                        </Reorder.Group>

                        {agenda.length < 8 && (
                            <button onClick={handleAddPoint} className="mt-3 text-xs font-sans font-bold text-primary flex items-center gap-1 hover:brightness-125 transition-all ">
                                <Plus className="w-3 h-3" /> Add another point
                            </button>
                        )}
                    </div>

                    {/* Meet Link */}
                    <div>
                        <h3 className="text-sm font-sans font-semibold text-white mb-2">Google Meet Link</h3>
                        <div className="relative">
                            <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-t2" />
                            <input
                                type="url"
                                value={meetLink}
                                onChange={(e) => setMeetLink(e.target.value)}
                                placeholder="https://meet.google.com/xxx-xxxx-xxx"
                                className={`w-full bg-base border rounded-xl pl-10 pr-4 py-3 text-sm text-t1 outline-none transition-all cursor-none ${meetLink && !isValidMeetLink ? "border-danger focus:shadow-[0_0_10px_rgba(244,63,94,0.1)]" : meetLink && isValidMeetLink ? "border-primary focus:shadow-[0_0_10px_rgba(56,189,248,0.1)]" : "border-[rgba(255,255,255,0.06)] focus:border-white/30"}`}
                            />
                        </div>
                        {meetLink && !isValidMeetLink && <p className="text-[10px] text-danger flex items-center gap-1 mt-1 font-mono uppercase tracking-wider"><AlertCircle className="w-3 h-3" /> Must be a valid google meet link</p>}
                    </div>

                </div>

                {/* Footer */}
                <div className="p-6 border-t border-[rgba(255,255,255,0.06)] bg-subtle">
                    <button
                        onClick={handleSubmit}
                        disabled={loading || agenda.filter(p => p.text.length > 0).length < 3 || !isValidMeetLink}
                        className="w-full py-3 bg-primary text-base font-sans font-bold rounded-xl hover:shadow-[0_0_20px_rgba(56,189,248,0.4)] disabled:opacity-50 disabled:shadow-none transition-all cursor-none flex justify-center items-center"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Accept & Send Agenda"}
                    </button>
                </div>

            </motion.div>
        </div>
    );
}
