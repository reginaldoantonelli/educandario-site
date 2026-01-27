import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { X, Copy, Check, HeartHandshake, Banknote, ShoppingBag, ExternalLink } from 'lucide-react';

interface DonationModalProps {
    open: boolean;
    onClose: () => void;
}

const DonationModal: React.FC<DonationModalProps> = ({ open, onClose }) => {
    const [copied, setCopied] = useState(false);
    const pixKey = 'contato@educandarionsa.com.br'; // Ajuste para a chave PIX oficial

    useEffect(() => {
        if (!open) return;
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [open, onClose]);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(pixKey);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch {
            setCopied(false);
        }
    };

    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-9999 flex items-start justify-center bg-slate-900/60 backdrop-blur-sm px-4 md:px-6 pt-24 md:pt-16 pb-6"
            onClick={onClose}
        >
            <div
                className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden max-h-[calc(100vh-48px)] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-start justify-between gap-4 bg-linear-to-r from-blue-900 via-blue-800 to-blue-700 text-white px-8 py-6">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-100">Doação rápida</p>
                        <h2 className="text-2xl md:text-3xl font-black leading-tight">Ajude agora mesmo</h2>
                        <p className="text-blue-100 mt-2 text-sm md:text-base max-w-xl">
                            Apoie nossas crianças com uma transferência instantânea ou com itens prioritários para o dia a dia.
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-white/10 transition-colors"
                        aria-label="Fechar"
                    >
                        <X size={22} />
                    </button>
                </div>

                <div className="p-8 space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50">
                            <div className="flex items-center gap-2 text-slate-700 font-semibold mb-3">
                                <HeartHandshake size={18} className="text-orange-500" />
                                <span>PIX imediato</span>
                            </div>
                            <div className="flex items-center justify-between gap-3 bg-white border border-slate-200 rounded-xl px-4 py-3">
                                <div>
                                    <p className="text-xs text-slate-500">Chave PIX</p>
                                    <p className="font-semibold text-slate-800 break-all">{pixKey}</p>
                                </div>
                                <button
                                    onClick={handleCopy}
                                    className="flex items-center gap-1 text-sm font-semibold text-blue-700 hover:text-blue-900"
                                >
                                    {copied ? (
                                        <>
                                            <Check size={16} /> Copiado
                                        </>
                                    ) : (
                                        <>
                                            <Copy size={16} /> Copiar
                                        </>
                                    )}
                                </button>
                            </div>
                            <p className="text-xs text-slate-500 mt-2">Confirme a chave oficial antes de concluir a doação.</p>
                        </div>

                        <div className="p-5 rounded-2xl border border-slate-200">
                            <div className="flex items-center gap-2 text-slate-700 font-semibold mb-3">
                                <Banknote size={18} className="text-blue-700" />
                                <span>Dados bancários</span>
                            </div>
                            <div className="space-y-1 text-sm text-slate-700">
                                <p className="font-semibold">Favorecido: Educandário Nossa Senhora Aparecida</p>
                                <p>Banco do Brasil (001)</p>
                                <p>Agência: 0000</p>
                                <p>Conta: 000000-0</p>
                                <p>CNPJ: 00.000.000/0000-00</p>
                            </div>
                            <p className="text-xs text-slate-500 mt-2">Preencha com os dados oficiais antes de publicar.</p>
                        </div>
                    </div>

                    <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50">
                        <div className="flex items-center gap-2 text-slate-700 font-semibold mb-3">
                            <ShoppingBag size={18} className="text-blue-700" />
                            <span>Mantimentos prioritários</span>
                        </div>
                        <ul className="grid sm:grid-cols-2 gap-2 text-sm text-slate-700">
                            <li>Leite integral e fórmulas infantis</li>
                            <li>Arroz, feijão, macarrão</li>
                            <li>Proteínas não perecíveis (sardinha, atum)</li>
                            <li>Produtos de higiene infantil</li>
                            <li>Material de limpeza</li>
                            <li>Lanches saudáveis para contraturno</li>
                        </ul>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <Link
                            to="/contato"
                            className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-blue-900 text-white font-bold hover:bg-blue-800 transition-colors"
                            onClick={onClose}
                        >
                            <ExternalLink size={18} /> Outras formas de contribuir
                        </Link>
                        <button
                            onClick={onClose}
                            className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-slate-300 text-slate-800 font-semibold hover:border-slate-400 transition-colors"
                        >
                            Fechar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DonationModal;
