import React from 'react';

// Definindo o "contrato" de dados do componente
interface PDFModalProps {
    isOpen: boolean;
    onClose: () => void;
    pdfUrl: string;
    title?: string; // O '?' indica que o título é opcional
    }

    const PDFModal: React.FC<PDFModalProps> = ({ isOpen, onClose, pdfUrl, title }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <div className="bg-white rounded-lg shadow-2xl w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden">
            
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b bg-gray-50">
            <h3 className="text-xl font-bold text-gray-700 truncate">
                {title || "Visualizar Documento"}
            </h3>
            <button 
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all rounded-full"
                aria-label="Fechar"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
            </div>

            {/* PDF Content */}
            <div className="flex-1 bg-gray-200 relative">
            {pdfUrl ? (
                <iframe
                src={`${pdfUrl}#view=FitH`}
                className="w-full h-full border-none"
                title="PDF Viewer"
                />
            ) : (
                <div className="flex items-center justify-center h-full text-gray-500 italic">
                Nenhum arquivo PDF disponível para visualização.
                </div>
            )}
            </div>

            {/* Footer */}
            <div className="px-6 py-3 border-t bg-gray-50 flex justify-end">
            <button
                onClick={onClose}
                className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 transition-colors shadow-sm"
            >
                Fechar
            </button>
            </div>
        </div>
        </div>
    );
};

export default PDFModal;