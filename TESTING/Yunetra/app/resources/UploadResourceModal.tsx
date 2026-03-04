import { useState, useCallback, useEffect } from "react";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Link as LinkIcon, AlertCircle, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

interface UploadResourceModalProps {
    onClose: () => void;
    onSuccess: (newResource: any) => void;
}

const RESOURCE_TYPES = [
    { id: "course", label: "Course", icon: "▶️" },
    { id: "article", label: "Article", icon: "📄" },
    { id: "notes", label: "Notes", icon: "📝" },
    { id: "roadmap", label: "Roadmap", icon: "🗺️" },
    { id: "internship", label: "Internship", icon: "💼" },
    { id: "tool", label: "Tool", icon: "🛠️" },
];

const SKILL_CATEGORIES = [
    "React", "Figma", "DSA", "Node.js", "Python", "Machine Learning", "Canva", "UI Design"
];

export default function UploadResourceModal({ onClose, onSuccess }: UploadResourceModalProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        url: "",
        type: "",
        skill: "",
        description: ""
    });

    const [urlError, setUrlError] = useState("");
    const [domainPreview, setDomainPreview] = useState("");

    // Validate URL as user types
    useEffect(() => {
        if (!formData.url) {
            setUrlError("");
            setDomainPreview("");
            return;
        }
        try {
            const u = new URL(formData.url.includes("http") ? formData.url : `https://${formData.url}`);
            setDomainPreview(u.hostname.replace("www.", ""));
            setUrlError("");
        } catch (err) {
            setUrlError("Invalid URL format");
            setDomainPreview("");
        }
    }, [formData.url]);

    const handleSubmit = async () => {
        if (!formData.title || !formData.url || !formData.type || !formData.skill) {
            toast.error("Please fill in all required fields", { style: { background: "#f43f5e", color: "#f1f5f9" } });
            return;
        }
        if (urlError) {
            toast.error("Please fix the URL error", { style: { background: "#f43f5e", color: "#f1f5f9" } });
            return;
        }

        setLoading(true);
        try {
            // Auto-prepend https if missing
            const finalUrl = formData.url.startsWith("http") ? formData.url : `https://${formData.url}`;

            const res = await fetch("/api/resources", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...formData, url: finalUrl })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to upload resource");

            toast.success("Resource shared! Thank you for contributing 🙌", {
                style: { background: "#111111", color: "#38bdf8", border: "1px solid rgba(56,189,248,0.2)" }
            });
            onSuccess(data);
            onClose();
        } catch (err: any) {
            toast.error(err.message || "Something went wrong", { style: { background: "#111111", color: "#f43f5e" } });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-base/80 backdrop-blur-sm"
            />

            {/* Modal */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-xl bg-subtle border border-[rgba(255,255,255,0.06)] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
                {/* Header */}
                <div className="p-6 border-b border-[rgba(255,255,255,0.06)] bg-card/50 shrink-0">
                    <button onClick={onClose} className="absolute top-6 right-6 text-t2 hover:text-white transition-colors ">
                        <X className="w-5 h-5" />
                    </button>
                    <h2 className="text-2xl font-syne font-bold text-white mb-2">Share a Resource</h2>
                    <p className="text-sm font-sans text-t2">Help your fellow students learn for free. Only share genuinely useful links.</p>
                </div>

                {/* Scrollable Content */}
                <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-6">

                    {/* Title */}
                    <div className="space-y-2">
                        <label className="text-sm font-mono font-bold text-white">Resource Title *</label>
                        <input
                            type="text"
                            maxLength={80}
                            placeholder="e.g. The Best Free React Course on YouTube"
                            className="w-full bg-card border border-[rgba(255,255,255,0.06)] rounded-xl px-4 py-3 text-white placeholder-t2 focus:outline-none focus:border-primary/50 focus:shadow-[0_0_15px_rgba(56,189,248,0.1)] transition-all font-sans"
                            value={formData.title}
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                        />
                        <div className="text-right text-xs font-mono text-t2">{formData.title.length}/80</div>
                    </div>

                    {/* URL */}
                    <div className="space-y-2">
                        <label className="text-sm font-mono font-bold text-white flex justify-between">
                            <span>Link URL *</span>
                            {domainPreview && <span className="text-primary">Will open: {domainPreview}</span>}
                            {urlError && <span className="text-danger flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {urlError}</span>}
                        </label>
                        <div className="relative">
                            <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-t2" />
                            <input
                                type="url"
                                placeholder="https://"
                                className={`w-full bg-card border rounded-xl pl-11 pr-4 py-3 text-white placeholder-t2 focus:outline-none transition-all font-sans ${urlError ? "border-danger/50 focus:shadow-[0_0_15px_rgba(244,63,94,0.1)]" : "border-[rgba(255,255,255,0.06)] focus:border-primary/50 focus:shadow-[0_0_15px_rgba(56,189,248,0.1)]"}`}
                                value={formData.url}
                                onChange={e => setFormData({ ...formData, url: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Resource Type Options */}
                    <div className="space-y-2">
                        <label className="text-sm font-mono font-bold text-white">Resource Type *</label>
                        <div className="grid grid-cols-3 gap-2">
                            {RESOURCE_TYPES.map(rt => {
                                const isSelected = formData.type === rt.id;
                                return (
                                    <button
                                        key={rt.id}
                                        onClick={() => setFormData({ ...formData, type: rt.id })}
                                        className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all  ${isSelected ? "bg-primary/10 border-primary shadow-[0_0_15px_rgba(56,189,248,0.15)] text-primary" : "bg-card border-[rgba(255,255,255,0.06)] text-t2 hover:border-t2/50"}`}
                                    >
                                        <span className="text-2xl mb-1">{rt.icon}</span>
                                        <span className="text-xs font-mono font-bold">{rt.label}</span>
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    {/* Related Skill Options */}
                    <div className="space-y-2">
                        <label className="text-sm font-mono font-bold text-white">Related Skill *</label>
                        <div className="flex flex-wrap gap-2">
                            {SKILL_CATEGORIES.map(s => {
                                const isSelected = formData.skill === s;
                                return (
                                    <button
                                        key={s}
                                        onClick={() => setFormData({ ...formData, skill: s })}
                                        className={`px-3 py-1.5 rounded-full border text-xs font-mono font-bold transition-all  ${isSelected ? "bg-primary text-base border-primary shadow-[0_0_15px_rgba(56,189,248,0.3)]" : "bg-card border-[rgba(255,255,255,0.06)] text-t2 hover:border-t2/50"}`}
                                    >
                                        {s}
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    {/* Description textarea */}
                    <div className="space-y-2 pb-4">
                        <label className="text-sm font-mono font-bold text-white flex justify-between">
                            <span>Short Description <span className="text-t2 font-normal">(optional)</span></span>
                            <span className="text-t2">{formData.description.length}/200</span>
                        </label>
                        <textarea
                            rows={3}
                            maxLength={200}
                            placeholder="What makes this resource great? E.g. Best instructor ever..."
                            className="w-full bg-card border border-[rgba(255,255,255,0.06)] rounded-xl px-4 py-3 text-white placeholder-t2 focus:outline-none focus:border-primary/50 focus:shadow-[0_0_15px_rgba(56,189,248,0.1)] transition-all font-sans resize-none"
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                </div>

                {/* Footer */}
                <div className="p-6 border-t border-[rgba(255,255,255,0.06)] bg-card/50 shrink-0 flex justify-end gap-3">
                    <button onClick={onClose} className="px-5 py-2.5 rounded-xl text-white font-sans font-bold hover:bg-subtle transition-colors cursor-none">
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading || !formData.title || !formData.url || !formData.type || !formData.skill || !!urlError}
                        className="px-6 py-2.5 rounded-xl bg-primary text-base font-sans font-bold hover:shadow-[0_0_20px_rgba(56,189,248,0.4)] disabled:opacity-50 disabled:hover:shadow-none transition-all flex items-center gap-2 cursor-none"
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                        Share Resource
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
