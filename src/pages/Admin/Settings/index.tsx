import React, { useState, useRef } from 'react';
import { User, Mail, Shield, Lock, Eye, EyeOff, Check, AlertCircle, History, Upload, Trash2 } from 'lucide-react';

const Settings: React.FC = () => {
    // Valores padrão
    const defaultProfile = {
        displayName: 'Admin Iago',
        email: 'iago@educandario.com.br'
    };

    const defaultPortal = {
        description: 'Instituição dedicada à promoção de educação de qualidade e inclusão social, com foco em transparência e responsabilidade com a comunidade.',
        website: 'https://www.educandario.com.br',
        phone: '(11) 3456-7890'
    };

    // Estado do Perfil (carregado do localStorage)
    const [profileData, setProfileData] = useState(() => {
        const savedProfile = localStorage.getItem('adminProfile');
        try {
            if (savedProfile) {
                return JSON.parse(savedProfile);
            }
        } catch (error) {
            console.error('Erro ao carregar perfil do localStorage', error);
        }
        return defaultProfile;
    });

    // Estado do Avatar (carregado do localStorage)
    const [avatarUrl, setAvatarUrl] = useState<string | null>(() => {
        return localStorage.getItem('adminAvatar');
    });

    // Referência para o input file
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Estado da Descrição do Portal (carregado do localStorage)
    const [portalData, setPortalData] = useState(() => {
        const savedPortal = localStorage.getItem('adminPortal');
        try {
            if (savedPortal) {
                return JSON.parse(savedPortal);
            }
        } catch (error) {
            console.error('Erro ao carregar portal do localStorage', error);
        }
        return defaultPortal;
    });

    // Estado de Segurança
    const [securityData, setSecurityData] = useState({
        twoFAEnabled: false,
        lastPasswordChange: '15 de março de 2026'
    });

    // Estado de logs de auditoria (persiste em localStorage)
    const [auditLogs, setAuditLogs] = useState<Array<{ id: string; action: string; timestamp: string }>>(() => {
        const savedLogs = localStorage.getItem('auditLogs');
        try {
            if (savedLogs) {
                return JSON.parse(savedLogs);
            }
        } catch (error) {
            console.error('Erro ao carregar logs do localStorage', error);
        }
        return [];
    });

    // Estado de edição
    const [editingProfile, setEditingProfile] = useState(false);
    const [editingPortal, setEditingPortal] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);

    // Estado de formulário de senha
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [passwordError, setPasswordError] = useState('');
    const [passwordSuccess, setPasswordSuccess] = useState(false);

    // Estados de feedback do Perfil
    const [profileError, setProfileError] = useState('');
    const [profileSuccess, setProfileSuccess] = useState(false);

    // Estados de feedback do Portal
    const [portalError, setPortalError] = useState('');
    const [portalSuccess, setPortalSuccess] = useState(false);

    // Estado de feedback do 2FA
    const [twoFASuccess, setTwoFASuccess] = useState('');
    const [twoFAMessage, setTwoFAMessage] = useState('');

    // Função para adicionar log de auditoria
    const addAuditLog = (action: string) => {
        const now = new Date();
        const formattedDate = now.toLocaleDateString('pt-BR');
        const formattedTime = now.toLocaleTimeString('pt-BR');
        const newLog = {
            id: Date.now().toString(),
            action,
            timestamp: `${formattedDate} às ${formattedTime}`
        };

        const updatedLogs = [newLog, ...auditLogs].slice(0, 10); // Mantém apenas os 10 últimos
        setAuditLogs(updatedLogs);
        localStorage.setItem('auditLogs', JSON.stringify(updatedLogs));
    };

    // Função para lidar com upload de avatar
    const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validar tipo de arquivo
            if (!file.type.startsWith('image/')) {
                setProfileError('Por favor, selecione uma imagem válida (PNG, JPG, etc.)');
                return;
            }

            // Validar tamanho (máx 5MB)
            if (file.size > 5 * 1024 * 1024) {
                setProfileError('A imagem não pode exceder 5MB');
                return;
            }

            // Converter para Base64
            const reader = new FileReader();
            reader.onload = (event) => {
                const result = event.target?.result as string;
                setAvatarUrl(result);
                localStorage.setItem('adminAvatar', result);
                setProfileError('');
                setProfileSuccess(true);
                addAuditLog(`📷 Foto de perfil atualizada`);
                window.dispatchEvent(new CustomEvent('avatarUpdated'));
                setTimeout(() => setProfileSuccess(false), 3000);
            };
            reader.readAsDataURL(file);
        }
    };

    // Função para remover avatar
    const handleRemoveAvatar = () => {
        setAvatarUrl(null);
        localStorage.removeItem('adminAvatar');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        addAuditLog(`📷 Foto de perfil removida`);
        window.dispatchEvent(new CustomEvent('avatarUpdated'));
        setProfileSuccess(true);
        setTimeout(() => setProfileSuccess(false), 3000);
    };

    // Handlers de Perfil
    const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setProfileData(prev => ({ ...prev, [name]: value }));
    };

    const handleSaveProfile = () => {
        if (!profileData.displayName.trim() || !profileData.email.trim()) {
            setProfileError('Todos os campos são obrigatórios');
            setTimeout(() => setProfileError(''), 4000);
            return;
        }
        
        // Salvar no localStorage
        localStorage.setItem('adminProfile', JSON.stringify(profileData));
        
        // Disparar evento customizado para atualizar o header
        window.dispatchEvent(new CustomEvent('profileUpdated', { detail: profileData }));
        
        // Adicionar log de auditoria
        addAuditLog(`Perfil atualizado: ${profileData.displayName}`);
        
        setProfileSuccess(true);
        setTimeout(() => setProfileSuccess(false), 3000);
        setEditingProfile(false);
    };

    // Handlers de Portal
    const handlePortalChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setPortalData(prev => ({ ...prev, [name]: value }));
    };

    const handleSavePortal = () => {
        if (!portalData.description.trim()) {
            setPortalError('A descrição é obrigatória');
            setTimeout(() => setPortalError(''), 4000);
            return;
        }
        
        // Salvar no localStorage
        localStorage.setItem('adminPortal', JSON.stringify(portalData));
        
        // Adicionar log de auditoria
        addAuditLog('Configurações do portal atualizadas');
        
        setPortalSuccess(true);
        setTimeout(() => setPortalSuccess(false), 3000);
        setEditingPortal(false);
    };

    // Handlers de Segurança
    const handleToggle2FA = () => {
        const newStatus = !securityData.twoFAEnabled;
        setSecurityData(prev => ({
            ...prev,
            twoFAEnabled: newStatus
        }));
        
        // Adicionar log de auditoria
        addAuditLog(`Autenticação de Dois Fatores ${newStatus ? 'ativada' : 'desativada'}`);
        
        setTwoFAMessage(newStatus ? 'ativada' : 'desativada');
        setTwoFASuccess('true');
        setTimeout(() => setTwoFASuccess(''), 3000);
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPasswordForm(prev => ({ ...prev, [name]: value }));
        setPasswordError('');
    };

    const handleChangePassword = () => {
        if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
            setPasswordError('Todos os campos são obrigatórios');
            return;
        }

        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            setPasswordError('As senhas não coincidem');
            return;
        }

        if (passwordForm.newPassword.length < 8) {
            setPasswordError('A nova senha deve ter pelo menos 8 caracteres');
            return;
        }

        // Simula sucesso
        setPasswordSuccess(true);
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setShowPasswordModal(false);
        setTimeout(() => setPasswordSuccess(false), 3000);
    };

    return (
        <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-700">
            {/* Cabeçalho */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                <div className="min-w-0">
                    <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white truncate">Configurações</h1>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">Gerencie seu perfil, portal e segurança</p>
                </div>
            </div>

            {/* Layout em Grid - Responsivo */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
                {/* Coluna Esquerda - Perfil e Portal */}
                <div className="lg:col-span-2 space-y-6 sm:space-y-8">
                    {/* Bloco de Perfil */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-[2.5rem] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm transition-all hover:shadow-md">
                        {/* Header */}
                        <div className="p-4 sm:p-6 lg:p-8 border-b border-slate-100 dark:border-slate-800/50 bg-linear-to-r from-blue-50/50 to-purple-50/50 dark:from-slate-900/50 dark:to-slate-800/50">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 sm:p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl sm:rounded-2xl">
                                    <User className="text-blue-600 dark:text-blue-400" size={20} />
                                </div>
                                <div>
                                    <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">Perfil</h2>
                                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">Edite suas informações pessoais</p>
                                </div>
                            </div>
                        </div>

                        {/* Conteúdo */}
                        <div className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
                            {/* Seção de Avatar */}
                            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
                                {/* Avatar Display */}
                                <div className="relative">
                                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-linear-to-br from-blue-400 to-cyan-400 flex items-center justify-center shadow-lg overflow-hidden border-4 border-white dark:border-slate-800 hover:shadow-2xl transition-all">
                                        {avatarUrl ? (
                                            <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                                        ) : (
                                            <User className="text-white" size={48} />
                                        )}
                                    </div>
                                    
                                    {/* Overlay de Upload */}
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        className="absolute bottom-0 right-0 p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all"
                                        title="Upload de foto"
                                    >
                                        <Upload size={16} />
                                    </button>
                                </div>

                                {/* Info do Avatar */}
                                <div className="flex-1">
                                    <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mb-2">Foto de Perfil</h3>
                                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-3">
                                        {avatarUrl ? 'Clique no ícone de câmera para atualizar' : 'Adicione uma foto de perfil para personalizar sua conta'}
                                    </p>
                                    
                                    {/* Botões de Ação */}
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => fileInputRef.current?.click()}
                                            className="flex items-center justify-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-all"
                                        >
                                            <Upload size={14} />
                                            Enviar
                                        </button>
                                        {avatarUrl && (
                                            <button
                                                onClick={handleRemoveAvatar}
                                                className="flex items-center justify-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-all"
                                            >
                                                <Trash2 size={14} />
                                                Remover
                                            </button>
                                        )}
                                    </div>

                                    {/* Info de Tamanho */}
                                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">Máximo 5MB • PNG, JPG ou GIF</p>
                                </div>

                                {/* Input File Oculto */}
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleAvatarUpload}
                                    className="hidden"
                                    aria-label="Upload de foto de perfil"
                                />
                            </div>

                            {/* Divisor */}
                            <div className="border-t border-slate-100 dark:border-slate-800/50"></div>

                            {editingProfile ? (
                                <>
                                    {/* Nome */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Nome de Exibição</label>
                                        <input
                                            type="text"
                                            name="displayName"
                                            value={profileData.displayName}
                                            onChange={handleProfileChange}
                                            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                            placeholder="Seu nome"
                                        />
                                    </div>

                                    {/* Email */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">E-mail</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={profileData.email}
                                            onChange={handleProfileChange}
                                            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                            placeholder="seu@email.com"
                                        />
                                    </div>

                                    {/* Botões de Ação */}
                                    <div className="flex gap-3 pt-4 sm:pt-6 border-t border-slate-100 dark:border-slate-800/50">
                                        <button
                                            onClick={() => setEditingProfile(false)}
                                            className="flex-1 px-4 py-2.5 text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg font-medium text-sm transition-colors"
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            onClick={handleSaveProfile}
                                            className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-2"
                                        >
                                            <Check size={16} />
                                            Salvar Perfil
                                        </button>
                                    </div>

                                    {/* Erro do Perfil */}
                                    {profileError && (
                                        <div className="p-3 sm:p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 rounded-lg">
                                            <p className="text-xs sm:text-sm font-semibold text-red-700 dark:text-red-400 flex items-center gap-2">
                                                <AlertCircle size={16} />
                                                {profileError}
                                            </p>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <>
                                    {/* Visualização */}
                                    <div className="space-y-4 sm:space-y-5">
                                        <div className="flex items-center justify-between p-3 sm:p-4 bg-slate-50 dark:bg-slate-950/50 rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <User className="text-slate-400" size={18} />
                                                <div>
                                                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">Nome</p>
                                                    <p className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white">{profileData.displayName}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between p-3 sm:p-4 bg-slate-50 dark:bg-slate-950/50 rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <Mail className="text-slate-400" size={18} />
                                                <div>
                                                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">E-mail</p>
                                                    <p className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white">{profileData.email}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Sucesso do Perfil */}
                                    {profileSuccess && (
                                        <div className="p-3 sm:p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/30 rounded-lg">
                                            <p className="text-xs sm:text-sm font-semibold text-green-700 dark:text-green-400 flex items-center gap-2">
                                                <Check size={16} />
                                                Perfil atualizado com sucesso!
                                            </p>
                                        </div>
                                    )}

                                    {/* Botão de Edição */}
                                    <button
                                        onClick={() => setEditingProfile(true)}
                                        className="w-full px-4 py-2.5 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg font-medium text-sm transition-colors"
                                    >
                                        Editar Perfil
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Gestão do Portal */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-[2.5rem] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm transition-all hover:shadow-md">
                        {/* Header */}
                        <div className="p-4 sm:p-6 lg:p-8 border-b border-slate-100 dark:border-slate-800/50 bg-linear-to-r from-purple-50/50 to-pink-50/50 dark:from-slate-900/50 dark:to-slate-800/50">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 sm:p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl sm:rounded-2xl">
                                    <AlertCircle className="text-purple-600 dark:text-purple-400" size={20} />
                                </div>
                                <div>
                                    <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">Gestão do Portal</h2>
                                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">Configure metadados públicos</p>
                                </div>
                            </div>
                        </div>

                        {/* Conteúdo */}
                        <div className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
                            {editingPortal ? (
                                <>
                                    {/* Descrição */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Descrição</label>
                                        <textarea
                                            name="description"
                                            value={portalData.description}
                                            onChange={handlePortalChange}
                                            rows={4}
                                            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all resize-none"
                                            placeholder="Descrição da instituição..."
                                        />
                                    </div>

                                    {/* Website */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Website</label>
                                        <input
                                            type="url"
                                            name="website"
                                            value={portalData.website}
                                            onChange={handlePortalChange}
                                            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                                            placeholder="https://..."
                                        />
                                    </div>

                                    {/* Telefone */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Telefone</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={portalData.phone}
                                            onChange={handlePortalChange}
                                            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                                            placeholder="(11) 0000-0000"
                                        />
                                    </div>

                                    {/* Botões de Ação */}
                                    <div className="flex gap-3 pt-4 sm:pt-6 border-t border-slate-100 dark:border-slate-800/50">
                                        <button
                                            onClick={() => setEditingPortal(false)}
                                            className="flex-1 px-4 py-2.5 text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg font-medium text-sm transition-colors"
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            onClick={handleSavePortal}
                                            className="flex-1 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-2"
                                        >
                                            <Check size={16} />
                                            Salvar Portal
                                        </button>
                                    </div>

                                    {/* Erro do Portal */}
                                    {portalError && (
                                        <div className="p-3 sm:p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 rounded-lg">
                                            <p className="text-xs sm:text-sm font-semibold text-red-700 dark:text-red-400 flex items-center gap-2">
                                                <AlertCircle size={16} />
                                                {portalError}
                                            </p>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <>
                                    {/* Visualização */}
                                    <div className="space-y-4 sm:space-y-5">
                                        <div className="p-3 sm:p-4 bg-slate-50 dark:bg-slate-950/50 rounded-lg">
                                            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-2">Descrição</p>
                                            <p className="text-sm sm:text-base text-slate-900 dark:text-white leading-relaxed">{portalData.description}</p>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3 sm:gap-4">
                                            <div className="p-3 sm:p-4 bg-slate-50 dark:bg-slate-950/50 rounded-lg">
                                                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-1">Website</p>
                                                <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white truncate">{portalData.website}</p>
                                            </div>
                                            <div className="p-3 sm:p-4 bg-slate-50 dark:bg-slate-950/50 rounded-lg">
                                                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-1">Telefone</p>
                                                <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">{portalData.phone}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Sucesso do Portal */}
                                    {portalSuccess && (
                                        <div className="p-3 sm:p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/30 rounded-lg">
                                            <p className="text-xs sm:text-sm font-semibold text-green-700 dark:text-green-400 flex items-center gap-2">
                                                <Check size={16} />
                                                Configurações do portal atualizadas com sucesso!
                                            </p>
                                        </div>
                                    )}

                                    {/* Botão de Edição */}
                                    <button
                                        onClick={() => setEditingPortal(true)}
                                        className="w-full px-4 py-2.5 text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-lg font-medium text-sm transition-colors"
                                    >
                                        Editar Portal
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Coluna Direita - Segurança */}
                <div className="lg:col-span-1">
                    {/* Bloco de Segurança */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-[2.5rem] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm transition-all hover:shadow-md sticky top-6">
                        {/* Header */}
                        <div className="p-4 sm:p-6 lg:p-8 border-b border-slate-100 dark:border-slate-800/50 bg-linear-to-r from-red-50/50 to-orange-50/50 dark:from-slate-900/50 dark:to-slate-800/50">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 sm:p-3 bg-red-100 dark:bg-red-900/30 rounded-xl sm:rounded-2xl">
                                    <Shield className="text-red-600 dark:text-red-400" size={20} />
                                </div>
                                <div>
                                    <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">Segurança</h2>
                                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">Proteja sua conta</p>
                                </div>
                            </div>
                        </div>

                        {/* Conteúdo */}
                        <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
                            {/* 2FA */}
                            <div className="space-y-4">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">Autenticação de Dois Fatores</h3>
                                        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">Adicione uma camada extra de proteção</p>
                                    </div>
                                    {/* Toggle Switch */}
                                    <button
                                        onClick={handleToggle2FA}
                                        className={`relative inline-flex items-center w-14 sm:w-16 h-8 sm:h-9 rounded-full transition-all shrink-0 ${
                                            securityData.twoFAEnabled
                                                ? 'bg-green-500 shadow-lg shadow-green-500/30'
                                                : 'bg-slate-300 dark:bg-slate-700'
                                        }`}
                                    >
                                        <span
                                            className={`inline-block w-6 sm:w-7 h-6 sm:h-7 bg-white rounded-full transition-transform shadow-md ${
                                                securityData.twoFAEnabled ? 'translate-x-7 sm:translate-x-8' : 'translate-x-1'
                                            }`}
                                        />
                                    </button>
                                </div>

                                {/* Status */}
                                <div className={`p-3 sm:p-4 rounded-lg ${
                                    securityData.twoFAEnabled
                                        ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/30'
                                        : 'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800/30'
                                }`}>
                                    <p className={`text-xs sm:text-sm font-medium ${
                                        securityData.twoFAEnabled
                                            ? 'text-green-700 dark:text-green-400'
                                            : 'text-yellow-700 dark:text-yellow-400'
                                    }`}>
                                        {securityData.twoFAEnabled
                                            ? '✓ Autenticação ativada'
                                            : '⚠ Autenticação desativada'}
                                    </p>
                                </div>

                                {/* Sucesso do 2FA */}
                                {twoFASuccess && (
                                    <div className="p-3 sm:p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/30 rounded-lg">
                                        <p className="text-xs sm:text-sm font-semibold text-green-700 dark:text-green-400 flex items-center gap-2">
                                            <Check size={16} />
                                            Autenticação de Dois Fatores {twoFAMessage}!
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Divisor */}
                            <div className="border-t border-slate-100 dark:border-slate-800/50" />

                            {/* Alterar Senha */}
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">Alterar Senha</h3>
                                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">Última alteração: {securityData.lastPasswordChange}</p>
                                </div>

                                <button
                                    onClick={() => setShowPasswordModal(true)}
                                    className="w-full px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-2"
                                >
                                    <Lock size={16} />
                                    Trocar Senha
                                </button>
                            </div>

                            {/* Status de Sucesso */}
                            {passwordSuccess && (
                                <div className="p-3 sm:p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/30 rounded-lg">
                                    <p className="text-xs sm:text-sm font-semibold text-green-700 dark:text-green-400 flex items-center gap-2">
                                        <Check size={16} />
                                        Senha alterada com sucesso!
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Histórico de Atividades */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-[2.5rem] border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm transition-all hover:shadow-md">
                        {/* Header */}
                        <div className="p-4 sm:p-6 lg:p-8 border-b border-slate-100 dark:border-slate-800/50 bg-linear-to-r from-blue-50/50 to-cyan-50/50 dark:from-slate-900/50 dark:to-slate-800/50">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 sm:p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl sm:rounded-2xl">
                                    <History className="text-blue-600 dark:text-blue-400" size={20} />
                                </div>
                                <div>
                                    <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">Histórico de Atividades</h2>
                                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">Últimas ações realizadas</p>
                                </div>
                            </div>
                        </div>

                        {/* Conteúdo */}
                        <div className="p-4 sm:p-6 lg:p-8">
                            {auditLogs.length > 0 ? (
                                <div className="space-y-2 sm:space-y-3">
                                    {auditLogs.map((log) => (
                                        <div key={log.id} className="flex items-start gap-3 p-3 sm:p-4 bg-slate-50 dark:bg-slate-950/50 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900/50 transition-colors">
                                            <div className="mt-1">
                                                <div className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">{log.action}</p>
                                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{log.timestamp}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">Nenhuma atividade registrada</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal de Alterar Senha */}
            {showPasswordModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
                    {/* Overlay */}
                    <div
                        className="absolute inset-0 bg-slate-900/50 dark:bg-slate-950/70 backdrop-blur-md transition-opacity duration-300"
                        onClick={() => setShowPasswordModal(false)}
                    />

                    {/* Modal Container */}
                    <div className="relative bg-white dark:bg-slate-900 rounded-2xl sm:rounded-[2.5rem] border border-slate-200 dark:border-slate-700 shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
                        {/* Header */}
                        <div className="sticky top-0 p-4 sm:p-6 border-b border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
                            <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">Trocar Senha</h3>
                            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">Digite sua senha atual e a nova senha</p>
                        </div>

                        {/* Conteúdo */}
                        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                            {/* Senha Atual */}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Senha Atual</label>
                                <div className="relative">
                                    <input
                                        type={showCurrentPassword ? 'text' : 'password'}
                                        name="currentPassword"
                                        value={passwordForm.currentPassword}
                                        onChange={handlePasswordChange}
                                        className="w-full px-4 py-2.5 pr-10 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                                    >
                                        {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            {/* Nova Senha */}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Nova Senha</label>
                                <div className="relative">
                                    <input
                                        type={showNewPassword ? 'text' : 'password'}
                                        name="newPassword"
                                        value={passwordForm.newPassword}
                                        onChange={handlePasswordChange}
                                        className="w-full px-4 py-2.5 pr-10 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                                    >
                                        {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                                <p className="text-xs text-slate-500 dark:text-slate-400">Mínimo 8 caracteres</p>
                            </div>

                            {/* Confirmar Senha */}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Confirmar Nova Senha</label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={passwordForm.confirmPassword}
                                    onChange={handlePasswordChange}
                                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                    placeholder="••••••••"
                                />
                            </div>

                            {/* Erro */}
                            {passwordError && (
                                <div className="p-3 sm:p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 rounded-lg">
                                    <p className="text-xs sm:text-sm font-semibold text-red-700 dark:text-red-400 flex items-center gap-2">
                                        <AlertCircle size={16} />
                                        {passwordError}
                                    </p>
                                </div>
                            )}

                            {/* Botões */}
                            <div className="flex gap-3 pt-4 sm:pt-6 border-t border-slate-200 dark:border-slate-800">
                                <button
                                    onClick={() => setShowPasswordModal(false)}
                                    className="flex-1 px-4 py-2.5 text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg font-medium text-sm transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleChangePassword}
                                    className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-2"
                                >
                                    <Check size={16} />
                                    Salvar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Settings;
