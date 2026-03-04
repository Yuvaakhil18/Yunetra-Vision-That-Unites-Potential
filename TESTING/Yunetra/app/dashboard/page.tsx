"use client";

import { motion } from "framer-motion";
import CountUp from "react-countup";
import { Coins, Layers, Star, ShieldCheck, ArrowRight, UserPlus, Calendar as CalendarIcon, Target, Search, Users } from "lucide-react";
import Link from "next/link";
import { UserCard } from "@/components/UserCard";
import { GradientButton } from "@/components/ui/gradient-button";

export default function Dashboard({ user }: { user: any }) {
    const userName = user?.name?.split(" ")[0] || "Student";

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good morning";
        if (hour < 18) return "Good afternoon";
        return "Good evening";
    };

    // Consistent date formatting to avoid hydration errors
    const now = new Date();
    const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const currentDate = `${weekdays[now.getDay()]} ${now.getDate()} ${months[now.getMonth()]}`;

    const cardsContainer = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05
            }
        }
    };

    const cardItem = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <div className="max-w-6xl mx-auto pb-20">

            {/* Greeting Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
                <div>
                    <motion.h1
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-3xl md:text-5xl font-syne font-extrabold tracking-tight mb-2"
                    >
                        {getGreeting()}, <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">{userName}</span> <span className="text-warning">✦</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.05 }}
                        className="font-mono text-t2 text-sm uppercase tracking-widest"
                    >
                        {currentDate}
                    </motion.p>
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="px-4 py-2 bg-primary/10 border border-primary/30 rounded-xl flex items-center gap-3 text-primary  hover:bg-primary/20 transition-colors pointer-events-auto"
                >
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    <span className="font-sans font-bold text-sm tracking-wide">3 New Match Requests</span>
                </motion.div>
            </div>

            {/* Stats Row */}
            <motion.div
                variants={cardsContainer}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12"
            >
                {[
                    { label: "Skill Credits", value: user?.skillCredits || 3, icon: <Coins className="w-6 h-6 text-warning drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]" />, glow: "hover:shadow-[0_0_20px_rgba(245,158,11,0.15)] hover:border-warning/30" },
                    { label: "Sessions Done", value: 0, icon: <Layers className="w-6 h-6 text-accent drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]" />, glow: "hover:shadow-[0_0_20px_rgba(99,102,241,0.15)] hover:border-accent/30" },
                    { label: "Your Rating", value: 0.0, decimals: 1, icon: <Star className="w-6 h-6 text-primary drop-shadow-[0_0_8px_rgba(56,189,248,0.5)]" />, glow: "hover:shadow-[0_0_20px_rgba(56,189,248,0.15)] hover:border-primary/30" },
                    { label: "Verified Skills", value: 0, icon: <ShieldCheck className="w-6 h-6 text-danger drop-shadow-[0_0_8px_rgba(244,63,94,0.5)]" />, glow: "hover:shadow-[0_0_20px_rgba(244,63,94,0.15)] hover:border-danger/30" }
                ].map((stat, i) => (
                    <motion.div key={i} variants={cardItem} className={`p-6 bg-subtle border border-[rgba(255,255,255,0.06)] rounded-2xl flex flex-col justify-between transition-all hover:bg-card  hover:-translate-y-1 ${stat.glow}`}>
                        <div className="flex justify-between items-start mb-4">
                            {stat.icon}
                            <span className="text-white/10 group-hover:text-white/20 transition-colors">#{i + 1}</span>
                        </div>
                        <div>
                            <div className="text-4xl font-syne font-black text-t1 mb-1">
                                <CountUp end={stat.value} decimals={stat.decimals || 0} duration={2} />
                            </div>
                            <div className="font-sans text-xs text-t2 font-semibold uppercase tracking-wider">{stat.label}</div>
                        </div>
                    </motion.div>
                ))}
            </motion.div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

                {/* Left Column - Matches & Sessions */}
                <div className="xl:col-span-2 space-y-12">

                    {/* Top Matches Preview */}
                    <section>
                        <div className="flex justify-between items-end mb-6">
                            <h2 className="text-2xl font-syne font-bold">Your Best Matches Today</h2>
                            <Link href="/match" className="text-primary font-sans text-sm font-semibold hover:underline ">See All Matches →</Link>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Show placeholders if no data since this is static layout building */}
                            <UserCard
                                name="Rahul Deshmukh"
                                college="VJTI Mumbai"
                                year="3rd Year"
                                compatibilityScore={88}
                                rating={4.9}
                                sessionsCount={12}
                                skillsTeach={["Python", "DSA"]}
                                skillsLearn={["React", "UI Design"]}
                            />
                            <UserCard
                                name="Priya Sharma"
                                college="VIT Vellore"
                                year="2nd Year"
                                compatibilityScore={74}
                                rating={4.7}
                                sessionsCount={8}
                                skillsTeach={["Figma", "Canva"]}
                                skillsLearn={["Node.js"]}
                            />
                        </div>
                    </section>

                    {/* Recent Sessions */}
                    <section>
                        <div className="flex justify-between items-end mb-6">
                            <h2 className="text-2xl font-syne font-bold">Recent Sessions</h2>
                            <Link href="/sessions" className="text-accent font-sans text-sm font-semibold hover:underline ">View All Sessions →</Link>
                        </div>

                        <div className="bg-subtle border border-[rgba(255,255,255,0.06)] rounded-2xl overflow-hidden shadow-sm">
                            {/* Empty placeholder for now */}
                            <div className="p-8 text-center text-t2 flex flex-col items-center">
                                <div className="w-16 h-16 rounded-full bg-card border border-[rgba(255,255,255,0.06)] border-dashed flex items-center justify-center mb-4">
                                    <CalendarIcon className="w-6 h-6 text-t2/50" />
                                </div>
                                <h3 className="font-syne font-bold text-lg text-t1 mb-1">No sessions yet</h3>
                                <p className="font-sans text-sm max-w-sm">When you book or complete a skill exchange session, it will appear right here.</p>
                                <GradientButton asChild>
                                    <Link href="/match" className="mt-4">
                                        Find a Match
                                    </Link>
                                </GradientButton>
                            </div>
                        </div>
                    </section>

                </div>

                {/* Right Column - Quick Actions */}
                <aside className="xl:col-span-1">
                    
                    {/* Network Preview */}
                    <section className="mb-8">
                        <div className="flex justify-between items-end mb-4">
                            <h2 className="text-2xl font-syne font-bold">Your Network</h2>
                            <Link href="/network" className="text-primary font-sans text-sm font-semibold hover:underline">View Network →</Link>
                        </div>
                        
                        <div className="bg-subtle border border-[rgba(255,255,255,0.06)] rounded-2xl p-6">
                            {/* Network Stats */}
                            <div className="flex justify-center gap-6 mb-4 font-mono text-sm">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-primary">{user?.followingCount || 0}</div>
                                    <div className="text-t2 text-xs">Following</div>
                                </div>
                                <div className="w-px bg-[rgba(255,255,255,0.06)]" />
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-accent">{user?.followersCount || 0}</div>
                                    <div className="text-t2 text-xs">Followers</div>
                                </div>
                                <div className="w-px bg-[rgba(255,255,255,0.06)]" />
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-warning">
                                        {Math.min(user?.followingCount || 0, user?.followersCount || 0)}
                                    </div>
                                    <div className="text-t2 text-xs">Connected</div>
                                </div>
                            </div>
                            
                            <Link 
                                href="/network" 
                                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary/10 border border-primary/30 rounded-xl text-primary font-sans font-semibold text-sm hover:bg-primary/20 transition-colors"
                            >
                                <Users className="w-4 h-4" />
                                Discover People
                            </Link>
                        </div>
                    </section>
                    
                    <h2 className="text-2xl font-syne font-bold mb-6">Quick Actions</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-4">
                        {[
                            { title: "Find a Match", desc: "Browse students", icon: <Search />, color: "green", href: "/match" },
                            { title: "Book Session", desc: "Schedule time", icon: <CalendarIcon />, color: "purple", href: "/sessions" },
                            { title: "Take Skill Test", desc: "Earn verified badges", icon: <Target />, color: "yellow", href: "/verify" },
                            { title: "Update Profile", desc: "Add skills to learn/teach", icon: <UserPlus />, color: "text", href: `/profile/${user?.id}` },
                        ].map((action, i) => (
                            <Link key={i} href={action.href} className="flex items-center p-4 bg-subtle border border-[rgba(255,255,255,0.06)] rounded-2xl hover:bg-card transition-all  group hover:border-[rgba(255,255,255,0.12)]">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mr-4 transition-transform group-hover:scale-110 shadow-sm ${action.color === 'green' ? 'bg-primary/10 text-primary group-hover:shadow-[0_0_15px_rgba(56,189,248,0.2)]' :
                                    action.color === 'purple' ? 'bg-accent/10 text-accent group-hover:shadow-[0_0_15px_rgba(99,102,241,0.2)]' :
                                        action.color === 'yellow' ? 'bg-warning/10 text-warning group-hover:shadow-[0_0_15px_rgba(245,158,11,0.2)]' :
                                            'bg-white/5 text-white group-hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]'
                                    }`}>
                                    {action.icon}
                                </div>
                                <div>
                                    <h4 className="font-syne font-bold text-[15px] group-hover:text-white transition-colors">{action.title}</h4>
                                    <p className="font-sans text-xs text-t2">{action.desc}</p>
                                </div>
                                <ArrowRight className="w-4 h-4 text-t2 ml-auto group-hover:text-white group-hover:translate-x-1 transition-all" />
                            </Link>
                        ))}
                    </div>

                    <div className="mt-8 p-6 bg-gradient-to-br from-accent/5 to-transparent border border-accent/20 rounded-2xl relative overflow-hidden group">
                        <div className="absolute -inset-10 bg-accent/20 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                        <ShieldCheck className="w-8 h-8 text-accent mb-4 relative z-10" />
                        <h3 className="font-syne font-bold text-lg mb-2 relative z-10">Verify your skills today</h3>
                        <p className="font-sans text-sm text-t2 mb-4 relative z-10">Verified mentors get 4x more session requests. Take a 5-question test now to earn a badge.</p>
                        <GradientButton asChild>
                            <Link href="/verify" className="relative z-10">
                                Start Test
                            </Link>
                        </GradientButton>
                    </div>
                </aside>

            </div>
        </div>
    );
}
