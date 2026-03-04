"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { User, Mail, Lock, Building, GraduationCap, PenTool, ArrowRight, Loader2, Sparkles, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";
import { GradientButton } from "@/components/ui/gradient-button";

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        college: "",
        year: "",
        branch: ""
    });
    const [isLoading, setIsLoading] = useState(false);
    const [step, setStep] = useState(1);
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const nextStep = () => {
        if (step === 1 && (!formData.name || !formData.email || !formData.password)) {
            toast.error("Please fill in all personal details");
            return;
        }
        setStep(step + 1);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (res.ok) {
                toast.success("Account created successfully!");
                router.push("/login");
            } else {
                toast.error(data.message || "Registration failed");
            }
        } catch (error) {
            toast.error("An error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#000000] flex items-center justify-center p-4 relative overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[140px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-xl relative z-10"
            >
                <div className="glass-panel border border-white/10 rounded-[40px] p-8 md:p-12 shadow-2xl relative overflow-hidden">
                    <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-accent to-warning opacity-50" />

                    <div className="flex justify-between items-center mb-10">
                        <Link href="/" className="inline-flex items-center gap-3 group">
                            <div className="relative w-8 h-8 group-hover:scale-110 transition-transform">
                                <Image
                                    src="/images/logo/logo.png"
                                    alt="YUNETRA Logo"
                                    fill
                                    className="object-contain"
                                    priority
                                />
                            </div>
                            <span className="font-syne font-bold text-lg tracking-tight text-white group-hover:text-primary transition-colors">YUNETRA</span>
                        </Link>
                        <div className="flex gap-2">
                            {[1, 2].map((s) => (
                                <div key={s} className={`h-1 w-8 rounded-full transition-all duration-500 ${step >= s ? "bg-primary" : "bg-white/10"}`} />
                            ))}
                        </div>
                    </div>

                    <div className="mb-8 md:mb-10">
                        <h1 className="text-3xl md:text-4xl font-syne font-extrabold text-white mb-2 leading-tight">
                            {step === 1 ? "Start Your Journey" : "Academic Profile"}
                        </h1>
                        <p className="text-t2 text-base md:text-lg">{step === 1 ? "Create your account to start trading skills." : "Help us match you with the right mentors."}</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <AnimatePresence mode="wait">
                            {step === 1 ? (
                                <motion.div
                                    key="step1"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="space-y-5"
                                >
                                    <div className="space-y-2">
                                        <label className="text-xs font-mono uppercase tracking-widest text-t2 ml-1">Full Name</label>
                                        <div className="relative group">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-t2 group-focus-within:text-primary transition-colors" />
                                            <input name="name" value={formData.name} onChange={handleChange} placeholder="Arjun Sharma" required className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all font-sans" />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-mono uppercase tracking-widest text-t2 ml-1">Email Address</label>
                                        <div className="relative group">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-t2 group-focus-within:text-primary transition-colors" />
                                            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="arjun@college.edu" required className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all font-sans" />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-mono uppercase tracking-widest text-t2 ml-1">Create Password</label>
                                        <div className="relative group">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-t2 group-focus-within:text-primary transition-colors" />
                                            <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="••••••••" required className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all font-sans" />
                                        </div>
                                    </div>

                                    <GradientButton type="button" onClick={nextStep} className="w-full group">
                                        Next Details <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </GradientButton>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="step2"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-5"
                                >
                                    <div className="space-y-2">
                                        <label className="text-xs font-mono uppercase tracking-widest text-t2 ml-1">College Name</label>
                                        <div className="relative group">
                                            <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-t2 group-focus-within:text-accent transition-colors" />
                                            <input name="college" value={formData.college} onChange={handleChange} placeholder="IIT Delhi" required className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-accent/50 focus:bg-white/10 transition-all font-sans" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-xs font-mono uppercase tracking-widest text-t2 ml-1">Current Year</label>
                                            <div className="relative group">
                                                <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-t2 group-focus-within:text-accent transition-colors" />
                                                <select name="year" value={formData.year} onChange={handleChange} required className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-accent/50 focus:bg-white/10 transition-all font-sans appearance-none">
                                                    <option value="" className="bg-base">Select</option>
                                                    <option value="1st Year" className="bg-base">1st Year</option>
                                                    <option value="2nd Year" className="bg-base">2nd Year</option>
                                                    <option value="3rd Year" className="bg-base">3rd Year</option>
                                                    <option value="4th Year" className="bg-base">4th Year</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-mono uppercase tracking-widest text-t2 ml-1">Branch</label>
                                            <div className="relative group">
                                                <PenTool className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-t2 group-focus-within:text-accent transition-colors" />
                                                <input name="branch" value={formData.branch} onChange={handleChange} placeholder="CS / IT" required className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-accent/50 focus:bg-white/10 transition-all font-sans" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-4">
                                        <button type="button" onClick={() => setStep(1)} className="flex-1 py-5 rounded-2xl border border-white/10 text-white font-sans font-bold text-lg hover:bg-white/5 transition-all">Back</button>
                                        <GradientButton type="submit" disabled={isLoading} className="flex-[2] group">
                                            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <span>Complete Registration</span>}
                                        </GradientButton>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </form>

                    <div className="mt-10 pt-8 border-t border-white/10 text-center">
                        <p className="text-t2 text-sm">
                            Already a member?{" "}
                            <Link href="/login" className="text-primary font-bold hover:underline underline-offset-4">Sign In</Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
