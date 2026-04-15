import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { X, Save } from 'lucide-react';

interface EditDocumentModalProps {
    isOpen: boolean;
    document: {
        id: string;
        nome: string;
        categoria: string;
        ano: string;
        visibilidade: string;
    } | null;
    onClose: () => void;
    onSave: (updatedDocument: { id: string; nome: string; categoria: string; ano: string; visibilidade: string }) => Promise<void> | void;
    isLoading?: boolean;
}

const categoryMap: Record<string, { id: string; shortTitle: string; description: string }> = {
    'Institucional': { id: 'ensa', shortTitle: 'Institucional', description: 'Estatutos, atas de eleição e documentos oficiais.' },
    'Promoção Social': { id: 'social', shortTitle: 'Promoção Social', description: 'Relatórios de atividades e demonstrativos financeiros.' },
    'Convênio CPFL': { id: 'cpfl', shortTitle: 'Convênio CPFL', description: 'Documentos e prestações de contas do projeto CPFL.' },
    'Educação': { id: 'educacao', shortTitle: 'Educação', description: 'Relatórios pedagógicos e convênios educacionais.' }
};

const EditDocumentModal: React.FC<EditDocumentModalProps> = ({
    isOpen,
    document,
    onClose,
    onSave,
    isLoading = false
}) => {
    const [formData, setFormData] = useState({
        nome: '',
        categoria: '',
        ano: '',
        visibilidade: 'Público'
    });

    // Mapa inverso para encontrar o nome real pela categoria armazenada
    const getCategoryName = useCallback((categoryNameOrId: string): string => {
        // Se já é um nome real (como "Institucional"), retorna ele mesmo
        if (Object.keys(categoryMap).includes(categoryNameOrId)) {
            return categoryNameOrId;
        }
        // Se é um ID (como "ensa"), encontra o nome correspondente
        const categoryEntry = Object.entries(categoryMap).find(([name]) => categoryMap[name].id === categoryNameOrId || categoryMap[name].shortTitle === categoryNameOrId);
        return categoryEntry ? categoryEntry[0] : 'Institucional';
    }, []);

    // Sincronizar formulário quando o documento mudar
    useEffect(() => {
        if (document) {
            setFormData({
                nome: document.nome,
                categoria: getCategoryName(document.categoria),
                ano: document.ano,
                visibilidade: document.visibilidade
            });
        }
    }, [document, getCategoryName]);

    const selectedCategory = useMemo(() => 
        categoryMap[formData.categoria],
        [formData.categoria]
    );

    if (!isOpen || !document) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.nome.trim()) {
            alert('Por favor, insira um nome para o documento');
            return;
        }

        onSave({
            id: document.id,
            nome: formData.nome,
            categoria: formData.categoria,  // Passa o nome da categoria (ex: 'Institucional')
            ano: formData.ano,
            visibilidade: formData.visibilidade
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            {/* Overlay com Backdrop Blur */}
            <div
                className="absolute inset-0 bg-slate-900/50 dark:bg-slate-950/70 backdrop-blur-md transition-opacity duration-300"
                onClick={onClose}
            />

            {/* Modal Container - Glassmorphism */}
            <div className="relative bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-white/20 dark:border-slate-700/20 shadow-2xl w-full max-w-md sm:max-w-lg max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-300">

                {/* Header */}
                <div className="sticky top-0 p-4 sm:p-6 border-b border-slate-200 dark:border-slate-800/50 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm flex items-center justify-between">
                    <div>
                        <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">Editar Documento</h3>
                        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">Atualize as informações do documento</p>
                    </div>
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
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
                            disabled={isLoading}
                            className="w-full px-4 py-2.5 bg-white dark:bg-slate-950/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                    </div>

                    {/* Campo de Ano */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-800 dark:text-slate-300">
                            Ano do Documento
                        </label>
                        <input
                            type="text"
                            placeholder="ex: 2026"
                            value={formData.ano}
                            onChange={(e) => setFormData({ ...formData, ano: e.target.value })}
                            disabled={isLoading}
                            className="w-full px-4 py-2.5 bg-white dark:bg-slate-950/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
                            disabled={isLoading}
                            className="w-full px-4 py-2.5 bg-white dark:bg-slate-950/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {Object.entries(categoryMap).map(([key, value]) => (
                                <option key={key} value={key}>{value.shortTitle}</option>
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
                            disabled={isLoading}
                            className="w-full px-4 py-2.5 bg-white dark:bg-slate-950/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <option value="Público">Público</option>
                            <option value="Privado">Privado</option>
                            <option value="Restrito">Restrito</option>
                        </select>
                    </div>

                    {/* Botões de Ação */}
                    <div className="flex gap-3 pt-4 sm:pt-6 border-t border-slate-200 dark:border-slate-800/50">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isLoading}
                            className="flex-1 px-4 py-2.5 text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-medium text-sm transition-all"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-500 disabled:cursor-not-allowed text-white rounded-lg font-medium text-sm transition-all"
                        >
                            {isLoading ? (
                                <>
                                    <span className="inline-flex w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Salvando...
                                </>
                            ) : (
                                <>
                                    <Save size={16} />
                                    Salvar Mudanças
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditDocumentModal;
