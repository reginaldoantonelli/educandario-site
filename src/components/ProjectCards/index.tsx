import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Project {
    title: string;
    description: string;
    image: string;
    tag: string;
    }

    const projects: Project[] = [
    {
        title: "Inclusão Digital",
        description: "Aulas de informática básica e avançada para preparar nossos alunos para o futuro tecnológico.",
        image: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&q=80",
        tag: "Educação"
    },
    {
        title: "Oficina de Jardinagem",
        description: "Ensinamos o respeito à natureza e técnicas de cultivo sustentável em nossa própria horta.",
        image: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&q=80",
        tag: "Meio Ambiente"
    },
    {
        title: "Biblioteca Ativa",
        description: "Incentivo à leitura com um acervo diversificado e atividades lúdicas de interpretação.",
        image: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&q=80",
        tag: "Cultura"
    },
    {
        title: "Oficina de Capoeira",
        description: "Expressão cultural e disciplina através do esporte e da música ancestral.",
        image: "https://images.unsplash.com/photo-1524594152303-9fd13543fe6e?auto=format&fit=crop&q=80",
        tag: "Cultura"
    },
    {
        title: "Apoio Pedagógico",
        description: "Reforço escolar focado em alfabetização e raciocínio lógico no contraturno.",
        image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80",
        tag: "Educação"
    }
    ];

    const ProjectCards: React.FC = () => {
    const scrollRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
        const { scrollLeft, clientWidth } = scrollRef.current;
        // No mobile, o scroll é um pouco menor para ser mais suave
        const scrollAmount = window.innerWidth < 768 ? clientWidth * 0.8 : clientWidth;
        const scrollTo = direction === 'left' 
            ? scrollLeft - scrollAmount 
            : scrollLeft + scrollAmount;
        
        scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
        }
    };

    return (
        <section id="projetos" className="py-20 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
            <div className="text-center md:text-left mb-12">
            <h2 className="text-blue-900 text-sm font-bold tracking-widest uppercase mb-3">Nossas Atividades</h2>
            <p className="text-3xl md:text-4xl font-black text-slate-800">Projetos que Transformam</p>
            <div className="w-20 h-1.5 bg-orange-500 mx-auto md:mx-0 mt-4 rounded-full"></div>
            </div>

            {/* Container Relativo para posicionar as setas sobre o carrossel */}
            <div className="relative group">
            
            {/* Seta Esquerda - Visível em todos os tamanhos, mas discreta */}
            <button 
                onClick={() => scroll('left')}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-white/80 backdrop-blur-sm border border-slate-200 text-slate-700 shadow-lg hover:bg-blue-600 hover:text-white transition-all active:scale-90"
                aria-label="Anterior"
            >
                <ChevronLeft size={20} />
            </button>

            {/* Seta Direita */}
            <button 
                onClick={() => scroll('right')}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-white/80 backdrop-blur-sm border border-slate-200 text-slate-700 shadow-lg hover:bg-blue-600 hover:text-white transition-all active:scale-90"
                aria-label="Próximo"
            >
                <ChevronRight size={20} />
            </button>

            {/* Container do Carrossel */}
            <div 
                ref={scrollRef}
                className="flex overflow-x-auto gap-4 md:gap-8 scrollbar-hide snap-x snap-mandatory pb-8 touch-pan-x px-4"
            >
                {projects.map((project, index) => (
                <div 
                    key={index} 
                    className="min-w-[85%] md:min-w-100 snap-center md:snap-start group/card bg-slate-50 rounded-3xl overflow-hidden shadow-sm border border-slate-100"
                >
                    <div className="relative h-48 md:h-64 overflow-hidden">
                    <img 
                        src={project.image} 
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-110"
                    />
                    <span className="absolute top-4 left-4 bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase">
                        {project.tag}
                    </span>
                    </div>
                    
                    <div className="p-6 md:p-8">
                    <h3 className="text-xl md:text-2xl font-bold text-slate-800 mb-2 md:mb-3">
                        {project.title}
                    </h3>
                    <p className="text-slate-600 leading-relaxed text-sm md:text-base line-clamp-3">
                        {project.description}
                    </p>
                    <button className="mt-4 md:mt-6 text-blue-700 font-bold flex items-center gap-2 text-sm md:text-base">
                        Saiba mais <span>→</span>
                    </button>
                    </div>
                </div>
                ))}
            </div>
            </div>
        </div>
        </section>
    );
};

export default ProjectCards;