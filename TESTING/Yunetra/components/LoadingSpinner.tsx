"use client";

import { motion } from "framer-motion";

export function LoadingSpinner({ size = 40 }: { size?: number }) {
    return (
        <div className="flex justify-center items-center w-full min-h-[100px]" style={{ width: size, height: size }}>
            <motion.div
                className="relative"
                style={{ width: size, height: size }}
            >
                <motion.span
                    className="absolute inset-0 block rounded-full border-t-2 border-r-2 border-transparent border-t-primary border-r-primary"
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                />
                <motion.span
                    className="absolute inset-2 block rounded-full border-b-2 border-l-2 border-transparent border-b-accent border-l-accent"
                    animate={{ rotate: -360 }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                />
            </motion.div>
        </div>
    );
}
