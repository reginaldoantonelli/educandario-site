import React from 'react';
import { X } from 'lucide-react';

interface ContentModalProps {
    isOpen: boolean;
    onClose: () => void;
    data: {
        title: string;
        description: string;
        fulldescription: string;
        image: string;
        category?: string;
    } | null;
}

const ContentModal: React.FC<ContentModalProps> = ({ isOpen, onClose, data }) => {
    if (!isOpen || !data) return null;

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-300">
                
                {/* Container da Imagem com proporção 16:9 */}
                <div className="relative w-full aspect-video shrink-0 overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <img 
                        src={data.image} 
                        alt={data.title} 
                        className="w-full h-full object-cover object-center transition-transform duration-700"
                    />
                    
                    {/* Botão de fechar flutuante sobre a imagem */}
                    <button 
                        onClick={onClose}
                        className="absolute top-4 right-4 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full backdrop-blur-md transition-all shadow-lg"
                        aria-label="Fechar"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Área de Conteúdo com Scroll Interno se necessário */}
                <div className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar">
                    <div className="flex flex-col gap-4">
                        {data.category && (
                            <span className="inline-block w-fit text-blue-600 dark:text-blue-400 font-bold text-xs uppercase tracking-widest bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full">
                                {data.category}
                            </span>
                        )}
                        
                        <h2 className="text-2xl md:text-4xl font-black text-slate-900 dark:text-white leading-tight">
                            {data.title}
                        </h2>
                        
                        <div className="h-1 w-12 bg-blue-600 rounded-full mb-2"></div>
                        
                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-base md:text-lg">
                            {data.fulldescription}
                        </p>
                    </div>
                </div>

                {/* Rodapé fixo */}
                <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex justify-end">
                    <button
                        onClick={onClose}
                        className="w-full md:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors shadow-lg shadow-blue-500/20"
                    >
                        Entendido
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ContentModal;