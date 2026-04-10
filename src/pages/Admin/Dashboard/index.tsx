import React, { useState } from 'react';
import { 
    FileText, 
    MousePointer2, 
    Clock, 
    Plus, 
    Eye, 
    Edit2, 
    Trash2, 
    Search
} from 'lucide-react';
import UploadModal from '@/components/Admin/UploadModal';

const Dashboard: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const [docs, setDocs] = useState([
        { id: 1, nome: 'Balancete_Anual_2025.pdf', ano: '2025', status: 'Público' },
        { id: 2, nome: 'Ata_Assembleia_Março.pdf', ano: '2026', status: 'Público' },
        { id: 3, nome: 'Estatuto_Social_Atualizado.pdf', ano: '2024', status: 'Público' },
        { id: 4, nome: 'Relatório_Financeiro_Q1.pdf', ano: '2026', status: 'Público' },
        { id: 5, nome: 'Parecer_Auditoria.pdf', ano: '2025', status: 'Público' },
        { id: 6, nome: 'Plano_Anual_2026.pdf', ano: '2026', status: 'Público' },
        { id: 7, nome: 'Minuta_Contrato.pdf', ano: '2026', status: 'Público' },
    ]);

    const filteredDocs = docs.filter(doc => 
        doc.nome.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Pega os 5 documentos mais recentes, com o mais recente em primeiro lugar
    const recentDocs = docs
        .slice()
        .sort((a, b) => b.id - a.id)
        .slice(0, 5);

    // Funções do Modal
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const handleUpload = (uploadData: { nome: string; arquivo: File; ano: string; visibilidade: string; categoria: string }) => {
        // Gera novo ID (maior ID + 1)
        const newId = docs.length > 0 ? Math.max(...docs.map(d => d.id)) + 1 : 1;
        
        // Cria novo documento
        const newDoc = {
            id: newId,
            nome: uploadData.arquivo.name,
            ano: uploadData.ano,
            status: uploadData.visibilidade
        };
        
        // Adiciona ao topo da lista
        setDocs([newDoc, ...docs]);
        closeModal();
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
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 shrink-0" size={16} />
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
                            {recentDocs.map((doc) => (
                                <tr key={doc.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group">
                                    <td className="px-4 sm:px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded-lg text-red-600 dark:text-red-400 shrink-0">
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
                    {recentDocs.length > 0 ? (
                        <div className="space-y-2 p-3 sm:p-4">
                            {recentDocs.map((doc) => (
                                <div key={doc.id} className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
                                    <div className="flex items-start gap-3 mb-3">
                                        <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded-lg text-red-600 dark:text-red-400 shrink-0">
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

        <UploadModal isOpen={isModalOpen} onClose={closeModal} onUpload={handleUpload} />
        </div>
    );
};

// Sub-componente MetricCard
const MetricCard = ({ title, value, icon, trend }: { title: string, value: string, icon: React.ReactNode, trend: string }) => (
    <div className="bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-lg sm:rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm group hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300">
        <div className="flex justify-between items-start mb-3 sm:mb-4 gap-2">
            <div className="p-2 sm:p-3 bg-slate-50 dark:bg-slate-800 rounded-lg sm:rounded-2xl group-hover:scale-110 transition-transform shrink-0">
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