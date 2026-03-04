"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { X, Upload, Users, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { SUBMISSION_TYPES } from "@/constants/arenaConstants";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { GradientButton } from "@/components/ui/gradient-button";

type Challenge = any;

interface SubmissionModalProps {
    challenge: Challenge;
    onClose: () => void;
    onSuccess: () => void;
}

export default function SubmissionModal({ challenge, onClose, onSuccess }: SubmissionModalProps) {
    const { data: session } = useSession();
    const [loading, setLoading] = useState(false);
    const [teamMembers, setTeamMembers] = useState<string[]>([]);
    const [teamName, setTeamName] = useState('');
    const [formData, setFormData] = useState<Record<string, string>>({});

    const submissionType = SUBMISSION_TYPES[challenge.category as keyof typeof SUBMISSION_TYPES];

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const validateForm = () => {
        // Check all required fields are filled
        for (const field of submissionType.required) {
            if (!formData[field] || formData[field].trim() === '') {
                toast.error(`Please fill in: ${submissionType.labels[field as keyof typeof submissionType.labels]}`);
                return false;
            }
        }

        // Check team requirements
        if (!challenge.allowSolo) {
            if (teamMembers.length + 1 < challenge.minTeamSize) {
                toast.error(`This challenge requires a team of at least ${challenge.minTeamSize} members`);
                return false;
            }
            if (!teamName.trim()) {
                toast.error('Please enter a team name');
                return false;
            }
        }

        return true;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        try {
            setLoading(true);
            const res = await fetch(`/api/arena/${challenge._id}/submit`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    submissionData: formData,
                    teamMembers: teamMembers.length > 0 ? teamMembers : undefined,
                    teamName: teamName.trim() || undefined
                })
            });

            const data = await res.json();

            if (data.success) {
                toast.success(data.message || 'Submission successful!', {
                    icon: '🚀',
                    duration: 4000
                });
                onSuccess();
            } else {
                toast.error(data.error || 'Submission failed');
            }
        } catch (error) {
            console.error('Submission error:', error);
            toast.error('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const addTeamMember = () => {
        setTeamMembers(prev => [...prev, '']);
    };

    const removeTeamMember = (index: number) => {
        setTeamMembers(prev => prev.filter((_, i) => i !== index));
    };

    const updateTeamMember = (index: number, email: string) => {
        setTeamMembers(prev => prev.map((m, i) => i === index ? email : m));
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
                className="glass-card rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="sticky top-0 bg-base/90 backdrop-blur-md border-b border-white/[0.06] p-6 flex items-start justify-between z-10">
                    <div>
                        <h2 className="text-2xl font-syne font-bold text-white mb-1">Submit Your Entry</h2>
                        <p className="text-t2 text-sm">{challenge.title}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-xl glass-btn flex items-center justify-center text-t2 hover:text-white transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6">
                    {/* Team Section (if team challenge) */}
                    {!challenge.allowSolo && (
                        <div className="mb-8 p-5 rounded-2xl bg-accent/5 border border-accent/20">
                            <div className="flex items-center gap-2 mb-4">
                                <Users className="w-5 h-5 text-accent" />
                                <h3 className="font-syne font-bold text-white">Team Information</h3>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-t2 text-sm font-mono mb-2">Team Name*</label>
                                    <input
                                        type="text"
                                        value={teamName}
                                        onChange={(e) => setTeamName(e.target.value)}
                                        placeholder="Enter your team name"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder:text-t2 focus:outline-none focus:border-accent/50 transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block text-t2 text-sm font-mono mb-2">
                                        Team Members ({challenge.minTeamSize}-{challenge.maxTeamSize} members)
                                    </label>
                                    <div className="text-xs text-t2 mb-3">You're automatically added as team leader</div>

                                    {teamMembers.map((email, index) => (
                                        <div key={index} className="flex gap-2 mb-2">
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={(e) => updateTeamMember(index, e.target.value)}
                                                placeholder="teammate@example.com"
                                                className="flex-1 bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder:text-t2 focus:outline-none focus:border-accent/50 transition-all"
                                            />
                                            <button
                                                onClick={() => removeTeamMember(index)}
                                                className="px-4 py-3 rounded-xl border border-danger/30 text-danger hover:bg-danger/10 transition-colors"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    ))}

                                    {teamMembers.length + 1 < challenge.maxTeamSize && (
                                        <button
                                            onClick={addTeamMember}
                                            className="w-full py-3 rounded-xl border border-white/10 text-t1 hover:border-accent/30 hover:text-accent transition-all font-syne font-semibold text-sm"
                                        >
                                            + Add Team Member
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Submission Fields */}
                    <div className="space-y-6">
                        <h3 className="font-syne font-bold text-white flex items-center gap-2">
                            <Upload className="w-5 h-5 text-primary" />
                            Submission Links
                        </h3>

                        {/* Required Fields */}
                        {submissionType.required.map((field) => (
                            <div key={field}>
                                <label className="block text-t2 text-sm font-mono mb-2">
                                    {submissionType.labels[field as keyof typeof submissionType.labels]}*
                                </label>
                                <input
                                    type="url"
                                    value={formData[field] || ''}
                                    onChange={(e) => handleInputChange(field, e.target.value)}
                                    placeholder="https://..."
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder:text-t2 focus:outline-none focus:border-primary/50 transition-all"
                                />
                            </div>
                        ))}

                        {/* Optional Fields */}
                        {submissionType.optional && submissionType.optional.length > 0 && (
                            <div className="pt-4 border-t border-white/[0.06]">
                                <h4 className="text-t1 font-mono text-xs uppercase tracking-wider mb-4">Optional Fields</h4>
                                {submissionType.optional.map((field) => (
                                    <div key={field} className="mb-4">
                                        <label className="block text-t2 text-sm font-mono mb-2">
                                            {submissionType.labels[field as keyof typeof submissionType.labels]}
                                        </label>
                                        {field === 'description' ? (
                                            <textarea
                                                value={formData[field] || ''}
                                                onChange={(e) => handleInputChange(field, e.target.value)}
                                                placeholder="Describe your approach..."
                                                rows={4}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder:text-t2 focus:outline-none focus:border-primary/50 transition-all resize-none"
                                            />
                                        ) : (
                                            <input
                                                type="url"
                                                value={formData[field] || ''}
                                                onChange={(e) => handleInputChange(field, e.target.value)}
                                                placeholder="https://..."
                                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder:text-t2 focus:outline-none focus:border-primary/50 transition-all"
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Important Note */}
                    <div className="mt-6 p-4 rounded-xl bg-warning/10 border border-warning/30 flex gap-3">
                        <AlertCircle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-t1">
                            <strong className="text-warning">Important:</strong> Make sure all links are publicly accessible. Private links will be rejected. You can only submit once per challenge.
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-8 flex gap-4">
                        <button
                            onClick={onClose}
                            disabled={loading}
                            className="flex-1 px-6 py-3 rounded-xl border border-white/10 text-t1 font-syne font-bold hover:border-white/20 hover:text-white transition-colors disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <GradientButton
                            onClick={handleSubmit}
                            disabled={loading}
                            className="flex-1 !px-6 !py-3 !rounded-xl"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Submitting...
                                </>
                            ) : (
                                <>
                                    <CheckCircle className="w-5 h-5" />
                                    Submit Entry
                                </>
                            )}
                        </GradientButton>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}
