"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function CustomCursor() {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const updatePosition = (e: MouseEvent) => {
            setPosition({ x: e.clientX, y: e.clientY });
            if (!isVisible) setIsVisible(true);
        };

        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            // Check if hovering over interactive elements
            if (
                target.closest("a") ||
                target.closest("button") ||
                target.closest('[role="button"]') ||
                target.closest("input")
            ) {
                setIsHovering(true);
            } else {
                setIsHovering(false);
            }
        };

        const handleMouseLeave = () => setIsVisible(false);

        window.addEventListener("mousemove", updatePosition);
        window.addEventListener("mouseover", handleMouseOver);
        document.body.addEventListener("mouseleave", handleMouseLeave);

        return () => {
            window.removeEventListener("mousemove", updatePosition);
            window.removeEventListener("mouseover", handleMouseOver);
            document.body.removeEventListener("mouseleave", handleMouseLeave);
        };
    }, [isVisible]);

    if (!isVisible) return null;

    return (
        <motion.div
            className={`custom-cursor ${isHovering ? "hovering" : ""}`}
            animate={{
                x: position.x,
                y: position.y,
            }}
            transition={{
                type: "spring",
                stiffness: 150,
                damping: 15,
                mass: 0.1,
            }}
        />
    );
}
