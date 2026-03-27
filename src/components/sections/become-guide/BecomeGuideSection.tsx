import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Map, DollarSign, Users, ArrowRight, Star } from 'lucide-react';

const BecomeGuideSection: React.FC = () => {
    return (
        <section className="relative min-h-screen bg-gray-900 text-white overflow-hidden flex flex-col lg:flex-row">
            {/* Left Content Side */}
            <div className="w-full lg:w-1/2 pt-32 pb-12 px-6 lg:p-16 xl:p-24 flex flex-col justify-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                >
                    <div className="flex items-center gap-2 mb-6">
                        <span className="h-px w-8 bg-yellow-400"></span>
                        <span className="text-yellow-400 font-medium tracking-wider uppercase text-sm">Join the Community</span>
                    </div>

                    <h2 className="text-3xl lg:text-6xl font-bold mb-6 leading-tight">
                        Share Your World, <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-200">
                            Your Way.
                        </span>
                    </h2>

                    <p className="text-gray-400 text-lg mb-8 max-w-xl leading-relaxed">
                        Turn your local knowledge into unforgettable experiences for travelers.
                        Become a guide with UnchartedTravel and start earning while doing what you love.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-8 sm:mb-12">
                        <Link href="/register/guide" className="group bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-3 px-6 sm:py-4 sm:px-8 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-yellow-400/20 text-sm sm:text-base">
                            Become a Guide
                            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>

                    </div>

                    {/* Benefits Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        {[
                            { icon: DollarSign, title: "Earn on your terms", desc: "Set your own prices and schedule." },
                            { icon: Map, title: "Create unique tours", desc: "Design experiences you're passionate about." },
                            { icon: Users, title: "Meet global travelers", desc: "Connect with people from around the world." }
                        ].map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                                viewport={{ once: true }}
                                className="p-3 sm:p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors"
                            >
                                <item.icon className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-400 mb-2 sm:mb-3" />
                                <h3 className="font-bold text-base sm:text-lg mb-1">{item.title}</h3>
                                <p className="text-xs sm:text-sm text-gray-400">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Right Image Side */}
            <div className="w-full lg:w-1/2 relative min-h-[75vh] lg:min-h-screen">
                <img
                    src="/assets/become-a-guide-main-page.jpg"
                    alt="Local Guide"
                    className="absolute inset-0 w-full h-full object-cover [mask-image:linear-gradient(to_bottom,transparent,black_50%)] lg:[mask-image:linear-gradient(to_right,transparent,black_50%)]"
                />


            </div>
        </section>
    );
};

export default BecomeGuideSection;
