import React, { useState, useMemo, useEffect } from 'react';
import { FileText, Plus, Trash2, Eye, Lock, Globe, Filter, X, Search, Edit, ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import UploadModal from '@/components/Admin/UploadModal';
import ConfirmDeleteModal from '@/components/admin/ConfirmDeleteModal';
import EditDocumentModal from '@/components/admin/EditDocumentModal';

const TransparencyAdmin: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [documentToDelete, setDocumentToDelete] = useState<number | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [documentToEdit, setDocumentToEdit] = useState<number | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;
    
    // Estado para rastrear o último upload
    const [lastUploadTime, setLastUploadTime] = useState<number | null>(() => {
        const saved = localStorage.getItem('lastTransparencyUpload');
        return saved ? parseInt(saved) : null;
    });
    
    // Estado para forçar atualizações do tempo decorrido a cada 30 segundos
    const [currentTime, setCurrentTime] = useState(() => Date.now());

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(Date.now());
        }, 30000); // Atualiza a cada 30 segundos

        return () => clearInterval(interval);
    }, []);
    
    // Função para calcular tempo decorrido desde o último upload
    const getTimeAgo = (timestamp: number) => {
        const diffMs = currentTime - timestamp;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'agora mesmo';
        if (diffMins < 60) return `há ${diffMins} min`;
        if (diffHours < 24) return `há ${diffHours}h`;
        if (diffDays < 7) return `há ${diffDays}d`;
        return new Date(timestamp).toLocaleDateString('pt-BR');
    };
    
    // Função para adicionar log de auditoria (compartilhado com Settings)
    const addAuditLog = (action: string) => {
        const now = new Date();
        const formattedDate = now.toLocaleDateString('pt-BR');
        const formattedTime = now.toLocaleTimeString('pt-BR');
        const newLog = {
            id: Date.now().toString(),
            action,
            timestamp: `${formattedDate} às ${formattedTime}`
        };

        // Carrega logs existentes do localStorage (chave compartilhada com Settings)
        const savedLogs = localStorage.getItem('auditLogs');
        let existingLogs: Array<{ id: string; action: string; timestamp: string }> = [];
        try {
            if (savedLogs) {
                existingLogs = JSON.parse(savedLogs);
            }
        } catch (error) {
            console.error('Erro ao carregar logs do localStorage', error);
        }

        const updatedLogs = [newLog, ...existingLogs].slice(0, 10); // Mantém apenas os 10 últimos
        localStorage.setItem('auditLogs', JSON.stringify(updatedLogs));
    };
    
    // Estados dos filtros
    const [filters, setFilters] = useState({
        busca: '',
        categoria: '',
        visibilidade: '',
        ano: ''
    });
    
    // Lista de documentos focada em gestão
    const [documents, setDocuments] = useState([
        { id: 1, nome: 'Balancete_2025_Q4.pdf', categoria: 'Financeiro', ano: '2025', visibilidade: 'Público' },
        { id: 2, nome: 'Estatuto_Social.pdf', categoria: 'Jurídico', ano: '2024', visibilidade: 'Público' },
        { id: 3, nome: 'Plano_Anual_2025.pdf', categoria: 'Planejamento', ano: '2025', visibilidade: 'Privado' },
        { id: 4, nome: 'Relatório_Atividades.pdf', categoria: 'Administrativo', ano: '2024', visibilidade: 'Público' },
        { id: 5, nome: 'Auditoria_Externa.pdf', categoria: 'Financeiro', ano: '2025', visibilidade: 'Restrito' },
        { id: 6, nome: 'Política_Privacidade.pdf', categoria: 'Jurídico', ano: '2024', visibilidade: 'Público' },
    ]);

    // Mapa de categorias do modal para categorias da tabela
    const categoryMap: Record<string, string> = {
        'ensa': 'Institucional',
        'social': 'Promoção Social',
        'cpfl': 'Convênio CPFL',
        'educacao': 'Educação'
    };

    // Função para adicionar novo documento
    const handleUpload = (uploadData: { nome: string; arquivo: File; ano: string; visibilidade: string; categoria: string }) => {
        const newDocument = {
            id: Math.max(...documents.map(d => d.id), 0) + 1,
            nome: uploadData.arquivo.name,
            categoria: categoryMap[uploadData.categoria] || uploadData.categoria,
            ano: uploadData.ano,
            visibilidade: uploadData.visibilidade
        };
        
        setDocuments([newDocument, ...documents]);
        
        // Atualiza o timestamp do último upload
        const now = Date.now();
        setLastUploadTime(now);
        localStorage.setItem('lastTransparencyUpload', now.toString());
        
        addAuditLog(`📤 Arquivo enviado: ${uploadData.arquivo.name} (${uploadData.categoria})`);
    };

    // Função para visualizar documento
    const handleView = (docName: string) => {
        // Simula a abertura de um PDF em nova aba
        // Em produção, você substituiria isto por um URL real do servidor
        const pdfUrl = `https://exemplo.com/pdfs/${encodeURIComponent(docName)}`;
        window.open(pdfUrl, '_blank');
    };

    // Função para abrir modal de confirmação de exclusão
    const openDeleteModal = (docId: number) => {
        setDocumentToDelete(docId);
        setDeleteModalOpen(true);
    };

    // Função para confirmar exclusão
    const handleConfirmDelete = () => {
        if (documentToDelete !== null) {
            setIsDeleting(true);
            
            // Encontra o documento a ser deletado para logar
            const docToDelete = documents.find(doc => doc.id === documentToDelete);
            
            // Simula delay de exclusão
            setTimeout(() => {
                setDocuments(documents.filter(doc => doc.id !== documentToDelete));
                if (docToDelete) {
                    addAuditLog(`🗑️ Arquivo removido: ${docToDelete.nome}`);
                }
                setIsDeleting(false);
                setDeleteModalOpen(false);
                setDocumentToDelete(null);
            }, 800);
        }
    };

    // Função para abrir modal de edição
    const handleEdit = (docId: number) => {
        setDocumentToEdit(docId);
        setEditModalOpen(true);
    };

    // Função para salvar edição
    const handleSaveEdit = (updatedDocument: { id: number; nome: string; categoria: string; ano: string; visibilidade: string }) => {
        setIsSaving(true);

        // Simula delay de salvamento
        setTimeout(() => {
            const oldDocument = documents.find(doc => doc.id === updatedDocument.id);
            setDocuments(documents.map(doc => 
                doc.id === updatedDocument.id ? updatedDocument : doc
            ));
            if (oldDocument) {
                addAuditLog(`✏️ Arquivo editado: ${updatedDocument.nome}`);
            }
            setIsSaving(false);
            setEditModalOpen(false);
            setDocumentToEdit(null);
        }, 800);
    };

    // Extrair valores únicos para os filtros
    const categorias = useMemo(() => [...new Set(documents.map(doc => doc.categoria))], [documents]);
    const anos = useMemo(() => [...new Set(documents.map(doc => doc.ano))].sort().reverse(), [documents]);
    const visibilidades = ['Público', 'Privado', 'Restrito'];

    // Documentos filtrados
    const documentosFiltrados = useMemo(() => {
        return documents.filter(doc => {
            const buscaMatch = doc.nome.toLowerCase().includes(filters.busca.toLowerCase());
            const categoriaMatch = !filters.categoria || doc.categoria === filters.categoria;
            const visibilidadeMatch = !filters.visibilidade || doc.visibilidade === filters.visibilidade;
            const anoMatch = !filters.ano || doc.ano === filters.ano;
            
            return buscaMatch && categoriaMatch && visibilidadeMatch && anoMatch;
        });
    }, [documents, filters]);

    // Lógica de Paginação
    const totalPages = Math.ceil(documentosFiltrados.length / itemsPerPage);
    
    // Derivar página válida (resetar se exceder totalPages após filtro)
    const validCurrentPage = currentPage > totalPages ? 1 : currentPage;
    const startIndex = (validCurrentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const documentosPaginados = documentosFiltrados.slice(startIndex, endIndex);

    const handlePreviousPage = () => {
        setCurrentPage(prev => Math.max(prev - 1, 1));
    };

    const handleNextPage = () => {
        setCurrentPage(prev => Math.min(prev + 1, totalPages || 1));
    };

    const handlePageInput = (page: string) => {
        const pageNum = parseInt(page) || 1;
        const validPage = Math.max(1, Math.min(pageNum, totalPages || 1));
        setCurrentPage(validPage);
    };

    // Limpar filtros
    const limparFiltros = () => {
        setFilters({ busca: '', categoria: '', visibilidade: '', ano: '' });
    };

    // Contar filtros ativos
    const filtrosAtivos = Object.values(filters).filter(f => f !== '').length;

    // Função para renderizar badge de visibilidade
    const renderVisibilidadeBadge = (visibilidade: string) => {
        const styles = {
            'Público': 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
            'Privado': 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300',
            'Restrito': 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
        };

        const icons = {
            'Público': <Globe size={14} className="inline mr-1" />,
            'Privado': <Eye size={14} className="inline mr-1" />,
            'Restrito': <Lock size={14} className="inline mr-1" />
        };

        return (
            <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold ${styles[visibilidade as keyof typeof styles] || styles['Público']}`}>
                {icons[visibilidade as keyof typeof icons]}
                {visibilidade}
            </span>
        );
    };

    return (
        <div className="space-y-4 sm:space-y-6 p-4 md:p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row md:flex-row md:justify-between md:items-center gap-4 bg-white dark:bg-slate-900 p-4 md:p-6 lg:p-8 rounded-2xl md:rounded-2xl lg:rounded-4xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="min-w-0 flex-1">
            <h1 className="text-xl sm:text-2xl md:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Gestão de Transparência</h1>
            <p className="text-xs sm:text-sm md:text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">Controle total sobre os documentos públicos da instituição.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 items-start md:items-center">
                {/* Indicador de Último Upload */}
                {lastUploadTime && (
                    <div className="flex items-center gap-2 px-3 md:px-4 py-2 md:py-2.5 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/50 rounded-lg">
                        <div className="relative flex items-center justify-center">
                            <Clock size={16} className="text-green-600 dark:text-green-400" />
                            <div className="absolute inset-0 rounded-full animate-pulse bg-green-400/20"></div>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs font-semibold text-green-700 dark:text-green-300">Último upload</span>
                            <span className="text-xs text-green-600 dark:text-green-400">{getTimeAgo(lastUploadTime)}</span>
                        </div>
                    </div>
                )}
                <button 
                onClick={() => setIsModalOpen(true)}
                className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-4 md:px-6 py-2.5 md:py-3 rounded-xl font-bold flex items-center justify-center md:justify-start gap-2 transition-all shadow-lg shadow-blue-500/20 text-sm md:text-base shrink-0"
                >
                <Plus size={20} /> Novo PDF
                </button>
            </div>
        </div>

        {/* Botão de Filtro Avançado */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <button 
                onClick={() => setShowAdvancedFilter(!showAdvancedFilter)}
                className={`flex items-center justify-start gap-2 px-3 md:px-4 py-2 rounded-xl font-semibold transition-all text-sm md:text-base whitespace-nowrap ${
                    showAdvancedFilter 
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
            >
                <Filter size={18} />
                Filtro Avançado
                {filtrosAtivos > 0 && (
                    <span className="ml-2 bg-red-500 text-white rounded-full px-2 py-0.5 text-xs font-bold">
                        {filtrosAtivos}
                    </span>
                )}
            </button>
            <span className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 whitespace-nowrap">
                {documentosFiltrados.length} de {documents.length} documentos
            </span>
        </div>

        {/* Painel de Filtros Avançados */}
        {showAdvancedFilter && (
            <div className="bg-white dark:bg-slate-900 p-4 md:p-6 lg:p-8 rounded-2xl md:rounded-2xl lg:rounded-4xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
                    {/* Busca por Nome */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                            <Search size={16} /> Buscar por Nome
                        </label>
                        <input
                            type="text"
                            placeholder="Digite o nome do arquivo..."
                            value={filters.busca}
                            onChange={(e) => setFilters({ ...filters, busca: e.target.value })}
                            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        />
                    </div>

                    {/* Filtro de Categoria */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Categoria</label>
                        <select
                            value={filters.categoria}
                            onChange={(e) => setFilters({ ...filters, categoria: e.target.value })}
                            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
                        >
                            <option value="">Todas as categorias</option>
                            {categorias.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    {/* Filtro de Visibilidade */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Visibilidade</label>
                        <select
                            value={filters.visibilidade}
                            onChange={(e) => setFilters({ ...filters, visibilidade: e.target.value })}
                            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
                        >
                            <option value="">Todas as visibilidades</option>
                            {visibilidades.map(vis => (
                                <option key={vis} value={vis}>{vis}</option>
                            ))}
                        </select>
                    </div>

                    {/* Filtro de Ano */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Ano</label>
                        <select
                            value={filters.ano}
                            onChange={(e) => setFilters({ ...filters, ano: e.target.value })}
                            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
                        >
                            <option value="">Todos os anos</option>
                            {anos.map(ano => (
                                <option key={ano} value={ano}>{ano}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Botão Limpar Filtros */}
                {filtrosAtivos > 0 && (
                    <button
                        onClick={limparFiltros}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg font-semibold hover:bg-slate-300 dark:hover:bg-slate-700 transition-all"
                    >
                        <X size={18} /> Limpar todos os filtros
                    </button>
                )}
            </div>
        )}

        {/* Tabela de Gestão de PDFs - Desktop */}
        <div className="hidden lg:block bg-white dark:bg-slate-900 rounded-2xl lg:rounded-4xl border border-slate-200 dark:border-slate-800 overflow-x-auto shadow-sm">
            <table className="w-full text-left border-collapse">
            <thead>
                <tr className="bg-slate-50/50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-widest">
                <th className="px-4 sm:px-8 py-4 sm:py-5 font-bold">Arquivo</th>
                <th className="px-4 sm:px-8 py-4 sm:py-5 font-bold">Categoria / Ano</th>
                <th className="px-4 sm:px-8 py-4 sm:py-5 font-bold">Visibilidade</th>
                <th className="px-4 sm:px-8 py-4 sm:py-5 font-bold text-center">Ações</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {documentosPaginados.length > 0 ? (
                    documentosPaginados.map((doc) => (
                    <tr key={doc.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group">
                        <td className="px-4 sm:px-8 py-4 sm:py-5">
                        <div className="flex items-center gap-3">
                            <FileText className="text-red-500 shrink-0" size={20} />
                            <span className="font-bold text-slate-700 dark:text-slate-200 truncate">{doc.nome}</span>
                        </div>
                        </td>
                        <td className="px-4 sm:px-8 py-4 sm:py-5">
                        <div className="flex flex-col">
                            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase">{doc.categoria}</span>
                            <span className="text-sm text-slate-400">{doc.ano}</span>
                        </div>
                        </td>
                        <td className="px-4 sm:px-8 py-4 sm:py-5">
                        {renderVisibilidadeBadge(doc.visibilidade)}
                        </td>
                        <td className="px-4 sm:px-8 py-4 sm:py-5">
                        <div className="flex justify-center gap-2">
                            <button 
                                onClick={() => handleEdit(doc.id)}
                                className="p-2 text-slate-400 hover:text-amber-500 transition-colors" 
                                title="Editar"
                            >
                                <Edit size={18}/>
                            </button>
                            <button 
                                onClick={() => handleView(doc.nome)}
                                className="p-2 text-slate-400 hover:text-blue-500 transition-colors" 
                                title="Visualizar"
                            >
                                <Eye size={18}/>
                            </button>
                            <button 
                                onClick={() => openDeleteModal(doc.id)}
                                className="p-2 text-slate-400 hover:text-red-500 transition-colors" 
                                title="Excluir"
                            >
                                <Trash2 size={18}/>
                            </button>
                        </div>
                        </td>
                    </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan={4} className="px-4 sm:px-8 py-12 text-center">
                            <div className="flex flex-col items-center gap-3">
                                <FileText size={40} className="text-slate-300 dark:text-slate-700" />
                                <p className="text-slate-500 dark:text-slate-400 font-semibold">Nenhum documento encontrado</p>
                                <p className="text-xs text-slate-400 dark:text-slate-500">Tente ajustar seus filtros</p>
                            </div>
                        </td>
                    </tr>
                )}
            </tbody>
            </table>
        </div>

        {/* Cards para Mobile e Tablet - Substituem a Tabela */}
        <div className="lg:hidden space-y-3">
            {documentosPaginados.length > 0 ? (
                documentosPaginados.map((doc) => (
                    <div key={doc.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                        {/* Header do Card */}
                        <div className="flex items-start gap-3 mb-3">
                            <FileText className="text-red-500 shrink-0 mt-1" size={20} />
                            <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-slate-900 dark:text-white truncate text-sm md:text-base">{doc.nome}</h3>
                                <div className="flex items-center gap-2 mt-2 flex-wrap">
                                    <span className="text-xs md:text-sm font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded">{doc.categoria}</span>
                                    <span className="text-xs md:text-sm text-slate-500 dark:text-slate-400">{doc.ano}</span>
                                </div>
                            </div>
                        </div>

                        {/* Divisor */}
                        <div className="border-t border-slate-100 dark:border-slate-800 my-3"></div>

                        {/* Visibilidade e Ações */}
                        <div className="flex flex-col gap-3">
                            <div>{renderVisibilidadeBadge(doc.visibilidade)}</div>
                            <div className="flex gap-2 justify-start">
                                <button 
                                    onClick={() => handleEdit(doc.id)}
                                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-lg hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors text-sm md:text-base font-semibold"
                                    title="Editar"
                                >
                                    <Edit size={16}/>
                                    Editar
                                </button>
                                <button 
                                    onClick={() => handleView(doc.nome)}
                                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors text-sm md:text-base font-semibold"
                                    title="Visualizar"
                                >
                                    <Eye size={16}/>
                                    Ver
                                </button>
                                <button 
                                    onClick={() => openDeleteModal(doc.id)}
                                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors text-sm md:text-base font-semibold"
                                    title="Excluir"
                                >
                                    <Trash2 size={16}/>
                                    Excluir
                                </button>
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-8 text-center shadow-sm">
                    <FileText size={40} className="text-slate-300 dark:text-slate-700 mx-auto mb-3" />
                    <p className="text-slate-500 dark:text-slate-400 font-semibold mb-1">Nenhum documento encontrado</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500">Tente ajustar seus filtros</p>
                </div>
            )}
        </div>

        {/* Barra de Paginação */}
        {documentosFiltrados.length > 0 && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-sm">
                {/* Info de Itens */}
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <FileText size={16} className="text-slate-400" />
                    <span>
                        Mostrando <span className="font-semibold text-slate-900 dark:text-white">{startIndex + 1}</span> de{' '}
                        <span className="font-semibold text-slate-900 dark:text-white">{documentosFiltrados.length}</span> documentos
                    </span>
                </div>

                {/* Controles de Paginação */}
                <div className="flex items-center gap-2 justify-between sm:justify-end">
                    {/* Botão Anterior */}
                    <button
                        onClick={handlePreviousPage}
                        disabled={validCurrentPage === 1}
                        className="p-2 text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
                        title="Página anterior"
                    >
                        <ChevronLeft size={18} />
                    </button>

                    {/* Página Atual com Input */}
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-500 dark:text-slate-400">Página</span>
                        <input
                            type="number"
                            min="1"
                            max={totalPages || 1}
                            value={validCurrentPage}
                            onChange={(e) => handlePageInput(e.target.value)}
                            className="w-12 px-2 py-1 text-center text-sm font-semibold bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        />
                        <span className="text-xs text-slate-500 dark:text-slate-400">de {totalPages}</span>
                    </div>

                    {/* Botão Próximo */}
                    <button
                        onClick={handleNextPage}
                        disabled={validCurrentPage === totalPages}
                        className="p-2 text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
                        title="Próxima página"
                    >
                        <ChevronRight size={18} />
                    </button>
                </div>
            </div>
        )}

        <UploadModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onUpload={handleUpload} />
        
        {/* Modal de Confirmação de Exclusão */}
        <ConfirmDeleteModal
            isOpen={deleteModalOpen}
            documentName={documents.find(d => d.id === documentToDelete)?.nome || 'Documento'}
            onConfirm={handleConfirmDelete}
            onCancel={() => {
                setDeleteModalOpen(false);
                setDocumentToDelete(null);
            }}
            isDeleting={isDeleting}
        />

        {/* Modal de Edição */}
        <EditDocumentModal
            isOpen={editModalOpen}
            document={documents.find(d => d.id === documentToEdit) || null}
            onClose={() => {
                setEditModalOpen(false);
                setDocumentToEdit(null);
            }}
            onSave={handleSaveEdit}
            isLoading={isSaving}
        />
        </div>
    );
};

export default TransparencyAdmin;