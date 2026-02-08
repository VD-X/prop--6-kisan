import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sprout, Package, Truck, ShoppingBag, ArrowRight } from 'lucide-react';

const TradeAnimation = () => {
    return (
        <div className="w-full max-w-4xl mx-auto py-12 px-4 overflow-hidden">
            <div className="relative flex items-center justify-between gap-4 md:gap-12">
                {/* Connection Line */}
                <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-nature-200 -translate-y-1/2 z-0 hidden md:block" />

                {/* --- FARMER STAGE --- */}
                <div className="relative z-10 flex flex-col items-center">
                    <motion.div
                        className="w-16 h-16 md:w-20 md:h-20 bg-nature-100 rounded-2xl border-2 border-nature-300 flex items-center justify-center shadow-lg"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <AnimatePresence mode="wait">
                            <motion.div
                                key="farmer-icon"
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: -20, opacity: 0 }}
                                transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                            >
                                <Sprout className="w-8 h-8 md:w-10 md:h-10 text-nature-600" />
                            </motion.div>
                        </AnimatePresence>
                    </motion.div>
                    <span className="mt-2 text-xs md:text-sm font-bold text-nature-800">1. Harvest</span>
                    <motion.div
                        className="absolute -top-4 -right-4"
                        animate={{
                            scale: [1, 1.2, 1],
                            rotate: [0, 10, -10, 0]
                        }}
                        transition={{ duration: 3, repeat: Infinity }}
                    >
                        <div className="bg-nature-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold shadow-sm">Grade A</div>
                    </motion.div>
                </div>

                {/* --- TRANSPORT STAGE --- */}
                <div className="relative z-10 flex flex-col items-center flex-1">
                    <div className="relative w-full h-16 md:h-20 flex items-center justify-center overflow-hidden bg-slate-50/50 rounded-full border border-slate-100">
                        <motion.div
                            className="flex items-center gap-2"
                            animate={{
                                x: [-200, 200]
                            }}
                            transition={{
                                duration: 4,
                                repeat: Infinity,
                                ease: "linear"
                            }}
                        >
                            <Truck className="w-8 h-8 md:w-10 md:h-10 text-orange-500" />
                            <motion.div
                                animate={{ y: [0, -4, 0] }}
                                transition={{ duration: 0.5, repeat: Infinity }}
                            >
                                <Package className="w-5 h-5 md:w-6 md:h-6 text-orange-600" />
                            </motion.div>
                        </motion.div>
                    </div>
                    <span className="mt-2 text-xs md:text-sm font-bold text-slate-600">2. Secure Transport</span>
                </div>

                {/* --- BUYER STAGE --- */}
                <div className="relative z-10 flex flex-col items-center">
                    <motion.div
                        className="w-16 h-16 md:w-20 md:h-20 bg-blue-100 rounded-2xl border-2 border-blue-300 flex items-center justify-center shadow-lg"
                        animate={{
                            scale: [1, 1.05, 1],
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        <motion.div
                            animate={{
                                rotate: [0, -5, 5, 0]
                            }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                        >
                            <ShoppingBag className="w-8 h-8 md:w-10 md:h-10 text-blue-600" />
                        </motion.div>
                    </motion.div>
                    <span className="mt-2 text-xs md:text-sm font-bold text-blue-800">3. Fair Delivery</span>
                    <motion.div
                        className="absolute -top-4 -right-4"
                        animate={{
                            y: [0, -5, 0],
                            opacity: [0, 1, 0]
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        <div className="bg-blue-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold shadow-sm">Verified</div>
                    </motion.div>
                </div>
            </div>

            <div className="mt-12 text-center">
                <div className="inline-flex items-center gap-2 px-6 py-2 bg-white rounded-full border border-nature-200 shadow-sm text-sm font-medium text-slate-600">
                    <span>Farmer Lists</span>
                    <ArrowRight className="w-4 h-4 text-nature-400" />
                    <span>Transparent Bidding</span>
                    <ArrowRight className="w-4 h-4 text-nature-400" />
                    <span>Buyer Receives</span>
                </div>
            </div>
        </div>
    );
};

export default TradeAnimation;
