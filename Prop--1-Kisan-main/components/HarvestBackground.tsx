import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CloudFigure = ({ color, duration, delay, y, scale = 1, reverse = false, isSunCloud = false }: any) => (
    <motion.div
        className={`absolute ${isSunCloud ? 'z-20' : 'z-25'}`}
        style={{ top: y }}
        initial={{ x: reverse ? '130%' : '-30%', opacity: 0 }}
        animate={{ x: reverse ? '-30%' : '130%', opacity: 1 }}
        transition={{ duration, delay, repeat: Infinity, ease: "linear" }}
    >
        <div className="relative" style={{ transform: `scale(${scale})` }}>
            <div className="w-24 h-24 rounded-full absolute -top-8 left-0" style={{ backgroundColor: color }} />
            <div className="w-32 h-32 rounded-full absolute -top-12 left-10" style={{ backgroundColor: color }} />
            <div className="w-20 h-20 rounded-full absolute -top-4 left-32" style={{ backgroundColor: color }} />
            <div className="w-48 h-12 rounded-full absolute top-0 left-0" style={{ backgroundColor: color }} />
        </div>
    </motion.div>
);

const Leaf = ({ i, type }: { i: number, type: 'single' | 'cluster' | 'orange' }) => {
    const color = type === 'orange' ? '#ea580c' : '#16a34a';
    return (
        <motion.div
            className="absolute z-50 pointer-events-none"
            style={{
                top: `${Math.random() * 100}%`,
                left: '-10%',
            }}
            initial={{ x: '-10%', opacity: 0, rotate: 0 }}
            animate={{
                x: '110vw',
                y: [0, 100, -100, 0],
                opacity: [0, 1, 1, 0],
                rotate: [0, 360, 720]
            }}
            transition={{
                duration: 6 + Math.random() * 4,
                delay: i * 0.4,
                repeat: Infinity,
                ease: "linear"
            }}
        >
            {type === 'single' && (
                <svg width="24" height="24" viewBox="0 0 24 24" fill={color}>
                    <path d="M17,8C8,10 5.9,16.17 5.1,21C5.1,21 5,22 4,22C3,22 3,21 3,21C3,21 3,11 10,6C13,3.83 16,3 17,3C17,3 21,3 21,7C21,8 17,8 17,8Z" />
                </svg>
            )}
            {type === 'cluster' && (
                <div className="relative">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill={color} className="absolute top-0 left-0">
                        <path d="M17,8C8,10 5.9,16.17 5.1,21C5.1,21 5,22 4,22C3,22 3,21 3,21C3,21 3,11 10,6C13,3.83 16,3 17,3C17,3 21,3 21,7C21,8 17,8 17,8Z" />
                    </svg>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="#22c55e" className="absolute -top-2 -left-2 rotate-45">
                        <path d="M17,8C8,10 5.9,16.17 5.1,21C5.1,21 5,22 4,22C3,22 3,21 3,21C3,21 3,11 10,6C13,3.83 16,3 17,3C17,3 21,3 21,7C21,8 17,8 17,8Z" />
                    </svg>
                </div>
            )}
            {type === 'orange' && (
                <svg width="30" height="30" viewBox="0 0 24 24" fill={color}>
                    <path d="M21,11C21,11 19,10 17,10C17,10 16,10 14,12C12,14 12,16 12,16C12,16 12,14 10,12C8,10 7,10 7,10C5,10 3,11 3,11C3,11 4,12 5,14C6,16 6,17 6,17C6,17 4,17 2,18C2,18 3,19 5,20C7,21 9,21 9,21C9,21 11,21 13,20C15,19 16,18 16,18C16,18 18,18 20,17C20,17 19,16 18,14C17,12 21,11 21,11Z" />
                </svg>
            )}
        </motion.div>
    );
};

