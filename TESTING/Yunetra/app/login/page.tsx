"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Mail, Lock, ArrowRight, Sparkles, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { GradientButton } from "@/components/ui/gradient-button";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const result = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (result?.error) {
                toast.error("Invalid email or password");
            } else {
                toast.success("Welcome back!");
                router.push("/dashboard");
                router.refresh();
            }
        } catch (error) {
            toast.error("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#000000] flex items-center justify-center p-4 relative overflow-hidden">
            {/* Ambient Background Elements */}
            <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[100px] pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-md relative z-10"
            >
                <div className="glass-panel border border-white/10 rounded-[32px] p-8 md:p-10 shadow-2xl relative overflow-hidden">
                    <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary to-accent opacity-50" />

                    <div className="text-center mb-10">
                        <Link href="/" className="inline-flex items-center gap-3 mb-6 group justify-center">
                            <div className="relative w-10 h-10 group-hover:scale-110 transition-transform">
                                <Image
                                    src="/images/logo/logo.png"
                                    alt="YUNETRA Logo"
                                    fill
                                    className="object-contain"
                                    priority
                                />
                            </div>
                            <span className="font-syne font-bold text-xl tracking-tight text-white group-hover:text-primary transition-colors">YUNETRA</span>
                        </Link>
                        <h1 className="text-3xl font-syne font-extrabold text-white mb-2">Welcome Back</h1>
                        <p className="text-t2 text-sm px-4">Continue your skill-trading journey with the community.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-mono uppercase tracking-widest text-t2 ml-1">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-t2 group-focus-within:text-primary transition-colors" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="demo@yunetra.in"
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all font-sans"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-xs font-mono uppercase tracking-widest text-t2">Password</label>
                                <Link href="#" className="text-[10px] font-sans text-primary/70 hover:text-primary transition-colors">Forgot Password?</Link>
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-t2 group-focus-within:text-accent transition-colors" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/20 focus:outline-none focus:border-accent/50 focus:bg-white/10 transition-all font-sans"
                                />
                            </div>
                        </div>

                        <GradientButton
                            type="submit"
                            disabled={isLoading}
                            className="w-full group"
                        >
                            {isLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    <span>Sign In</span>
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </GradientButton>
                    </form>

                    <div className="mt-10 pt-8 border-t border-white/10 text-center">
                        <p className="text-t2 text-sm">
                            Don't have an account?{" "}
                            <Link href="/register" className="text-primary font-bold hover:underline underline-offset-4">Get Started</Link>
                        </p>
                    </div>
                </div>

                <div className="mt-8 flex items-center justify-center gap-2 grayscale opacity-50">
                    <Sparkles className="w-4 h-4 text-warning" />
                    <span className="text-[10px] font-mono text-t2 uppercase tracking-tighter">Trusted by 2400+ Students across India</span>
                </div>
            </motion.div>
        </div>
    );
}
