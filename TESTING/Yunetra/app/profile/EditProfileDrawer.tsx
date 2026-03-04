"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { X, Loader2, Plus, Info, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";

interface EditDrawerProps {
    profile: any;
    onClose: () => void;
    onUpdate: (profile: any) => void;
}

export default function EditProfileDrawer({ profile, onClose, onUpdate }: EditDrawerProps) {
    const [formData, setFormData] = useState({
        name: profile.name || "",
        college: profile.college || "",
        year: profile.year || "",
        branch: profile.branch || "",
        bio: profile.bio || ""
    });

    // Always use the correct backend field names for state
    const [skillsTeach, setSkillsTeach] = useState<string[]>(profile.skillsTeach || []);
    const [skillsLearn, setSkillsLearn] = useState<string[]>(profile.skillsLearn || []);
    const [tempTeach, setTempTeach] = useState("");
    const [tempLearn, setTempLearn] = useState("");
    const [loading, setLoading] = useState(false);

    // Note: Avatar Color selection logic placeholder if needed. Handled deterministically now by stringToColor in UI.

    const handleInputChange = (e: any) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAddSkill = (type: "teach" | "learn", e: any) => {
        if (e.key === "Enter") {
            e.preventDefault();
            const val = type === "teach" ? tempTeach.trim() : tempLearn.trim();
            if (!val) return;

            if (type === "teach" && !skillsTeach.includes(val)) {
                if (skillsTeach.length >= 8) { toast.error("Max 8 skills allowed"); return; }
                setSkillsTeach([...skillsTeach, val]);
                setTempTeach("");
            } else if (type === "learn" && !skillsLearn.includes(val)) {
                if (skillsLearn.length >= 8) { toast.error("Max 8 skills allowed"); return; }
                setSkillsLearn([...skillsLearn, val]);
                setTempLearn("");
            }
        }
    };

    const removeSkill = (type: "teach" | "learn", skill: string) => {
        if (type === "teach") setSkillsTeach(skillsTeach.filter(s => s !== skill));
        if (type === "learn") setSkillsLearn(skillsLearn.filter(s => s !== skill));
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch("/api/profile/update", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    skillsTeach,
                    skillsLearn
                })
            });
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.message || "Failed to update profile");
            }
            onUpdate(data.user);
            toast.success("Profile updated successfully!");
            onClose();
        } catch (err: any) {
            toast.error(err.message || "Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={onClose}
                className="fixed inset-0 glass-overlay z-50 cursor-pointer"
            />

            {/* Drawer */}
            <motion.div
                initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed inset-y-0 right-0 w-full max-w-md glass-elevated z-50 shadow-2xl flex flex-col"
            >
                {/* Header */}
                <div className="p-6 border-b border-white/[0.06] flex justify-between items-center glass">
                    <h2 className="text-xl font-syne font-bold text-white">Edit Your Profile</h2>
                    <button onClick={onClose} className="p-2 rounded-full glass-btn text-t2 hover:text-white ">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form Body */}
                <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
                    <form id="edit-profile-form" onSubmit={handleSubmit} className="space-y-6">

                        {/* Basic Fields */}
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-sans font-bold text-white mb-2 block">Display Name</label>
                                <input required name="name" value={formData.name} onChange={handleInputChange} className="w-full glass-input rounded-xl px-4 py-3 text-sm text-t1 outline-none " />
                            </div>

                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="text-xs font-sans font-bold text-white mb-2 block">College</label>
                                    <input required name="college" value={formData.college} onChange={handleInputChange} className="w-full glass-input rounded-xl px-4 py-3 text-sm text-t1 outline-none " />
                                </div>
                                <div className="w-32">
                                    <label className="text-xs font-sans font-bold text-white mb-2 block">Year</label>
                                    <select required name="year" value={formData.year} onChange={handleInputChange} className="w-full glass-input rounded-xl px-4 py-3 text-sm text-t1 outline-none  appearance-none">
                                        <option value="1st Year">1st Year</option>
                                        <option value="2nd Year">2nd Year</option>
                                        <option value="3rd Year">3rd Year</option>
                                        <option value="4th Year">4th Year</option>
                                        <option value="Alumni">Alumni</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-sans font-bold text-white mb-2 block">Branch / Major</label>
                                <input required name="branch" value={formData.branch} onChange={handleInputChange} className="w-full glass-input rounded-xl px-4 py-3 text-sm text-t1 outline-none " />
                            </div>

                            <div>
                                <div className="flex justify-between items-end mb-2">
                                    <label className="text-xs font-sans font-bold text-white block">Bio</label>
                                    <span className="text-[10px] font-mono text-t2">{formData.bio.length} / 200</span>
                                </div>
                                <textarea name="bio" value={formData.bio} onChange={handleInputChange} maxLength={200} placeholder="Tell others what you're passionate about..." className="w-full h-24 glass-input rounded-xl p-4 text-sm text-t1 outline-none resize-none " />
                            </div>
                        </div>

                        <hr className="border-[rgba(255,255,255,0.06)] my-8" />

                        {/* Skills Logic */}
                        <div className="space-y-6">
                            {/* Teaches */}
                            <div>
                                <label className="text-xs font-sans font-bold text-white mb-1 block flex items-center gap-2">🎓 Skills you can teach</label>
                                <p className="text-[10px] text-t2 mb-3 font-mono">Type and press Enter. Max 8.</p>

                                <div className="flex flex-wrap gap-2 mb-3">
                                    {skillsTeach.map(skill => (
                                        <div key={skill} className="flex items-center gap-1.5 px-3 py-1.5 rounded-md glass-pill bg-primary/10 text-primary text-xs font-mono">
                                            {skill} <button type="button" onClick={() => removeSkill("teach", skill)} className="hover:text-white transition-colors"><X className="w-3 h-3" /></button>
                                        </div>
                                    ))}
                                </div>
                                {skillsTeach.length < 8 && (
                                    <input value={tempTeach} onChange={e => setTempTeach(e.target.value)} onKeyDown={(e) => handleAddSkill("teach", e)} placeholder="e.g. React, Figma, Python..." className="w-full glass-input rounded-xl px-4 py-2.5 text-sm text-t1 outline-none" />
                                )}
                            </div>

                            {/* Learns */}
                            <div>
                                <label className="text-xs font-sans font-bold text-white mb-1 block flex items-center gap-2">🎯 Skills you want to learn</label>
                                <div className="flex flex-wrap gap-2 mb-3">
                                    {skillsLearn.map(skill => (
                                        <div key={skill} className="flex items-center gap-1.5 px-3 py-1.5 rounded-md glass-pill bg-accent/10 text-accent text-xs font-mono">
                                            {skill} <button type="button" onClick={() => removeSkill("learn", skill)} className="hover:text-white transition-colors"><X className="w-3 h-3" /></button>
                                        </div>
                                    ))}
                                </div>
                                {skillsLearn.length < 8 && (
                                    <input value={tempLearn} onChange={e => setTempLearn(e.target.value)} onKeyDown={(e) => handleAddSkill("learn", e)} placeholder="e.g. Node.js, Next.js..." className="w-full glass-input rounded-xl px-4 py-2.5 text-sm text-t1 outline-none" />
                                )}
                            </div>
                        </div>

                    </form>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-white/[0.06] glass">
                    <div className="flex justify-between items-center mb-4 text-[10px] font-mono text-t2">
                        <span className="flex items-center gap-1"><Info className="w-3 h-3" /> Changes save optimistically</span>
                    </div>
                    <button
                        form="edit-profile-form"
                        type="submit"
                        disabled={loading || !formData.name || !formData.college}
                        className="w-full py-3.5 bg-primary/90 backdrop-blur-md text-base font-sans font-bold rounded-xl hover:shadow-[0_0_30px_rgba(56,189,248,0.3)] disabled:opacity-50 disabled:shadow-none transition-all flex items-center justify-center cursor-none"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Save Profile"}
                    </button>
                </div>

            </motion.div>
        </>
    );
}
