import React from 'react';
import { Check, X } from 'lucide-react';

interface UploadConfirmationModalProps {
    isOpen: boolean;
    documentName: string;
    onClose: () => void;
    onCloseAll?: () => void;
    isLoading?: boolean;
}

const UploadConfirmationModal: React.FC<UploadConfirmationModalProps> = ({
    isOpen,
    documentName,
    onClose,
    onCloseAll,
    isLoading = false
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 sm:p-6">
            {/* Overlay com Backdrop Blur */}
            <div
                className="absolute inset-0 bg-slate-900/50 dark:bg-slate-950/70 backdrop-blur-md transition-opacity duration-300"
                onClick={onClose}
            />

            {/* Modal Container */}
            <div className="relative bg-white dark:bg-slate-900 rounded-xl sm:rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl w-full max-w-sm animate-in fade-in zoom-in-95 duration-300">

                {/* Header com Ícone de Sucesso */}
                <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-start gap-4">
                    <div className="shrink-0">
                        <div className="flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30">
                            <Check className="h-6 w-6 text-green-600 dark:text-green-400" />
                        </div>
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                            Documento Enviado!
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                            O arquivo foi salvo com sucesso na transparência.
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:bg-slate-800 transition-colors shrink-0"
                        title="Fechar"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Conteúdo */}
                <div className="p-6">
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                        O documento foi registrado como:
                    </p>
                    <p className="mt-3 p-3 bg-green-50 dark:bg-green-900/10 rounded-lg border border-green-200 dark:border-green-800">
                        <span className="font-semibold text-slate-900 dark:text-white">
                            {documentName}
                        </span>
                    </p>
                </div>

                {/* Botão de Ação */}
                <div className="p-6 border-t border-slate-200 dark:border-slate-800">
                    <button
                        onClick={() => {
                            if (!isLoading) {
                                onClose();
                                onCloseAll?.();
                            }
                        }}
                        disabled={isLoading}
                        className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-all ${
                            isLoading
                                ? 'bg-green-500 cursor-not-allowed text-white'
                                : 'bg-green-600 hover:bg-green-700 text-white'
                        }`}
                    >
                        {isLoading ? (
                            <>
                                <span className="inline-flex w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Processando...
                            </>
                        ) : (
                            <>
                                <Check size={16} />
                                Pronto
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UploadConfirmationModal;