const Bird = ({ i }: { i: number }) => (
    <motion.div
        className="absolute z-25 pointer-events-none"
        style={{ top: `${10 + Math.random() * 30}%`, left: '110%' }}
        animate={{
            x: '-120vw',
            y: [0, -20, 0]
        }}
        transition={{
            duration: 10 + Math.random() * 5,
            delay: i * 2,
            repeat: Infinity,
            ease: "linear"
        }}
    >
        <div className="relative">
            <motion.svg
                width="30" height="20" viewBox="0 0 24 24" fill="black"
                animate={{ rotateX: [0, 60, 0] }}
                transition={{ duration: 0.4, repeat: Infinity }}
            >
                <path d="M12,2L4.5,20.29L5.21,21L12,18L18.79,21L19.5,20.29L12,2Z" />
            </motion.svg>
        </div>
    </motion.div>
);

const SunFigure = ({ stage }: { stage: number }) => (
    <motion.div
        className="absolute left-1/2 -translate-x-1/2 z-10"
        initial={{ y: 500, opacity: 0 }}
        animate={{
            y: stage === 3 ? -120 : 500,
            opacity: stage === 3 ? 1 : 0
        }}
        transition={{ duration: 15, ease: "easeInOut" }}
    >
        <div className="relative">
            {/* Sun Circle matching reference */}
            <div className="w-56 h-56 bg-yellow-400 rounded-full shadow-[0_0_180px_rgba(250,204,21,1)] border-8 border-yellow-200" />

            {/* Radiant Spikes (Manual implementation for figurative look) */}
            {[...Array(8)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute top-1/2 left-1/2 w-4 h-16 bg-yellow-300 rounded-full origin-bottom"
                    style={{ rotate: i * 45, x: '-50%', y: '-160%' }}
                    animate={{ scaleY: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                />
            ))}

            <motion.div
                className="absolute inset-[-100px] bg-red-600/20 rounded-full blur-3xl opacity-40"
                animate={{ scale: [1, 1.8, 1] }}
                transition={{ duration: 8, repeat: Infinity }}
            />
        </div>
    </motion.div>
);

const WindBreeze = ({ i }: { i: number }) => (
    <motion.div
        className="absolute z-30"
        style={{ top: `${20 + Math.random() * 50}%`, left: '-15%' }}
        initial={{ x: '-15%', opacity: 0 }}
        animate={{ x: '115vw', opacity: [0, 1, 1, 0] }}
        transition={{ duration: 4.5, delay: i * 1, repeat: Infinity, ease: "easeInOut" }}
    >
        <svg width="200" height="80" viewBox="0 0 200 80" fill="none">
            <motion.path
                d="M0 40C40 20 80 60 120 40C160 20 200 60 240 40"
                stroke="white"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeOpacity="0.4"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 3, repeat: Infinity }}
            />
        </svg>
    </motion.div>
);

const Lightning = () => (
    <motion.div
        className="fixed inset-0 z-40 bg-white pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.9, 0, 0.6, 0] }}
        transition={{ duration: 0.3, repeat: Infinity, repeatDelay: 7 }}
    />
);

