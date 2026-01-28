import React from 'react';
import { ScrollText, ShieldCheck, CheckCircle2 } from 'lucide-react';

const RegimentoInterno: React.FC = () => {
    return (
        <main className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-20 transition-colors duration-300">
            {/* Hero */}
            <section className="bg-blue-900 text-white py-16 px-4">
                <div className="max-w-5xl mx-auto">
                    <div className="inline-flex items-center gap-2 text-sm font-semibold bg-white/10 px-3 py-1 rounded-full uppercase tracking-wide">
                        <ScrollText size={16} /> Regimento Interno
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black mt-4 mb-4 leading-tight">Normas e Diretrizes</h1>
                    <p className="text-blue-100 max-w-3xl text-lg">
                        Conheça as regras que orientam o funcionamento do Educandário Nossa Senhora Aparecida, garantindo transparência, segurança e a melhor experiência para nossas crianças e famílias.
                    </p>
                </div>
            </section>

            {/* Conteúdo principal */}
            <section className="max-w-5xl mx-auto px-4 py-16 space-y-8">
                <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 space-y-4">
                    <div className="flex items-center gap-3 text-blue-700 dark:text-blue-400 font-black text-sm uppercase tracking-widest">
                        <ShieldCheck size={18} />
                        Estrutura do regimento
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                        Este Regimento Interno tem como objetivo estabelecer normas, procedimentos e demais elementos operacionais necessários à adequada administração do Educandário Nossa Senhora Aparecida – ENSA. 
                        Regulando, dessa forma, os direitos e obrigações concernentes à sua organização, objetivos, patrimônio e relações, de acordo com princípios e diretrizes estabelecidos no Estatuto Social. 
                        Para consulta completa, disponibilizamos o documento oficial em formato PDF.
                    </p>
                    <a
                        href="/docs/regimento-interno.pdf"
                        className="inline-flex items-center gap-2 w-fit bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-xl font-bold transition-colors"
                    >
                        <ScrollText size={18} /> Baixar regimento (PDF)
                    </a>
                </div>

                <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 grid md:grid-cols-3 gap-6">
                    {[
                        'Proteção integral e bem-estar das crianças',
                        'Transparência na gestão e prestação de contas',
                        'Participação ativa de famílias e comunidade',
                    ].map((item) => (
                        <div key={item} className="flex items-start gap-3">
                            <CheckCircle2 className="text-blue-700 dark:text-blue-400 mt-1" size={18} />
                            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{item}</p>
                        </div>
                    ))}
                </div>
            </section>
        </main>
    );
};

export default RegimentoInterno;
