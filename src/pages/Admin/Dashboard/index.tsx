import React, { useState, useEffect } from 'react';
import { 
    FileText, 
    MousePointer2, 
    Clock, 
    Plus, 
    Eye, 
    Edit2, 
    Trash2
} from 'lucide-react';
import UploadModal from '@/components/Admin/UploadModal';
import { useDocuments } from '@/hooks/useDocuments';

interface Document {
  id: number | string;
  title: string;
  category_id?: string;
  category?: string;
  year: string;
  visibilidade: 'public' | 'private' | 'restricted';
  file_url?: string;
  created_at?: string;
  updated_at?: string;
}

const Dashboard: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { documents, createDocument } = useDocuments();

    // Estado para rastrear o último upload (compartilhado com Transparência)
    const [lastUploadTime, setLastUploadTime] = useState<number | null>(() => {
        const saved = localStorage.getItem('lastDocumentUpload');
        return saved ? parseInt(saved) : null;
    });
    
    // Estado para forçar atualizações do tempo decorrido a cada 30 segundos
    const [currentTime, setCurrentTime] = useState(() => Date.now());

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(Date.now());
        }, 30000);

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

    // Função para formatar hora em 12h com AM/PM
    const formatTimeAMPM = (timestamp: number) => {
        const date = new Date(timestamp);
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const displayHours = hours % 12 || 12;
        const displayMinutes = minutes.toString().padStart(2, '0');
        return `${displayHours}:${displayMinutes} ${ampm}`;
    };

    // Função para calcular a label de "Última Atualização"
    const getLastUpdateLabel = () => {
        if (!lastUploadTime) return 'Sem dados';

        const updateDate = new Date(lastUploadTime);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        // Comparar apenas as datas (sem levarem em conta as horas)
        const isToday = updateDate.toDateString() === today.toDateString();
        const isYesterday = updateDate.toDateString() === yesterday.toDateString();

        if (isToday) {
            return 'Hoje';
        } else if (isYesterday) {
            return 'Ontem';
        } else {
            const diffDays = Math.floor((today.getTime() - updateDate.getTime()) / (1000 * 60 * 60 * 24));
            if (diffDays < 7) {
                return `Há ${diffDays} ${diffDays === 1 ? 'dia' : 'dias'}`;
            }
            return updateDate.toLocaleDateString('pt-BR');
        }
    };

    // Função para obter a hora da última atualização
    const getLastUpdateTime = () => {
        if (!lastUploadTime) return '--:--';
        return formatTimeAMPM(lastUploadTime);
    };

    // Mapa de categorias do modal para categorias da tabela
    const categoryMap: Record<string, string> = {
        'ensa': 'Institucional',
        'social': 'Promoção Social',
        'cpfl': 'Convênio CPFL',
        'educacao': 'Educação'
    };

    // Mapa de visibilidade (português → inglês)
    const visibilityMap: Record<string, 'public' | 'private' | 'restricted'> = {
        'Público': 'public',
        'Privado': 'private',
        'Restrito': 'restricted'
    };

    // Pega os 5 documentos mais recentes
    const recentDocs = documents
        .slice(0, 5);

    // Funções do Modal
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const handleUpload = async (uploadData: { nome: string; arquivo: File; ano: string; visibilidade: string; categoria: string }) => {
        const newDocument: Omit<Document, 'id' | 'created_at'> = {
            title: uploadData.arquivo.name,
            category: categoryMap[uploadData.categoria] || uploadData.categoria,
            year: uploadData.ano,
            visibilidade: visibilityMap[uploadData.visibilidade] || 'public'
        };
        
        const result = await createDocument(newDocument);
        if (result) {
            // Atualiza o timestamp do último upload (compartilhado)
            const now = Date.now();
            setLastUploadTime(now);
            localStorage.setItem('lastDocumentUpload', now.toString());
        }
        closeModal();
    };

    return (
        <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-700">
            {/* Cabeçalho - Responsivo */}
            <div className="flex flex-col sm:flex-row md:flex-row md:justify-between md:items-center gap-4">
                <div className="min-w-0 flex-1">
                    <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white truncate">Visão Geral</h1>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">Bem-vindo ao painel administrativo.</p>
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
                        onClick={openModal}
                        className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-4 md:px-6 py-2.5 md:py-3 rounded-xl font-bold flex items-center justify-center md:justify-start gap-2 transition-all shadow-lg shadow-blue-500/20 text-sm md:text-base shrink-0">
                        <Plus size={20} /> 
                        <span className="hidden md:inline">Novo Documento</span>
                        <span className="md:hidden">Novo</span>
                    </button>
                </div>
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
                    value={getLastUpdateLabel()} 
                    icon={<Clock size={24} className="text-amber-600 dark:text-amber-400" />} 
                    trend={getLastUpdateTime()}
                />
            </div>

            {/* Tabela de Documentos Recentes - Resumo Operacional */}
            <div className="bg-white dark:bg-slate-900 rounded-xl sm:rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm transition-colors duration-300">
                <div className="p-3 sm:p-6 border-b border-slate-100 dark:border-slate-800">
                    <h2 className="font-bold text-slate-800 dark:text-white text-base sm:text-lg">Documentos Recentes</h2>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">Últimos 5 documentos adicionados ao sistema</p>
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
                                            <span className="font-medium text-slate-700 dark:text-slate-200 truncate">{doc.title}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 sm:px-6 py-4 text-slate-500 dark:text-slate-400 text-sm font-medium">{doc.year}</td>
                                    <td className="px-4 sm:px-6 py-4 text-center">
                                        <span className={`px-3 py-1 text-xs font-bold rounded-full uppercase ${
                                            doc.visibilidade === 'public' 
                                                ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
                                                : doc.visibilidade === 'private'
                                                ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                                                : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                                        }`}>
                                            {doc.visibilidade === 'public' ? 'Público' : doc.visibilidade === 'private' ? 'Privado' : 'Restrito'}
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
                                            <p className="font-semibold text-slate-900 dark:text-white text-sm truncate">{doc.title}</p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Ano: <span className="font-medium">{doc.year}</span></p>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between gap-3">
                                        <span className={`px-3 py-1 text-xs font-bold rounded-full uppercase ${
                                            doc.visibilidade === 'public' 
                                                ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
                                                : doc.visibilidade === 'private'
                                                ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                                                : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                                        }`}>
                                            {doc.visibilidade === 'public' ? 'Público' : doc.visibilidade === 'private' ? 'Privado' : 'Restrito'}
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
                {recentDocs.length === 0 && (
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