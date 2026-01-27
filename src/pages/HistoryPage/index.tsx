import React from 'react';
import { History, Users, Landmark, Heart } from 'lucide-react';
import padreMateus from '@/assets/foto-padremateus.jpg';

const HistoryPage: React.FC = () => {
    return (
        <main className="min-h-screen bg-white pt-20">
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
                        <div className="flex items-center gap-2 text-blue-700 font-bold mb-4">
                            <Landmark size={20} />
                            <span>A FUNDAÇÃO</span>
                        </div>
                        <h2 className="text-3xl font-black text-slate-900 mb-6">Determinação e Fé</h2>
                        <div className="space-y-4 text-slate-600 leading-relaxed text-lg">
                            <p>
                                No ano de 1959, precisamente no dia 25 de janeiro, às 17 horas, nas dependências da Igreja Matriz de Santo Antonio, nascia o Educandário Nossa Senhora Aparecida. Graças à determinação do <strong>Padre Mateus Ruiz Domingues</strong> e ao interesse de um grupo voltado ao serviço comunitário, a instituição foi fundada em homenagem à Padroeira do Brasil.
                            </p>
                            <p>
                                A primeira diretoria foi composta por nomes que se tornaram pilares da casa: José Caio como Provedor, Antonio Setti como Vice-provedor, Wanderley Zázera e Octávio Boretti como secretários, e Eduardo Gramani com Flávio Zacchi na tesouraria.
                            </p>
                        </div>
                    </div>
                    <div className="bg-slate-100 rounded-[3rem] aspect-video flex items-center justify-center border-2 border-dashed border-slate-300">
                        <span className="text-slate-400 font-medium">[Espaço para Foto da Ata ou Fundação]</span>
                    </div>
                </div>
            </section>

            {/* Seção 2: O Primeiro Local e o Leilão */}
            <section className="py-20 bg-slate-50 px-4">
                <div className="max-w-5xl mx-auto">
                    <div className="bg-white p-10 md:p-16 rounded-[4rem] shadow-sm border border-slate-100">
                        <h2 className="text-3xl font-black text-slate-900 mb-8 text-center">Os Primeiros Passos</h2>
                        <div className="grid md:grid-cols-2 gap-10">
                            <p className="text-slate-600 leading-relaxed">
                                Os trabalhos começaram com nove internos em um prédio improvisado na <strong>Chácara N. S. Aparecida</strong>, propriedade do Sr. José Caio, no Bairro do Cubatão. A inauguração ocorreu em 31 de janeiro de 1960, com a presença da corporação musical "Banda Lira Itapirense", que executou o Hino Nacional.
                            </p>
                            <p className="text-slate-600 leading-relaxed">
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
                        <div className="bg-orange-50 p-8 rounded-[3rem] text-orange-600 italic font-medium border-2 border-orange-100">
                            <Heart className="mb-4" />
                            "Dona Joana relembra com ternura o carinho que recebia de crianças que nela puderam encontrar o conforto de um colo materno."
                        </div>
                    </div>
                    <div className="flex-1">
                        <h2 className="text-3xl font-black text-slate-900 mb-6">Amor em Tempo Integral</h2>
                        <p className="text-slate-600 leading-relaxed text-lg">
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
                <div className="relative overflow-hidden rounded-[2.5rem] border-8 border-blue-50 shadow-xl bg-slate-100">
                    <img
                        src={padreMateus}
                        alt="Padre Mateus Ruiz Domingues"
                        className="w-full h-full object-cover"
                        loading="lazy"
                    />
                </div>
                <div className="text-center md:text-left">
                    <Users size={48} className="mx-auto md:mx-0 text-blue-600 mb-6" />
                    <h2 className="text-3xl font-black text-slate-900 mb-6">O Legado do Padre Mateus</h2>
                    <div className="text-slate-600 leading-relaxed space-y-4">
                        <p>
                            Nascido na Espanha em 1913, Padre Mateus chegou ao Brasil aos 8 anos. Ordenado em 1945, foi um batalhador das causas sociais. Além do Educandário, construiu a nova Igreja de Santo Antonio e a Escola Paroquial.
                        </p>
                        <p className="font-bold text-slate-800">
                            "Foi um grande coração carinhoso que sabia afagar as crianças e ansiava por dar direção às almas necessitadas."
                        </p>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default HistoryPage;