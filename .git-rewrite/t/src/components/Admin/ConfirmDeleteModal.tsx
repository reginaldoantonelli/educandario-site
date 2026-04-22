import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

interface ConfirmDeleteModalProps {
    isOpen: boolean;
    documentName: string;
    onConfirm: () => void;
    onCancel: () => void;
    isDeleting?: boolean;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
    isOpen,
    documentName,
    onConfirm,
    onCancel,
    isDeleting = false
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            {/* Overlay com Backdrop Blur */}
            <div
                className="absolute inset-0 bg-slate-900/50 dark:bg-slate-950/70 backdrop-blur-md transition-opacity duration-300"
                onClick={onCancel}
            />

            {/* Modal Container */}
            <div className="relative bg-white dark:bg-slate-900 rounded-xl sm:rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl w-full max-w-sm animate-in fade-in zoom-in-95 duration-300">

                {/* Header com Ícone de Alerta */}
                <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-start gap-4">
                    <div className="flex-shrink-0">
                        <div className="flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/30">
                            <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
                        </div>
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                            Excluir Documento?
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                            Esta ação não pode ser desfeita.
                        </p>
                    </div>
                    <button
                        onClick={onCancel}
                        className="p-1 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors flex-shrink-0"
                        title="Fechar"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Conteúdo */}
                <div className="p-6">
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                        Tem certeza que deseja excluir o documento:
                    </p>
                    <p className="mt-3 p-3 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                        <span className="font-semibold text-slate-900 dark:text-white break-words">
                            {documentName}
                        </span>
                    </p>
                </div>

                {/* Botões de Ação */}
                <div className="p-6 border-t border-slate-200 dark:border-slate-800 flex gap-3">
                    <button
                        onClick={onCancel}
                        disabled={isDeleting}
                        className="flex-1 px-4 py-2.5 text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-medium text-sm transition-all"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isDeleting}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 disabled:bg-red-500 disabled:cursor-not-allowed text-white rounded-lg font-medium text-sm transition-all"
                    >
                        {isDeleting ? (
                            <>
                                <span className="inline-flex w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Deletando...
                            </>
                        ) : (
                            <>
                                <Trash2 size={16} />
                                Excluir
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDeleteModal;
