"use client";
import { motion } from "framer-motion";

export function GradientBlob() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <motion.div
        className="absolute w-[800px] h-[800px] rounded-full opacity-30 blur-[100px]"
        style={{
          background:
            "radial-gradient(circle, rgba(99,102,241,0.6) 0%, rgba(168,85,247,0.4) 50%, transparent 70%)",
          top: "20%",
          left: "20%",
        }}
        animate={{
          x: [0, 100, -50, 0],
          y: [0, -50, 100, 0],
          scale: [1, 1.1, 0.9, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full opacity-20 blur-[80px]"
        style={{
          background:
            "radial-gradient(circle, rgba(56,189,248,0.6) 0%, rgba(59,130,246,0.4) 50%, transparent 70%)",
          bottom: "10%",
          right: "10%",
        }}
        animate={{
          x: [0, -70, 30, 0],
          y: [0, 60, -40, 0],
          scale: [1, 1.2, 0.8, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
}
