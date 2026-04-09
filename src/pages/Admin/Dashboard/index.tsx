import React, { useState } from 'react';
import { 
    FileText, 
    MousePointer2, 
    Clock, 
    Plus, 
    Eye, 
    Edit2, 
    Trash2, 
    Search,
    X,
    Upload,
    File,
    AlertCircle
} from 'lucide-react';

const Dashboard: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [fileError, setFileError] = useState('');
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB em bytes
    
    const [docs, setDocs] = useState([
        { id: 1, nome: 'Balancete_Anual_2025.pdf', ano: '2025', status: 'Público' },
        { id: 2, nome: 'Ata_Assembleia_Março.pdf', ano: '2026', status: 'Público' },
        { id: 3, nome: 'Estatuto_Social_Atualizado.pdf', ano: '2024', status: 'Público' },
    ]);
    const [uploadForm, setUploadForm] = useState({
        nome: '',
        arquivo: null as File | null,
        ano: new Date().getFullYear().toString(),
        visibilidade: 'Público'
    });

    const filteredDocs = docs.filter(doc => 
        doc.nome.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Funções do Modal
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => {
        setIsModalOpen(false);
        setFileError('');
        setUploadForm({
            nome: '',
            arquivo: null,
            ano: new Date().getFullYear().toString(),
            visibilidade: 'Público'
        });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        
        if (!file) {
            setFileError('');
            return;
        }

        // Validar tipo de arquivo
        if (file.type !== 'application/pdf') {
            setFileError('❌ Apenas arquivos PDF são permitidos');
            setUploadForm({ ...uploadForm, arquivo: null });
            return;
        }

        // Validar tamanho do arquivo
        if (file.size > MAX_FILE_SIZE) {
            const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
            setFileError(`❌ Arquivo muito grande (${fileSizeMB}MB). Máximo: 10MB`);
            setUploadForm({ ...uploadForm, arquivo: null });
            return;
        }

        // Arquivo válido
        setFileError('');
        setUploadForm({ ...uploadForm, arquivo: file });
    };

    const handleSubmitUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!uploadForm.nome.trim()) {
            alert('Por favor, insira um nome para o documento');
            return;
        }
        
        if (!uploadForm.arquivo) {
            alert('Por favor, selecione um arquivo PDF válido');
            return;
        }

        // Validação adicional no envio
        if (uploadForm.arquivo.type !== 'application/pdf') {
            setFileError('❌ Apenas arquivos PDF são permitidos');
            return;
        }

        if (uploadForm.arquivo.size > MAX_FILE_SIZE) {
            setFileError('❌ Arquivo muito grande. Máximo: 10MB');
            return;
        }

        setUploading(true);
        // Simula upload
        setTimeout(() => {
            // Gera novo ID (maior ID + 1)
            const newId = docs.length > 0 ? Math.max(...docs.map(d => d.id)) + 1 : 1;
            
            // Cria novo documento
            const newDoc = {
                id: newId,
                nome: `${uploadForm.nome}${uploadForm.nome.endsWith('.pdf') ? '' : '.pdf'}`,
                ano: uploadForm.ano,
                status: uploadForm.visibilidade
            };
            
            // Adiciona ao topo da lista
            setDocs([newDoc, ...docs]);
            
            setUploading(false);
            closeModal();
            
            // Feedback visual
            alert(`Documento "${newDoc.nome}" enviado com sucesso!`);
        }, 1500);
    };

    return (
        <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-700">
            {/* Cabeçalho - Responsivo */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                <div className="min-w-0">
                    <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white truncate">Visão Geral</h1>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">Bem-vindo ao painel administrativo.</p>
                </div>
                <button 
                    onClick={openModal}
                    className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base transition-all shadow-lg shadow-blue-500/20 active:scale-95 flex-shrink-0">
                    <Plus size={18} className="sm:w-5 sm:h-5" />
                    <span className="hidden sm:inline">Novo Documento</span>
                    <span className="sm:hidden">Novo</span>
                </button>
            </div>

            {/* Grid de Métricas - Responsivo */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
                <MetricCard 
                    title="Documentos Públicos" 
                    value="14" 
                    icon={<FileText size={24} className="text-blue-600 dark:text-blue-400" />} 
                    trend="Ativos no site"
                />
                <MetricCard 
                    title="Cliques no PIX" 
                    value="89" 
                    icon={<MousePointer2 size={24} className="text-emerald-600 dark:text-emerald-400" />} 
                    trend="Este mês"
                />
                <MetricCard 
                    title="Última Atualização" 
                    value="Hoje" 
                    icon={<Clock size={24} className="text-amber-600 dark:text-amber-400" />} 
                    trend="10:45 AM"
                />
            </div>

            {/* Tabela de Documentos - Responsiva com versão Mobile */}
            <div className="bg-white dark:bg-slate-900 rounded-xl sm:rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm transition-colors duration-300">
                <div className="p-3 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                    <h2 className="font-bold text-slate-800 dark:text-white text-base sm:text-lg">Documentos Recentes</h2>
                    <div className="relative w-full sm:w-auto">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 flex-shrink-0" size={16} />
                        <input 
                            type="text"
                            placeholder="Pesquisar..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg sm:rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-700 dark:text-slate-200"
                        />
                    </div>
                </div>

                {/* Versão Desktop - Tabela */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">
                                <th className="px-4 sm:px-6 py-3 sm:py-4 font-semibold">Nome do Arquivo</th>
                                <th className="px-4 sm:px-6 py-3 sm:py-4 font-semibold">Ano</th>
                                <th className="px-4 sm:px-6 py-3 sm:py-4 font-semibold text-center">Status</th>
                                <th className="px-4 sm:px-6 py-3 sm:py-4 font-semibold text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {filteredDocs.map((doc) => (
                                <tr key={doc.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group">
                                    <td className="px-4 sm:px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded-lg text-red-600 dark:text-red-400 flex-shrink-0">
                                                <FileText size={18} />
                                            </div>
                                            <span className="font-medium text-slate-700 dark:text-slate-200 truncate">{doc.nome}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 sm:px-6 py-4 text-slate-500 dark:text-slate-400 text-sm font-medium">{doc.ano}</td>
                                    <td className="px-4 sm:px-6 py-4 text-center">
                                        <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold rounded-full uppercase">
                                            {doc.status}
                                        </span>
                                    </td>
                                    <td className="px-4 sm:px-6 py-4">
                                        <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all">
                                            <button className="p-2 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg" title="Visualizar">
                                                <Eye size={18} />
                                            </button>
                                            <button className="p-2 text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg" title="Editar">
                                                <Edit2 size={18} />
                                            </button>
                                            <button className="p-2 text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg" title="Excluir">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Versão Mobile - Cards */}
                <div className="md:hidden">
                    {filteredDocs.length > 0 ? (
                        <div className="space-y-2 p-3 sm:p-4">
                            {filteredDocs.map((doc) => (
                                <div key={doc.id} className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
                                    <div className="flex items-start gap-3 mb-3">
                                        <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded-lg text-red-600 dark:text-red-400 flex-shrink-0">
                                            <FileText size={18} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-slate-900 dark:text-white text-sm truncate">{doc.nome}</p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Ano: <span className="font-medium">{doc.ano}</span></p>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between gap-3">
                                        <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold rounded-full uppercase">
                                            {doc.status}
                                        </span>
                                        <div className="flex gap-2">
                                            <button className="p-2 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg" title="Visualizar">
                                                <Eye size={16} />
                                            </button>
                                            <button className="p-2 text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg" title="Editar">
                                                <Edit2 size={16} />
                                            </button>
                                            <button className="p-2 text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg" title="Excluir">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-8 text-center">
                            <p className="text-slate-500 dark:text-slate-400">Nenhum documento encontrado</p>
                        </div>
                    )}
                </div>

                {/* Tabela Vazia */}
                {filteredDocs.length === 0 && (
                    <div className="hidden md:flex p-8 justify-center">
                        <p className="text-slate-500 dark:text-slate-400">Nenhum documento encontrado</p>
                    </div>
                )}
            </div>

            {/* Modal de Upload - Glassmorphism */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
                    {/* Overlay com Backdrop Blur */}
                    <div 
                        className="absolute inset-0 bg-slate-900/50 dark:bg-slate-950/70 backdrop-blur-md transition-opacity duration-300"
                        onClick={closeModal}
                    />

                    {/* Modal Container */}
                    <div className="relative bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-white/20 dark:border-slate-700/20 shadow-2xl w-full max-w-md sm:max-w-lg max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-300">
                        
                        {/* Header */}
                        <div className="sticky top-0 p-4 sm:p-6 border-b border-slate-200 dark:border-slate-800/50 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm flex items-center justify-between">
                            <div>
                                <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">Novo Documento</h3>
                                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">Upload de arquivo para a transparência</p>
                            </div>
                            <button
                                onClick={closeModal}
                                className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors flex-shrink-0"
                                title="Fechar"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Formulário */}
                        <form onSubmit={handleSubmitUpload} className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                            {/* Campo de Nome */}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-800 dark:text-slate-300">
                                    Nome do Documento
                                </label>
                                <input
                                    type="text"
                                    placeholder="ex: Balanço Anual 2025"
                                    value={uploadForm.nome}
                                    onChange={(e) => setUploadForm({ ...uploadForm, nome: e.target.value })}
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
                                    value={uploadForm.ano}
                                    onChange={(e) => setUploadForm({ ...uploadForm, ano: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-white dark:bg-slate-950/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                />
                            </div>

                            {/* Campo de Visibilidade */}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-800 dark:text-slate-300">
                                    Visibilidade
                                </label>
                                <select
                                    value={uploadForm.visibilidade}
                                    onChange={(e) => setUploadForm({ ...uploadForm, visibilidade: e.target.value })}
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
                                            {fileError ? fileError : (uploadForm.arquivo ? uploadForm.arquivo.name : 'Clique para selecionar')}
                                        </p>
                                        <p className={`text-xs mt-1 ${
                                            fileError 
                                                ? 'text-red-500 dark:text-red-400' 
                                                : 'text-slate-500 dark:text-slate-400'
                                        }`}>
                                            {fileError ? 'Tente novamente' : (uploadForm.arquivo ? `${(uploadForm.arquivo.size / 1024).toFixed(1)} KB` : 'Máximo 10 MB - Apenas PDF')}
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
                                    disabled={uploading || !uploadForm.arquivo || fileError !== ''}
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-500 disabled:cursor-not-allowed text-white rounded-lg font-medium text-sm transition-all"
                                    title={fileError ? 'Selecione um arquivo PDF válido (máx 10MB)' : ''}
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
            )}
        </div>
    );
};

// Sub-componente responsivo MetricCard
const MetricCard = ({ title, value, icon, trend }: { title: string, value: string, icon: React.ReactNode, trend: string }) => (
    <div className="bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-lg sm:rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm group hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300">
        <div className="flex justify-between items-start mb-3 sm:mb-4 gap-2">
            <div className="p-2 sm:p-3 bg-slate-50 dark:bg-slate-800 rounded-lg sm:rounded-2xl group-hover:scale-110 transition-transform flex-shrink-0">
                <div className="scale-75 sm:scale-100 origin-top-left">
                    {icon}
                </div>
            </div>
            <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest text-right">{trend}</span>
        </div>
        <div>
            <h3 className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm font-medium">{title}</h3>
            <p className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-1">{value}</p>
        </div>
    </div>
);

export default Dashboard;