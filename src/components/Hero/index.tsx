import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Play } from 'lucide-react';
import heroIlustracao from '@/assets/fachada-ilustracao.webp';

const Hero: React.FC = () => {
    return (
        <section className="relative w-full h-[90vh] flex items-center overflow-hidden bg-slate-900">
        {/* Imagem de Fundo com Overlay */}
        <div className="absolute inset-0 z-0">
            <img
            src={heroIlustracao}
            alt="Fachada do Educandário Nossa Senhora Aparecida com crianças"
            className="w-full h-full object-cover opacity-60"
            width={1920}
            height={1080}
            fetchPriority="high"
            loading="eager"
            />
            <div className="absolute inset-0 bg-linear-to-r from-blue-900/90 to-transparent md:from-blue-900/80" />
        </div>

        <div className="container mx-auto px-4 md:px-6 z-10">
            <div className="max-w-3xl">
            <span className="inline-block px-4 py-1.5 mb-6 text-sm font-bold tracking-wider text-blue-100 uppercase bg-blue-700/50 backdrop-blur-md rounded-full">
                Há mais de 60 anos transformando vidas
            </span>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-tight">
                Educar é semear o <br />
                <span className="text-orange-400">nosso futuro.</span>
            </h1>
            
            <p className="mt-6 text-lg md:text-xl text-slate-200 max-w-xl leading-relaxed">
                Oferecemos apoio pedagógico, oficinas e muito amor para mais de 260 crianças em Itapira. Ajude-nos a continuar essa missão.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <Link
                to="/contato"
                className="flex items-center justify-center gap-2 bg-orange-700 hover:bg-orange-800 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105 shadow-xl shadow-orange-700/20"
                >
                Quero Contribuir
                <ArrowRight size={20} />
                </Link>
                
                <button className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/30 px-8 py-4 rounded-xl font-bold text-lg transition-all">
                <Play size={20} fill="white" />
                Conheça nossa história
                </button>
            </div>
            </div>
        </div>

        {/* Detalhe estético no rodapé do Hero */}
        <div className="absolute bottom-0 left-0 w-full h-24 bg-linear-to-t from-slate-50 to-transparent" />
        </section>
    );
};

export default Hero;