const HarvestBackground = () => {
    const [stage, setStage] = useState(0); // 0: Wind, 1: Storm, 2: Rain, 3: Sunrise

    useEffect(() => {
        const timer = setInterval(() => {
            setStage((prev) => (prev + 1) % 4);
        }, 18000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
            {/* Environment Background */}
            <motion.div
                className="absolute inset-0 transition-colors duration-[8000ms]"
                animate={{
                    background: stage === 0
                        ? 'linear-gradient(to bottom, #f0fdf4, #dcfce7)'
                        : stage === 1 || stage === 2
                            ? 'linear-gradient(to bottom, #020617, #0f172a)'
                            : 'linear-gradient(to bottom, #7f1d1d, #ea580c, #fbbf24)' // Deep Cinematic Sunrise Wash
                }}
            />

            {/* --- BIRDS (Wind & Sunrise) --- */}
            {(stage === 0 || stage === 3) && Array.from({ length: 5 }).map((_, i) => (
                <Bird key={`bird-${i}`} i={i} />
            ))}

            {/* --- LEAVES (Wind, Storm & Sunrise) --- */}
            {(stage === 0 || stage === 1 || stage === 3) && Array.from({ length: 18 }).map((_, i) => (
                <Leaf
                    key={`leaf-${i}`}
                    i={i}
                    type={i % 3 === 0 ? 'single' : i % 3 === 1 ? 'cluster' : 'orange'}
                />
            ))}

            {/* --- WIND BREEZE --- */}
            {stage === 0 && Array.from({ length: 8 }).map((_, i) => (
                <WindBreeze key={`wind-${i}`} i={i} />
            ))}

            {/* --- CLOUDS --- */}
            <div className="absolute top-0 left-0 right-0 h-full overflow-hidden">
                <AnimatePresence>
                    {(stage === 1 || stage === 2) && (
                        <>
                            <CloudFigure color="#1e293b" duration={25} delay={0} y="10%" scale={3} />
                            <CloudFigure color="#334155" duration={22} delay={5} y="20%" scale={2.5} reverse={true} />
                            <CloudFigure color="#0f172a" duration={30} delay={8} y="0%" scale={4} />
                            {stage === 1 && <Lightning />}
                        </>
                    )}
                    {stage === 3 && (
                        <>
                            {/* Sun Rises THROUGH clouds */}
                            <CloudFigure color="#fee2e2" duration={50} delay={0} y="10%" scale={4} isSunCloud={true} />
                            <CloudFigure color="#fff7ed" duration={45} delay={10} y="20%" scale={3} reverse={true} />
                            <CloudFigure color="#fef3c7" duration={55} delay={5} y="15%" scale={3.5} />
                        </>
                    )}
                </AnimatePresence>
            </div>

            {/* --- SUNRISE SUN --- */}
            {stage === 3 && <SunFigure stage={stage} />}

            {/* --- RAIN --- */}
            <AnimatePresence>
                {stage === 2 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-30"
                    >
                        {[...Array(150)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="absolute w-[2px] h-20 bg-blue-500/30 rounded-full"
                                initial={{ top: -100, left: `${Math.random() * 100}%` }}
                                animate={{ top: '120%', x: -40 }}
                                transition={{
                                    duration: 0.5 + Math.random() * 0.2,
                                    repeat: Infinity,
                                    delay: Math.random() * 3,
                                    ease: "linear"
                                }}
                            />
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* --- RADIANT WASH (Sunrise) --- */}
            {stage === 3 && (
                <motion.div
                    className="absolute inset-0 z-15 bg-gradient-to-t from-red-700/40 via-orange-600/30 to-yellow-500/10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 10 }}
                />
            )}

            {/* --- CROPS --- */}
            <div className="absolute bottom-0 left-0 right-0 flex justify-around items-end h-[40vh] z-45">
                {[...Array(22)].map((_, i) => (
                    <motion.div key={i} className="relative flex flex-col items-center">
                        <motion.div
                            className="w-2.5 bg-amber-950/40 rounded-full origin-bottom"
                            style={{ height: `${140 + Math.random() * 180}px` }}
                            animate={{
                                rotate: stage === 0 ? [-15, 15, -15] : stage === 2 ? [-4, 4, -4] : [-8, 8, -8],
                            }}
                            transition={{
                                duration: stage === 0 ? 1 : 2.5,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        >
                            <div className="absolute top-0 -left-5 flex flex-col -space-y-2">
                                {[...Array(8)].map((_, j) => (
                                    <div key={j} className="flex gap-2">
                                        <div className="w-5 h-8 bg-amber-400/50 rounded-full rotate-45 shadow-sm" />
                                        <div className="w-5 h-8 bg-amber-500/50 rounded-full -rotate-45 shadow-sm" />
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </motion.div>
                ))}
            </div>

            {/* Nostalgic Paper Grains */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')] opacity-25 contrast-150 pointer-events-none z-60" />
        </div>
    );
};

export default HarvestBackground;
