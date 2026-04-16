import React, { useState, useMemo } from 'react';
import { X, Upload, FileText, AlertCircle, HelpCircle } from 'lucide-react';

interface UploadModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUpload?: (data: { nome: string; arquivo: File; ano: string; visibilidade: string; categoria: string; descricao: string }) => void;
}

interface Category {
    id: string;
    title: string;
    shortTitle: string;
    description: string;
}

const UploadModal: React.FC<UploadModalProps> = ({ isOpen, onClose, onUpload }) => {
    const [fileError, setFileError] = useState('');
    const [uploading, setUploading] = useState(false);
    const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB

    const categories: Category[] = useMemo(() => [
        {
            id: 'ensa',
            title: "Documentos – ENSA",
            shortTitle: "Institucional",
            description: "Estatutos, atas de eleição e documentos oficiais da entidade."
        },
        {
            id: 'social',
            title: "Promoção Social",
            shortTitle: "Promoção Social",
            description: "Relatórios de atividades e demonstrativos financeiros da assistência."
        },
        {
            id: 'cpfl',
            title: "Parceria CPFL",
            shortTitle: "Convênio CPFL",
            description: "Documentos e prestações de contas do projeto CPFL."
        },
        {
            id: 'educacao',
            title: "Educação",
            shortTitle: "Educação",
            description: "Relatórios pedagógicos e convênios da área educacional."
        }
    ], []);
    
    const [formData, setFormData] = useState({
        nome: '',
        arquivo: null as File | null,
        ano: new Date().getFullYear().toString(),
        visibilidade: 'Público',
        categoria: 'ensa'
    });

    const selectedCategory = useMemo(() => 
        categories.find(cat => cat.id === formData.categoria),
        [formData.categoria, categories]
    );

    if (!isOpen) return null;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        
        if (!file) {
            setFileError('');
            return;
        }

        // Validar tipo de arquivo
        if (file.type !== 'application/pdf') {
            setFileError('❌ Apenas arquivos PDF são permitidos');
            setFormData({ ...formData, arquivo: null });
            return;
        }

        // Validar tamanho do arquivo
        if (file.size > MAX_FILE_SIZE) {
            const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
            setFileError(`❌ Arquivo muito grande (${fileSizeMB}MB). Máximo: 20MB`);
            setFormData({ ...formData, arquivo: null });
            return;
        }

        // Arquivo válido - extrai o nome sem a extensão .pdf
        setFileError('');
        const fileName = file.name.replace(/\.pdf$/i, '');
        setFormData({ ...formData, arquivo: file, nome: fileName });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.nome.trim()) {
            alert('Por favor, insira um nome para o documento');
            return;
        }
        
        if (!formData.arquivo) {
            alert('Por favor, selecione um arquivo PDF válido');
            return;
        }

        // Validação adicional
        if (formData.arquivo.type !== 'application/pdf') {
            setFileError('❌ Apenas arquivos PDF são permitidos');
            return;
        }

        if (formData.arquivo.size > MAX_FILE_SIZE) {
            setFileError('❌ Arquivo muito grande. Máximo: 20MB');
            return;
        }

        setUploading(true);
        
        try {
            // Chama o upload de verdade
            if (onUpload && formData.arquivo) {
                onUpload({
                    ...formData,
                    arquivo: formData.arquivo,  // Garante que não é null
                    descricao: selectedCategory?.description || ''
                });
            }
            
            // Reset form
            setFormData({
                nome: '',
                arquivo: null,
                ano: new Date().getFullYear().toString(),
                visibilidade: 'Público',
                categoria: 'ensa'
            });
            setFileError('');
            
            // ✅ Fecha o modal após o upload
            onClose();
            
        } catch (error) {
            console.error('Upload error:', error);
        } finally {
            setUploading(false);
        }
    };

    const closeModal = () => {
        setFormData({
            nome: '',
            arquivo: null,
            ano: new Date().getFullYear().toString(),
            visibilidade: 'Público',
            categoria: 'ensa'
        });
        setFileError('');
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            {/* Overlay com Backdrop Blur */}
            <div 
                className="absolute inset-0 bg-slate-900/50 dark:bg-slate-950/70 backdrop-blur-md transition-opacity duration-300"
                onClick={closeModal}
            />

            {/* Modal Container - Glassmorphism */}
            <div className="relative bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-white/20 dark:border-slate-700/20 shadow-2xl w-full max-w-md sm:max-w-lg max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-300">
                
                {/* Header */}
                <div className="sticky top-0 p-4 sm:p-6 border-b border-slate-200 dark:border-slate-800/50 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm flex items-center justify-between">
                    <div>
                        <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">Novo Documento</h3>
                        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">Upload de arquivo para a transparência</p>
                    </div>
                    <button
                        onClick={closeModal}
                        className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors shrink-0"
                        title="Fechar"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Formulário */}
                <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                    {/* Campo de Nome */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-800 dark:text-slate-300">
                            Nome do Documento
                        </label>
                        <input
                            type="text"
                            placeholder="ex: Balanço Anual 2025"
                            value={formData.nome}
                            onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                            className="w-full px-4 py-2.5 bg-white dark:bg-slate-950/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        />
                    </div>

                    {/* Campo de Ano */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-800 dark:text-slate-300">
                            Ano do Documento
                        </label>
                        <input
                            type="number"
                            min="2000"
                            max={new Date().getFullYear() + 1}
                            value={formData.ano}
                            onChange={(e) => setFormData({ ...formData, ano: e.target.value })}
                            className="w-full px-4 py-2.5 bg-white dark:bg-slate-950/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        />
                    </div>

                    {/* Campo de Categoria */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-800 dark:text-slate-300">
                            Categoria
                        </label>
                        <select
                            value={formData.categoria}
                            onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                            className="w-full px-4 py-2.5 bg-white dark:bg-slate-950/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
                        >
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.shortTitle}</option>
                            ))}
                        </select>
                        {selectedCategory && (
                            <p className="text-xs text-slate-500 dark:text-slate-400 italic">
                                {selectedCategory.description}
                            </p>
                        )}
                    </div>

                    {/* Campo de Visibilidade */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-800 dark:text-slate-300">
                            Visibilidade
                        </label>
                        <select
                            value={formData.visibilidade}
                            onChange={(e) => setFormData({ ...formData, visibilidade: e.target.value })}
                            className="w-full px-4 py-2.5 bg-white dark:bg-slate-950/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
                        >
                            <option value="Público">Público</option>
                            <option value="Privado">Privado</option>
                            <option value="Restrito">Restrito</option>
                        </select>
                    </div>

                    {/* Upload de Arquivo */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-800 dark:text-slate-300">
                            Arquivo (PDF)
                        </label>
                        <label className={`flex flex-col items-center justify-center w-full px-4 py-6 border-2 border-dashed rounded-lg cursor-pointer transition-colors group ${
                            fileError 
                                ? 'border-red-400 dark:border-red-500 bg-red-50 dark:bg-red-900/10 hover:bg-red-100 dark:hover:bg-red-900/20' 
                                : 'border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                        }`}>
                            <div className="flex flex-col items-center justify-center text-center">
                                {fileError ? (
                                    <AlertCircle className="w-8 h-8 text-red-500 dark:text-red-400 mb-2" />
                                ) : (
                                    <Upload className="w-8 h-8 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-2" />
                                )}
                                <p className={`text-sm font-medium ${
                                    fileError 
                                        ? 'text-red-600 dark:text-red-400' 
                                        : 'text-slate-700 dark:text-slate-300'
                                }`}>
                                    {fileError ? fileError : (formData.arquivo ? formData.arquivo.name : 'Clique para selecionar')}
                                </p>
                                <p className={`text-xs mt-1 ${
                                    fileError 
                                        ? 'text-red-500 dark:text-red-400' 
                                        : 'text-slate-500 dark:text-slate-400'
                                }`}>
                                    {fileError ? 'Tente novamente' : (formData.arquivo ? `${(formData.arquivo.size / 1024).toFixed(1)} KB` : 'Máximo 20 MB - Apenas PDF')}
                                </p>
                            </div>
                            <input
                                type="file"
                                accept=".pdf"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                        </label>
                    </div>

                    {/* Help Section */}
                    <div className="p-3 sm:p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/30 rounded-lg">
                        <div className="flex items-start gap-3">
                            <HelpCircle size={16} className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                            <div className="flex-1 text-xs sm:text-sm text-blue-700 dark:text-blue-300">
                                <p className="font-semibold mb-1">Arquivo muito grande?</p>
                                <p>Use a ferramenta gratuita <a href="https://www.ilovepdf.com/compress_pdf" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-600 dark:hover:text-blue-200 font-semibold">ILovePDF</a> para comprimir seu PDF sem perder qualidade.</p>
                            </div>
                        </div>
                    </div>

                    {/* Botões de Ação */}
                    <div className="flex gap-3 pt-4 sm:pt-6 border-t border-slate-200 dark:border-slate-800/50">
                        <button
                            type="button"
                            onClick={closeModal}
                            className="flex-1 px-4 py-2.5 text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg font-medium text-sm transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={uploading || !formData.arquivo || fileError !== ''}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-500 disabled:cursor-not-allowed text-white rounded-lg font-medium text-sm transition-all"
                            title={fileError ? 'Selecione um arquivo PDF válido (máx 20MB)' : ''}
                        >
                            {uploading ? (
                                <>
                                    <span className="inline-flex w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Enviando...
                                </>
                            ) : (
                                <>
                                    <FileText size={16} />
                                    Enviar
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UploadModal;