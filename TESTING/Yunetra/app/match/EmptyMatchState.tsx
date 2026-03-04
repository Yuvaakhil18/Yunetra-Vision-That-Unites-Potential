"use client";

import { motion } from "framer-motion";
import { Ghost, RefreshCcw } from "lucide-react";
import Link from "next/link";

export default function EmptyMatchState({ clearFilters }: { clearFilters: () => void }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full h-[600px] flex flex-col items-center justify-center border border-white/[0.06] border-dashed rounded-[32px] glass-subtle p-8 text-center relative overflow-hidden group"
        >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent/5 blur-[100px] rounded-full pointer-events-none group-hover:bg-accent/10 transition-colors" />

            <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="relative z-10 mb-8"
            >
                <div className="w-24 h-24 rounded-full glass border border-white/[0.06] flex items-center justify-center">
                    <Ghost className="w-10 h-10 text-t2/50 group-hover:text-accent transition-colors" />
                </div>
            </motion.div>

            <h2 className="text-2xl md:text-3xl font-syne font-bold text-white mb-4 relative z-10">No matches found</h2>
            <p className="text-t2 font-sans text-sm max-w-sm mb-8 relative z-10 leading-relaxed">
                We couldn't find anyone matching your exact criteria right now. Try loosening your filters or adding more skills to your profile.
            </p>

            <div className="flex gap-4 relative z-10">
                <button
                    onClick={clearFilters}
                    className="px-6 py-3 rounded-xl glass-btn text-t1 font-sans text-sm font-semibold flex items-center gap-2"
                >
                    <RefreshCcw className="w-4 h-4" /> Clear Filters
                </button>
                <Link
                    href="/profile"
                    className="px-6 py-3 rounded-xl bg-accent/10 backdrop-blur-md border border-accent/20 text-accent font-sans text-sm font-bold hover:bg-accent hover:text-base transition-all shadow-[inset_0_0.5px_0_0_rgba(99,102,241,0.2)] "
                >
                    Update My Skills
                </Link>
            </div>

        </motion.div>
    );
}
