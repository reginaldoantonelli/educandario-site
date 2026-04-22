import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Compass, Home, Info, Phone, Search } from 'lucide-react';

const ErrorPage: React.FC = () => {
    return (
        <main className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center px-4 py-20 transition-colors duration-300">
            <div className="max-w-4xl w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl rounded-3xl overflow-hidden">
                <div className="bg-linear-to-r from-blue-900 via-blue-800 to-blue-700 text-white p-10">
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-100">Erro 404</p>
                    <h1 className="mt-3 text-4xl md:text-5xl font-black leading-tight">Página não encontrada</h1>
                    <p className="mt-4 text-blue-100 text-lg max-w-2xl">
                        Não encontramos o endereço que você tentou acessar. Vamos te ajudar a voltar para um caminho seguro dentro do Educandário.
                    </p>
                </div>

                <div className="p-10 grid md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 space-y-4">
                        <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                            <Compass className="text-blue-700 dark:text-blue-400" size={20} />
                            <span className="font-semibold">Siga por aqui</span>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-3">
                            <Link to="/" className="flex items-center justify-between p-4 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-blue-600 dark:hover:border-blue-500 hover:shadow-md transition-all">
                                <div>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">Início</p>
                                    <p className="font-bold text-slate-800 dark:text-white">Voltar à Home</p>
                                </div>
                                <Home size={18} className="text-blue-700 dark:text-blue-400" />
                            </Link>
                            <Link to="/sobre" className="flex items-center justify-between p-4 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-blue-600 dark:hover:border-blue-500 hover:shadow-md transition-all">
                                <div>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">Institucional</p>
                                    <p className="font-bold text-slate-800 dark:text-white">Conhecer o Educandário</p>
                                </div>
                                <Info size={18} className="text-blue-700 dark:text-blue-400" />
                            </Link>
                            <Link to="/transparencia" className="flex items-center justify-between p-4 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-blue-600 dark:hover:border-blue-500 hover:shadow-md transition-all">
                                <div>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">Prestação de contas</p>
                                    <p className="font-bold text-slate-800 dark:text-white">Ver Transparência</p>
                                </div>
                                <Search size={18} className="text-blue-700 dark:text-blue-400" />
                            </Link>
                            <Link to="/contato" className="flex items-center justify-between p-4 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-blue-600 dark:hover:border-blue-500 hover:shadow-md transition-all">
                                <div>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">Fale conosco</p>
                                    <p className="font-bold text-slate-800 dark:text-white">Contato e matrículas</p>
                                </div>
                                <Phone size={18} className="text-blue-700 dark:text-blue-400" />
                            </Link>
                        </div>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 flex flex-col gap-4">
                        <div className="flex items-center gap-3">
                            <ArrowLeft size={18} className="text-blue-700 dark:text-blue-400" />
                            <p className="font-semibold text-slate-800 dark:text-white">Precisa de ajuda?</p>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-300">
                            Se o link veio de um material antigo, é possível que a página tenha sido movida. Use os atalhos ou volte para a Home.
                        </p>
                        <a
                            href="https://wa.me/551938631972"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-700 hover:bg-orange-800 text-white font-bold py-3 px-4 transition-colors shadow-md"
                        >
                            <Phone size={16} /> WhatsApp do Educandário
                        </a>
                        <Link
                            to="/"
                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 dark:border-slate-600 hover:border-blue-600 dark:hover:border-blue-500 text-slate-800 dark:text-white hover:text-blue-700 dark:hover:text-blue-400 font-semibold py-3 px-4 transition-colors"
                        >
                            <Home size={16} /> Voltar para a Home
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default ErrorPage;
