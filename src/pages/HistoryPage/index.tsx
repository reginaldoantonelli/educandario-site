import React, { useState } from 'react';
import { History, Landmark, Heart, ZoomIn, X } from 'lucide-react';
import padreMateus from '@/assets/foto-padremateus.jpg';
import fotoMatrizAntiga from '@/assets/igreja-matriz-antiga.jpg';

const HistoryPage: React.FC = () => {
    const [expandedImage, setExpandedImage] = useState<{ src: string; alt: string } | null>(null);

    const openImage = (src: string, alt: string) => setExpandedImage({ src, alt });
    const closeImage = () => setExpandedImage(null);

    return (
        <main className="min-h-screen bg-white dark:bg-slate-950 pt-20 transition-colors duration-300">
            {/* Modal de imagem expandida */}
            {expandedImage && (
                <div
                    className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 md:p-8"
                    onClick={closeImage}
                >
                    <button
                        onClick={closeImage}
                        className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                        aria-label="Fechar"
                    >
                        <X size={28} />
                    </button>
                    <img
                        src={expandedImage.src}
                        alt={expandedImage.alt}
                        className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-2xl animate-in fade-in zoom-in-95 duration-300"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}
            {/* Header Histórico */}
            <section className="bg-slate-900 py-24 px-4 text-center text-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <History size={400} className="absolute -bottom-20 -right-20" />
                </div>
                <div className="max-w-4xl mx-auto relative z-10">
                    <span className="text-orange-500 font-black tracking-widest uppercase text-sm">Desde 1959</span>
                    <h1 className="text-5xl md:text-6xl font-black mb-6 tracking-tight mt-2">Nossa História</h1>
                    <p className="text-xl text-slate-300 leading-relaxed font-medium">
                        A trajetória de uma das mais tradicionais instituições assistenciais de Itapira.
                    </p>
                </div>
            </section>

            {/* Seção 1: O Início e a Fundação */}
            <section className="py-20 px-4 max-w-5xl mx-auto">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400 font-bold mb-4">
                            <Landmark size={20} />
                            <span>A FUNDAÇÃO</span>
                        </div>
                        <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-6">Determinação e Fé</h2>
                        <div className="space-y-4 text-slate-600 dark:text-slate-300 leading-relaxed text-lg">
                            <p>
                                No ano de 1959, precisamente no dia 25 de janeiro, às 17 horas, nas dependências da Igreja Matriz de Santo Antonio, nascia o Educandário Nossa Senhora Aparecida. Graças à determinação do <strong>Padre Mateus Ruiz Domingues</strong> e ao interesse de um grupo voltado ao serviço comunitário, a instituição foi fundada em homenagem à Padroeira do Brasil.
                            </p>
                            <p>
                                A primeira diretoria foi composta por nomes que se tornaram pilares da casa: José Caio como Provedor, Antonio Setti como Vice-provedor, Wanderley Zázera e Octávio Boretti como secretários, e Eduardo Gramani com Flávio Zacchi na tesouraria.
                            </p>
                        </div>
                    </div>
                    <div 
                        className="relative rounded-[3rem] aspect-video overflow-hidden shadow-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 group cursor-zoom-in"
                        onClick={() => openImage(fotoMatrizAntiga, 'Igreja Matriz Antiga')}
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-transparent to-blue-50/50 dark:from-slate-900/40 dark:to-blue-900/30 z-10 pointer-events-none" />
                        <img
                            src={fotoMatrizAntiga}
                            alt="Igreja Matriz Antiga"
                            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 ease-out group-hover:scale-105"
                            loading="lazy"
                        />
                        {/* Ícone de lupa */}
                        <div className="absolute top-4 right-4 z-20 p-2 bg-white/80 dark:bg-slate-900/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg">
                            <ZoomIn size={20} className="text-slate-700 dark:text-slate-200" />
                        </div>
                        <div className="absolute inset-x-6 bottom-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm px-4 py-2 rounded-2xl text-xs font-semibold text-blue-900 dark:text-blue-100 shadow-sm z-20">
                            Igreja Matriz de Santo Antônio, onde o Educandário foi idealizado em 1959.
                        </div>
                    </div>
                </div>
            </section>

            {/* Seção 2: O Primeiro Local e o Leilão */}
            <section className="py-20 bg-slate-50 dark:bg-slate-900 px-4">
                <div className="max-w-5xl mx-auto">
                    <div className="bg-white dark:bg-slate-800 p-10 md:p-16 rounded-[4rem] shadow-sm border border-slate-100 dark:border-slate-700">
                        <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-8 text-center">Os Primeiros Passos</h2>
                        <div className="grid md:grid-cols-2 gap-10">
                            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                                Os trabalhos começaram com nove internos em um prédio improvisado na <strong>Chácara N. S. Aparecida</strong>, propriedade do Sr. José Caio, no Bairro do Cubatão. A inauguração ocorreu em 31 de janeiro de 1960, com a presença da corporação musical "Banda Lira Itapirense", que executou o Hino Nacional.
                            </p>
                            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                                Após o cerimonial, um grandioso leilão com prendas ofertadas pela população angariou os primeiros fundos. A animação e o entusiasmo daquela tarde de domingo prolongaram-se até a noite, marcando o início de uma obra que acolheria órfãos e crianças desvalidas com dignidade e respeito.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Seção 3: O Casal Dedicado */}
            <section className="py-24 px-4 max-w-5xl mx-auto">
                <div className="flex flex-col md:flex-row gap-12 items-center">
                    <div className="w-full md:w-1/3">
                        <div className="bg-orange-50 dark:bg-orange-900/20 p-8 rounded-[3rem] text-orange-600 dark:text-orange-400 italic font-medium border-2 border-orange-100 dark:border-orange-800">
                            <Heart className="mb-4" />
                            "Dona Joana relembra com ternura o carinho que recebia de crianças que nela puderam encontrar o conforto de um colo materno."
                        </div>
                    </div>
                    <div className="flex-1">
                        <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-6">Amor em Tempo Integral</h2>
                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg">
                            O primeiro casal a se dedicar inteiramente aos cuidados dos menores foi o <strong>Sr. Antonio Rodrigues e sua esposa, Dona Joana Albina Rodrigues</strong>. Sem filhos próprios, fixaram residência no Educandário para educar os meninos como seus. Em relatos emocionantes, recordam momentos difíceis onde utilizaram o próprio salário para garantir a alimentação dos internos.
                        </p>
                    </div>
                </div>
            </section>

            {/* Seção 4: Sede Definitiva e Autossuficiência */}
            <section className="py-20 bg-blue-900 text-white px-4">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-4xl font-black mb-10">A Sede Oficial (1962)</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-white/10 p-8 rounded-3xl backdrop-blur-sm">
                            <h4 className="font-bold text-orange-400 mb-2">A Fazendinha</h4>
                            <p className="text-sm text-blue-100">A sede oficial foi inaugurada em 30 de setembro de 1962, em um terreno de 17 alqueires no final da Rua da Penha.</p>
                        </div>
                        <div className="bg-white/10 p-8 rounded-3xl backdrop-blur-sm">
                            <h4 className="font-bold text-orange-400 mb-2">Escola Agrícola</h4>
                            <p className="text-sm text-blue-100">O sonho do Padre Mateus era instalar uma escola agrícola. Os meninos cuidavam de animais e plantações durante a tarde.</p>
                        </div>
                        <div className="bg-white/10 p-8 rounded-3xl backdrop-blur-sm">
                            <h4 className="font-bold text-orange-400 mb-2">Disciplina e Fé</h4>
                            <p className="text-sm text-blue-100">A rotina incluía escola regular, trabalho educativo e educação religiosa, tida como o norte para a orientação de vida.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Seção 5: Padre Mateus */}
            <section className="py-24 px-4 max-w-5xl mx-auto grid md:grid-cols-2 gap-10 items-center">
                <div 
                    className="relative overflow-hidden rounded-[2.5rem] border-8 border-blue-50 dark:border-slate-800 shadow-xl bg-slate-100 dark:bg-slate-800 group cursor-zoom-in"
                    onClick={() => openImage(padreMateus, 'Padre Mateus Ruiz Domingues')}
                >
                    <img
                        src={padreMateus}
                        alt="Padre Mateus Ruiz Domingues"
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 ease-out group-hover:scale-105"
                        loading="lazy"
                    />
                    {/* Ícone de lupa */}
                    <div className="absolute top-4 right-4 z-20 p-2 bg-white/80 dark:bg-slate-900/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg">
                        <ZoomIn size={20} className="text-slate-700 dark:text-slate-200" />
                    </div>
                </div>
                <div className="text-center md:text-left">
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-6">O Legado do Padre Mateus</h2>
                    <div className="text-slate-600 dark:text-slate-300 leading-relaxed space-y-4">
                        <p>
                            Nascido em Polopus (Espanha) em 1913, Padre Mateus veio ao Brasil com 8 anos e se ordenou em 1945. Naturalizado brasileiro em 1965 e elevado a cônego em 1968, foi um incansável batalhador das causas sociais, idealizando o Educandário, a Escola Paroquial e a nova Igreja de Santo Antônio.
                        </p>
                        <p className="font-bold text-slate-800 dark:text-slate-200">
                            "Foi um grande coração carinhoso que sabia afagar as crianças e ansiava por dar direção às almas necessitadas."
                        </p>
                        <p>
                            Seu trabalho unia disciplina, fé e acolhimento. Nos anos 60, guiou a mudança para a fazendinha na Rua da Penha, onde a rotina de estudos, catequese e cuidados com plantações dava autonomia ao Educandário e formava meninos que levaram valores de dignidade e serviço comunitário para a vida adulta.
                        </p>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default HistoryPage;