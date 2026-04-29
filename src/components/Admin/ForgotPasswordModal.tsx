import React, { useState, useEffect } from 'react';
import { X, Send, Mail, AlertCircle, CheckCircle2 } from 'lucide-react';

interface ForgotPasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
    onReset: (email: string) => Promise<void>; // Aqui passamos o seu método resetPassword
}

const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({ isOpen, onClose, onReset }) => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    useEffect(() => {
        if (!isOpen) {
            // Pequeno delay para o usuário não ver o texto sumindo durante a animação de fechar
            const timer = setTimeout(() => {
                setEmail('');
                setStatus(null);
                setLoading(false);
            }, 300); 
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setStatus(null);

        try {
            await onReset(email);
            setStatus({
                type: 'success',
                message: 'Se este e-mail estiver cadastrado, você receberá um link em breve. Verifique sua caixa de entrada e o spam.'
            });
        } catch (err: unknown) {
            // Captura a mensagem amigável que você já definiu no auth.ts
            setStatus({
                type: 'error',
                message: (err as { message?: string }).message || 'Ocorreu um erro ao tentar enviar o e-mail.'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-110 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
                <div className="p-6 md:p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Recuperar acesso</h2>
                        <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                            <X size={20} className="text-slate-500" />
                        </button>
                    </div>

                    {status?.type === 'success' ? (
                        <div className="flex flex-col items-center text-center py-4">
                            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                                <CheckCircle2 size={32} />
                            </div>
                            <p className="text-slate-700 dark:text-slate-300 font-medium mb-6">
                                {status.message}
                            </p>
                            <button onClick={onClose} className="w-full py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-white font-bold rounded-xl hover:bg-slate-200 transition-colors">
                                Voltar para o login
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <p className="text-slate-600 dark:text-slate-400 text-sm">
                                Digite o e-mail associado à sua conta administrativa. Enviaremos um link seguro para você criar uma nova senha.
                            </p>

                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="seu@email.com"
                                    className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all dark:text-white"
                                />
                            </div>

                            {status?.type === 'error' && (
                                <div className="flex items-center gap-2 text-red-600 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg text-sm">
                                    <AlertCircle size={16} />
                                    <span>{status.message}</span>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading || !email}
                                className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-xl flex items-center justify-center
                                gap-2 transition-all shadow-lg shadow-blue-600/20 cursor-pointer"
                            >
                                {loading ? 'Enviando...' : (
                                    <>Enviar link de recuperação <Send size={16} /></>
                                )}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordModal;