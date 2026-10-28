import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Map, DollarSign, Users, ArrowRight } from 'lucide-react';

const BecomeGuideSection: React.FC = () => {
    return (
        <section className="relative min-h-screen bg-black text-white overflow-hidden flex flex-col lg:flex-row border-b border-white/[0.08]">
            {/* Left Content Side */}
            <div className="w-full lg:w-1/2 pt-36 pb-16 px-6 sm:px-12 lg:p-16 xl:p-24 flex flex-col justify-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="inline-flex items-center gap-2 mb-6">
                        <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-white/45">
                            Native Master Registry &middot; Phase 01
                        </span>
                    </div>

                    <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-normal mb-6 leading-[1.05] tracking-tight text-white">
                        Share your mountains, <br />
                        <span className="italic text-white/90">your way.</span>
                    </h1>

                    <p className="font-sans text-white/60 text-base sm:text-lg mb-10 max-w-xl leading-relaxed font-normal">
                        Transform your generational mountain instincts into enduring, sovereign livelihoods. Partner directly with conscious global wanderers without agency brokerage fees.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 mb-16">
                        <Link
                            href="/register/guide"
                            className="group bg-white text-black hover:bg-white/90 font-medium py-3.5 px-8 text-xs uppercase tracking-widest transition-all duration-200 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.15)]"
                        >
                            <span>Initiate Guide Registry</span>
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    {/* Benefits Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {[
                            { index: "01", icon: DollarSign, title: "Sovereign Tariffs", desc: "Keep 100% of your agreed price. Direct payment." },
                            { index: "02", icon: Map, title: "Custom Trajectories", desc: "Design routes you know and cherish intimately." },
                            { index: "03", icon: Users, title: "Mindful Explorers", desc: "Guide wanderers who respect mountain sacredness." }
                        ].map((item, idx) => (
                            <div
                                key={idx}
                                className="p-5 border border-white/[0.08] bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.03] transition-colors"
                            >
                                <div className="text-[10px] font-mono text-white/40 mb-3">{item.index}</div>
                                <h3 className="font-display text-xl font-normal text-white mb-1.5">{item.title}</h3>
                                <p className="text-xs text-white/50 leading-relaxed font-sans">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Right Image Side */}
            <div className="w-full lg:w-1/2 relative min-h-[60vh] lg:min-h-screen border-t lg:border-t-0 lg:border-l border-white/10">
                <img
                    src="/assets/become-a-guide-main-page.jpg"
                    alt="Generational Himalayan Guide"
                    className="absolute inset-0 w-full h-full object-cover filter contrast-[1.05]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent lg:bg-gradient-to-r lg:from-black lg:via-black/20 lg:to-transparent" />
                <div className="absolute bottom-6 right-6 z-10 text-right">
                    <span className="text-[10px] font-mono uppercase tracking-widest px-3 py-1 bg-black/75 border border-white/20 text-white/80 backdrop-blur-md">
                        Field Leader Lineage &middot; Vetted
                    </span>
                </div>
            </div>
        </section>
    );
};

export default BecomeGuideSection;
