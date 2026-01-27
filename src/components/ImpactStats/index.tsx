import React from 'react';
import { Users, Calendar, BookOpen, Heart } from 'lucide-react';

interface StatItem {
    icon: React.ReactNode;
    value: string;
    label: string;
}

const ImpactStats: React.FC = () => {
    const stats: StatItem[] = [
        {
            icon: <Calendar className="text-orange-500" size={32} />,
            value: "60+",
            label: "Anos de História"
        },
        {
            icon: <Users className="text-orange-500" size={32} />,
            value: "260",
            label: "Crianças Atendidas"
        },
        {
            icon: <BookOpen className="text-orange-500" size={32} />,
            value: "10+",
            label: "Projetos Ativos"
        },
        {
            icon: <Heart className="text-orange-500" size={32} />,
            value: "100%",
            label: "Dedicação e Amor"
        }
    ];

    return (
        <section className="relative z-20 -mt-12 pb-12">
            <div className="max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    {stats.map((stat, index) => (
                        <div 
                            key={index} 
                            className="bg-white rounded-2xl md:rounded-3xl p-4 md:p-8 shadow-xl border border-slate-100 flex flex-col items-center text-center justify-center min-h-35 md:min-h-50"
                            >
                            <div className="bg-orange-50 p-2 md:p-3 rounded-xl mb-2 md:mb-4">
                                {/* Renderiza o ícone aqui, ajustando o tamanho */}
                                {stat.icon}
                            </div>
                            
                            <span className="text-2xl md:text-4xl font-black text-slate-900 leading-none">
                                {stat.value}
                            </span>
                            
                            <p className="text-[10px] md:text-sm font-bold uppercase tracking-wider text-slate-500 mt-1 md:mt-2">
                                {stat.label}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ImpactStats;