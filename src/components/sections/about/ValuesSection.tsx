import React from 'react';
import { Heart, Globe, Users, Compass } from 'lucide-react';

const values = [
    {
        icon: Users,
        title: 'Local Empowerment',
        tag: '01 / Fellowship',
        description: 'Direct economic distribution to native guides and mountain homestays. Zero corporate broker commissions.'
    },
    {
        icon: Heart,
        title: 'Alpine Wilderness Safety',
        tag: '02 / Protocol',
        description: 'Every trail leader is trained in high-altitude medicine, frostbite prevention, and emergency descent lines.'
    },
    {
        icon: Globe,
        title: 'Leave-No-Trace Doctrine',
        tag: '03 / Ecology',
        description: 'Zero plastic trail waste, absolute respect for fragile alpine meadows, and zero-carbon trail etiquette.'
    },
    {
        icon: Compass,
        title: 'Living Oral History',
        tag: '04 / Heritage',
        description: 'Uncovering the sacred mountain mythologies, high passes, and oral knowledge passed across generations.'
    }
];

const ValuesSection: React.FC = () => {
    return (
        <section className="py-24 md:py-32 bg-black text-white">
            <div className="container mx-auto px-6 md:px-12">
                <div className="max-w-6xl mx-auto">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
                        <div>
                            <div className="flex items-center space-x-3 mb-3">
                                <span className="text-xs uppercase tracking-widest text-white/45 font-mono">
                                    04 / Foundational Ethics
                                </span>
                            </div>
                            <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-normal tracking-tight text-white leading-tight">
                                Guiding <span className="italic text-white/90">Principles.</span>
                            </h2>
                        </div>
                        <p className="text-sm text-white/55 max-w-sm font-sans leading-relaxed">
                            These core doctrines shape every trail we archive, every guide we embrace, and every step taken above tree line.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {values.map((val) => {
                            const Icon = val.icon;
                            return (
                                <div
                                    key={val.title}
                                    className="border border-white/[0.08] bg-white/[0.02] p-8 flex flex-col justify-between hover:border-white/25 hover:bg-white/[0.04] transition duration-200 group"
                                >
                                    <div>
                                        <div className="flex items-center justify-between mb-8">
                                            <div className="h-9 w-9 border border-white/15 bg-white/[0.03] flex items-center justify-center text-white group-hover:border-white/35 transition duration-150">
                                                <Icon className="w-4 h-4 text-white/80" />
                                            </div>
                                            <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">
                                                {val.tag}
                                            </span>
                                        </div>

                                        <h3 className="font-display text-2xl font-normal text-white mb-3">
                                            {val.title}
                                        </h3>
                                        <p className="text-sm text-white/55 leading-relaxed font-sans">
                                            {val.description}
                                        </p>
                                    </div>

                                    <div className="pt-6 mt-8 border-t border-white/[0.06] text-[10px] font-mono text-white/40 uppercase tracking-widest">
                                        Enduring Standard
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ValuesSection;
