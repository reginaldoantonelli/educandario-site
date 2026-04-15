import React, { useState, useRef } from 'react';
import { User, Mail, Shield, Lock, Eye, EyeOff, Check, AlertCircle, History, Upload, Trash2 } from 'lucide-react';
import { useUserProfile } from '@/hooks/useUserProfile';
import { usePortalSettings } from '@/hooks/usePortalSettings';
import { useAuditLogs } from '@/hooks/useAuditLogs';

const Settings: React.FC = () => {
    // Hooks de dados
    const { profile, error: profileError, updateProfile, uploadAvatar, removeAvatar: removeAvatarService, clearError: clearProfileError } = useUserProfile();
    const { settings: portalSettings, error: portalError, updateSettings, clearError: clearPortalError } = usePortalSettings();
    const { logs: auditLogs, fetchLogs } = useAuditLogs();

    // Referência para o input file
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Estado de segurança local (não persiste - apenas para UI)
    const [securityData, setSecurityData] = useState({
        twoFAEnabled: false,
        lastPasswordChange: '15 de março de 2026'
    });

    // Estados de edição local (apenas para UI)
    const [editingProfile, setEditingProfile] = useState(false);
    const [editingPortal, setEditingPortal] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);

    // Estados de dados para edição de perfil
    const [editingProfileData, setEditingProfileData] = useState({
        displayName: profile?.displayName || '',
        email: profile?.email || ''
    });

    // Estados de dados para edição de portal
    const [editingPortalData, setEditingPortalData] = useState({
        description: portalSettings?.description || '',
        website: portalSettings?.website || '',
        phone: portalSettings?.phone || '',
        email: portalSettings?.email || '',
        phone2: portalSettings?.phone2 || '',
        address: portalSettings?.address || '',
        instagram: portalSettings?.instagram || '',
        instagramHandle: portalSettings?.instagramHandle || '',
        facebook: portalSettings?.facebook || '',
        facebookHandle: portalSettings?.facebookHandle || '',
        pixKey: portalSettings?.pixKey || '',
        urgentNeedTitle: portalSettings?.urgentNeedTitle || '',
        urgentNeedDescription: portalSettings?.urgentNeedDescription || '',
        urgentNeedWindow: portalSettings?.urgentNeedWindow || '',
        urgentNeedDelivery: portalSettings?.urgentNeedDelivery || ''
    });

    // Estados de formulário local
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [passwordError, setPasswordError] = useState('');
    const [passwordSuccess, setPasswordSuccess] = useState(false);

    // Estados de feedback local
    const [profileSuccess, setProfileSuccess] = useState(false);
    const [portalSuccess, setPortalSuccess] = useState(false);
    const [twoFASuccess, setTwoFASuccess] = useState('');
    const [twoFAMessage, setTwoFAMessage] = useState('');

    // Handler para upload de avatar
    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            clearProfileError();

            // Validar tipo
            if (!file.type.startsWith('image/')) {
                throw new Error('Por favor, selecione uma imagem válida (PNG, JPG, etc.)');
            }

            // Validar tamanho (máx 5MB)
            if (file.size > 5 * 1024 * 1024) {
                throw new Error('A imagem não pode exceder 5MB');
            }

            // Converter para Base64 e fazer upload
            const reader = new FileReader();
            reader.onload = async (event) => {
                try {
                    const result = event.target?.result as string;
                    await uploadAvatar(result);
                    // Recarregar o histórico de atividades
                    await fetchLogs();
                    setProfileSuccess(true);
                    setTimeout(() => setProfileSuccess(false), 3000);
                } catch (error) {
                    console.error('Erro ao fazer upload do avatar:', error);
                }
            };
            reader.readAsDataURL(file);
        } catch (error) {
            const errorMsg = error instanceof Error ? error.message : 'Erro ao validar imagem';
            console.error('Erro ao fazer upload:', errorMsg);
        }
    };

    // Handler para remover avatar
    const handleRemoveAvatar = async () => {
        try {
            clearProfileError();
            await removeAvatarService();
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
            // Recarregar o histórico de atividades
            await fetchLogs();
            setProfileSuccess(true);
            setTimeout(() => setProfileSuccess(false), 3000);
        } catch (error) {
            console.error('Erro ao remover avatar:', error);
        }
    };

    // Handlers de Perfil
    const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEditingProfileData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSaveProfile = async () => {
        if (!editingProfileData.displayName.trim() || !editingProfileData.email.trim()) {
            console.error('Todos os campos são obrigatórios');
            return;
        }
        
        try {
            clearProfileError();
            await updateProfile({
                displayName: editingProfileData.displayName,
                email: editingProfileData.email
            });
            // Recarregar o histórico de atividades
            await fetchLogs();
            setProfileSuccess(true);
            setTimeout(() => setProfileSuccess(false), 3000);
            setEditingProfile(false);
        } catch (error) {
            console.error('Erro ao salvar perfil:', error);
        }
    };

    // Handlers de Portal
    const handlePortalChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setEditingPortalData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Funções para extrair username de URLs
    const extractInstagramUsername = (input: string): string => {
        if (!input) return '';
        // Remove espaços
        input = input.trim();
        // Se for URL, extrai o username
        if (input.includes('instagram.com')) {
            const match = input.match(/instagram\.com\/([^/?\s]+)/);
            return match ? match[1] : input;
        }
        // Se tiver @, remove
        return input.replace('@', '').trim();
    };

    const extractFacebookUsername = (input: string): string => {
        if (!input) return '';
        // Remove espaços
        input = input.trim();
        // Se for URL, extrai o username
        if (input.includes('facebook.com') || input.includes('fb.com')) {
            const match = input.match(/facebook\.com\/([^/?\s]+)|fb\.com\/([^/?\s]+)/);
            return match ? (match[1] || match[2]) : input;
        }
        // Se tiver @, remove
        return input.replace('@', '').trim();
    };

    const handleSavePortal = async () => {
        if (!editingPortalData.description.trim()) {
            console.error('A descrição é obrigatória');
            return;
        }
        
        try {
            clearPortalError();
            // Extrai apenas o username da URL
            const instagramUsername = extractInstagramUsername(editingPortalData.instagram);
            const facebookUsername = extractFacebookUsername(editingPortalData.facebook);
            
            await updateSettings({
                description: editingPortalData.description,
                website: editingPortalData.website,
                phone: editingPortalData.phone,
                email: editingPortalData.email,
                phone2: editingPortalData.phone2,
                address: editingPortalData.address,
                instagram: instagramUsername,
                instagramHandle: editingPortalData.instagramHandle,
                facebook: facebookUsername,
                facebookHandle: editingPortalData.facebookHandle,
                pixKey: editingPortalData.pixKey,
                urgentNeedTitle: editingPortalData.urgentNeedTitle,
                urgentNeedDescription: editingPortalData.urgentNeedDescription,
                urgentNeedWindow: editingPortalData.urgentNeedWindow,
                urgentNeedDelivery: editingPortalData.urgentNeedDelivery
            });
            // Recarregar o histórico de atividades
            await fetchLogs();
            setPortalSuccess(true);
            setTimeout(() => setPortalSuccess(false), 3000);
            setEditingPortal(false);
        } catch (error) {
            console.error('Erro ao salvar configurações do portal:', error);
        }
    };

    // Handlers de Segurança
    const handleToggle2FA = () => {
        const newStatus = !securityData.twoFAEnabled;
        setSecurityData(prev => ({
            ...prev,
            twoFAEnabled: newStatus
        }));
        
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
                                        {profile?.avatar ? (
                                            <img src={profile.avatar} alt="Avatar" className="w-full h-full object-cover" />
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
                                        {profile?.avatar ? 'Clique no ícone de câmera para atualizar' : 'Adicione uma foto de perfil para personalizar sua conta'}
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
                                        {profile?.avatar && (
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
                                            value={editingProfileData.displayName}
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
                                            value={editingProfileData.email}
                                            onChange={handleProfileChange}
                                            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                            placeholder="seu@email.com"
                                        />
                                    </div>

                                    {/* Botões de Ação */}
                                    <div className="flex gap-3 pt-4 sm:pt-6 border-t border-slate-100 dark:border-slate-800/50">
                                        <button
                                            onClick={() => {
                                                setEditingProfile(false);
                                                setEditingProfileData({
                                                    displayName: profile?.displayName || '',
                                                    email: profile?.email || ''
                                                });
                                            }}
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
                                                    <p className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white">{profile?.displayName || 'N/A'}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between p-3 sm:p-4 bg-slate-50 dark:bg-slate-950/50 rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <Mail className="text-slate-400" size={18} />
                                                <div>
                                                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">E-mail</p>
                                                    <p className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white">{profile?.email || 'N/A'}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between p-3 sm:p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800/30">
                                            <div className="flex items-center gap-3">
                                                <Shield className="text-blue-600 dark:text-blue-400" size={18} />
                                                <div>
                                                    <p className="text-xs sm:text-sm text-blue-600 dark:text-blue-400">Cargo</p>
                                                    <p className="text-sm sm:text-base font-semibold text-blue-700 dark:text-blue-300">{profile?.role || 'Usuário'}</p>
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
                                        onClick={() => {
                                            setEditingProfileData({
                                                displayName: profile?.displayName || '',
                                                email: profile?.email || ''
                                            });
                                            setEditingProfile(true);
                                        }}
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
                                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Descrição da Instituição</label>
                                        <textarea
                                            name="description"
                                            value={editingPortalData.description}
                                            onChange={handlePortalChange}
                                            rows={4}
                                            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all resize-none"
                                            placeholder="Descrição da instituição..."
                                        />
                                    </div>

                                    {/* Seção: Informações de Contato */}
                                    <div className="border-t border-slate-200 dark:border-slate-700/50 mt-6 pt-6">
                                        <div className="p-4 sm:p-5 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 rounded-r-lg mb-4">
                                            <h3 className="text-sm font-bold text-blue-900 dark:text-blue-100 flex items-center gap-2">
                                                <span className="text-lg">📞</span> Informações de Contato
                                            </h3>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                                            {/* Website */}
                                            <div className="space-y-2">
                                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Website</label>
                                                <input
                                                    type="url"
                                                    name="website"
                                                    value={editingPortalData.website}
                                                    onChange={handlePortalChange}
                                                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                                    placeholder="https://..."
                                                />
                                            </div>

                                            {/* Email */}
                                            <div className="space-y-2">
                                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">E-mail</label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={editingPortalData.email}
                                                    onChange={handlePortalChange}
                                                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                                    placeholder="email@example.com"
                                                />
                                            </div>

                                            {/* Telefone Fixo */}
                                            <div className="space-y-2">
                                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Telefone Fixo</label>
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    value={editingPortalData.phone}
                                                    onChange={handlePortalChange}
                                                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                                    placeholder="(11) 0000-0000"
                                                />
                                            </div>

                                            {/* WhatsApp/Celular */}
                                            <div className="space-y-2">
                                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">WhatsApp / Celular</label>
                                                <input
                                                    type="tel"
                                                    name="phone2"
                                                    value={editingPortalData.phone2}
                                                    onChange={handlePortalChange}
                                                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                                    placeholder="(19) 0000-0000"
                                                />
                                            </div>

                                            {/* Endereço - Full Width */}
                                            <div className="col-span-1 sm:col-span-2 space-y-2">
                                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Endereço</label>
                                                <input
                                                    type="text"
                                                    name="address"
                                                    value={editingPortalData.address}
                                                    onChange={handlePortalChange}
                                                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                                    placeholder="Rua..., Número - Cidade/Estado"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Seção: Redes Sociais */}
                                    <div className="border-t border-slate-200 dark:border-slate-700/50 mt-6 pt-6">
                                        <div className="p-4 sm:p-5 bg-linear-to-r from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20 border-l-4 border-pink-500 rounded-r-lg mb-4">
                                            <h3 className="text-sm font-bold text-pink-900 dark:text-pink-100 flex items-center gap-2">
                                                <span className="text-lg">📱</span> Redes Sociais
                                            </h3>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                                            {/* Instagram */}
                                            <div className="space-y-2">
                                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Instagram - URL</label>
                                                <input
                                                    type="text"
                                                    name="instagram"
                                                    value={editingPortalData.instagram}
                                                    onChange={handlePortalChange}
                                                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
                                                    placeholder="https://instagram.com/usuario"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Instagram - Nome de Exibição</label>
                                                <input
                                                    type="text"
                                                    name="instagramHandle"
                                                    value={editingPortalData.instagramHandle}
                                                    onChange={handlePortalChange}
                                                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
                                                    placeholder="@usuario"
                                                />
                                            </div>

                                            {/* Facebook */}
                                            <div className="space-y-2">
                                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Facebook - URL</label>
                                                <input
                                                    type="text"
                                                    name="facebook"
                                                    value={editingPortalData.facebook}
                                                    onChange={handlePortalChange}
                                                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
                                                    placeholder="https://www.facebook.com/usuario"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Facebook - Nome de Exibição</label>
                                                <input
                                                    type="text"
                                                    name="facebookHandle"
                                                    value={editingPortalData.facebookHandle}
                                                    onChange={handlePortalChange}
                                                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
                                                    placeholder="@usuario"
                                                />
                                            </div>

                                            {/* PIX - Full Width */}
                                            <div className="col-span-1 sm:col-span-2 space-y-2">
                                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">PIX</label>
                                                <input
                                                    type="text"
                                                    name="pixKey"
                                                    value={editingPortalData.pixKey}
                                                    onChange={handlePortalChange}
                                                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
                                                    placeholder="chave-pix@example.com ou CPF/CNPJ"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Seção: Necessidade Urgente */}
                                    <div className="border-t border-slate-200 dark:border-slate-700/50 mt-6 pt-6">
                                        <div className="p-4 sm:p-5 bg-linear-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border-l-4 border-red-500 rounded-r-lg mb-4">
                                            <h3 className="text-sm font-bold text-red-900 dark:text-red-100 flex items-center gap-2">
                                                <span className="text-lg">🚨</span> Necessidade Urgente Atual
                                            </h3>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                                            {/* Título da Necessidade */}
                                            <div className="col-span-1 sm:col-span-2 space-y-2">
                                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Título</label>
                                                <input
                                                    type="text"
                                                    name="urgentNeedTitle"
                                                    value={editingPortalData.urgentNeedTitle}
                                                    onChange={handlePortalChange}
                                                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
                                                    placeholder="Título da necessidade urgente..."
                                                />
                                            </div>

                                            {/* Descrição */}
                                            <div className="col-span-1 sm:col-span-2 space-y-2">
                                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Descrição</label>
                                                <textarea
                                                    name="urgentNeedDescription"
                                                    value={editingPortalData.urgentNeedDescription}
                                                    onChange={handlePortalChange}
                                                    rows={2}
                                                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all resize-none"
                                                    placeholder="Descrição detalhada da necessidade..."
                                                />
                                            </div>

                                            {/* Janela de Entrega */}
                                            <div className="space-y-2">
                                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Janela de Entrega</label>
                                                <input
                                                    type="text"
                                                    name="urgentNeedWindow"
                                                    value={editingPortalData.urgentNeedWindow}
                                                    onChange={handlePortalChange}
                                                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
                                                    placeholder="Ex: 10 a 13/03, 8h às 16h"
                                                />
                                            </div>

                                            {/* Local de Entrega */}
                                            <div className="space-y-2">
                                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Local de Entrega</label>
                                                <input
                                                    type="text"
                                                    name="urgentNeedDelivery"
                                                    value={editingPortalData.urgentNeedDelivery}
                                                    onChange={handlePortalChange}
                                                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
                                                    placeholder="Endereço para entrega dessa necessidade..."
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Botões de Ação */}
                                    <div className="flex gap-3 pt-4 sm:pt-6 border-t border-slate-100 dark:border-slate-800/50">
                                        <button
                                            onClick={() => {
                                                setEditingPortal(false);
                                                setEditingPortalData({
                                                    description: portalSettings?.description || '',
                                                    website: portalSettings?.website || '',
                                                    phone: portalSettings?.phone || '',
                                                    email: portalSettings?.email || '',
                                                    phone2: portalSettings?.phone2 || '',
                                                    address: portalSettings?.address || '',
                                                    instagram: portalSettings?.instagram || '',
                                                    instagramHandle: portalSettings?.instagramHandle || '',
                                                    facebook: portalSettings?.facebook || '',
                                                    facebookHandle: portalSettings?.facebookHandle || '',
                                                    pixKey: portalSettings?.pixKey || '',
                                                    urgentNeedTitle: portalSettings?.urgentNeedTitle || '',
                                                    urgentNeedDescription: portalSettings?.urgentNeedDescription || '',
                                                    urgentNeedWindow: portalSettings?.urgentNeedWindow || '',
                                                    urgentNeedDelivery: portalSettings?.urgentNeedDelivery || ''
                                                });
                                            }}
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
                                    <div className="space-y-5 sm:space-y-6">
                                        {/* Descrição */}
                                        <div className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-950/50 rounded-lg border border-slate-200 dark:border-slate-700">
                                            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-semibold mb-2 uppercase tracking-wide">Descrição da Instituição</p>
                                            <p className="text-sm sm:text-base text-slate-900 dark:text-white leading-relaxed">{portalSettings?.description || 'N/A'}</p>
                                        </div>

                                        {/* Card: Informações de Contato */}
                                        <div className="border border-blue-200 dark:border-blue-800/30 rounded-xl overflow-hidden">
                                            <div className="p-4 sm:p-5 bg-linear-to-r from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/20 border-b border-blue-200 dark:border-blue-800/30">
                                                <h3 className="text-sm font-bold text-blue-900 dark:text-blue-100 flex items-center gap-2">
                                                    <span className="text-lg">📞</span> Informações de Contato
                                                </h3>
                                            </div>
                                            <div className="p-4 sm:p-5 space-y-3">
                                                <div className="flex items-center justify-between p-3 bg-blue-50/50 dark:bg-blue-900/10 rounded-lg">
                                                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-semibold">Website:</p>
                                                    <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white truncate ml-2">{portalSettings?.website || 'N/A'}</p>
                                                </div>
                                                <div className="flex items-center justify-between p-3 bg-blue-50/50 dark:bg-blue-900/10 rounded-lg">
                                                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-semibold">Email:</p>
                                                    <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white truncate ml-2">{portalSettings?.email || 'N/A'}</p>
                                                </div>
                                                <div className="flex items-center justify-between p-3 bg-blue-50/50 dark:bg-blue-900/10 rounded-lg">
                                                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-semibold">Telefone:</p>
                                                    <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">{portalSettings?.phone || 'N/A'}</p>
                                                </div>
                                                <div className="flex items-center justify-between p-3 bg-blue-50/50 dark:bg-blue-900/10 rounded-lg">
                                                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-semibold">WhatsApp:</p>
                                                    <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">{portalSettings?.phone2 || 'N/A'}</p>
                                                </div>
                                                <div className="flex items-start justify-between p-3 bg-blue-50/50 dark:bg-blue-900/10 rounded-lg gap-3">
                                                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-semibold shrink-0">Endereço:</p>
                                                    <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white text-right">{portalSettings?.address || 'N/A'}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Card: Redes Sociais */}
                                        <div className="border border-pink-200 dark:border-pink-800/30 rounded-xl overflow-hidden">
                                            <div className="p-4 sm:p-5 bg-linear-to-r from-pink-50 to-rose-50/50 dark:from-pink-900/20 dark:to-rose-900/20 border-b border-pink-200 dark:border-pink-800/30">
                                                <h3 className="text-sm font-bold text-pink-900 dark:text-pink-100 flex items-center gap-2">
                                                    <span className="text-lg">📱</span> Redes Sociais
                                                </h3>
                                            </div>
                                            <div className="p-4 sm:p-5 space-y-3">
                                                <div className="flex items-center justify-between p-3 bg-pink-50/50 dark:bg-pink-900/10 rounded-lg">
                                                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-semibold">Instagram:</p>
                                                    <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white truncate ml-2">{portalSettings?.instagramHandle || portalSettings?.instagram || 'N/A'}</p>
                                                </div>
                                                <div className="flex items-center justify-between p-3 bg-pink-50/50 dark:bg-pink-900/10 rounded-lg">
                                                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-semibold">Facebook:</p>
                                                    <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white truncate ml-2">{portalSettings?.facebookHandle || portalSettings?.facebook || 'N/A'}</p>
                                                </div>
                                                <div className="flex items-center justify-between p-3 bg-pink-50/50 dark:bg-pink-900/10 rounded-lg">
                                                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-semibold">PIX:</p>
                                                    <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white truncate ml-2">{portalSettings?.pixKey || 'N/A'}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Card: Necessidade Urgente */}
                                        {(portalSettings?.urgentNeedTitle || portalSettings?.urgentNeedDescription) && (
                                            <div className="border-2 border-red-300 dark:border-red-700/50 rounded-xl overflow-hidden bg-linear-to-b from-red-50/30 to-transparent dark:from-red-900/10 dark:to-transparent">
                                                <div className="p-4 sm:p-5 bg-linear-to-r from-red-100 to-orange-50 dark:from-red-900/30 dark:to-orange-900/30 border-b border-red-200 dark:border-red-800/30">
                                                    <h3 className="text-sm font-bold text-red-900 dark:text-red-100 flex items-center gap-2">
                                                        <span className="text-lg">🚨</span> Necessidade Urgente Atual
                                                    </h3>
                                                </div>
                                                <div className="p-4 sm:p-5 space-y-4">
                                                    {portalSettings?.urgentNeedTitle && (
                                                        <div>
                                                            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-semibold uppercase tracking-wide mb-1">Título</p>
                                                            <p className="text-sm sm:text-base font-bold text-red-700 dark:text-red-200">{portalSettings.urgentNeedTitle}</p>
                                                        </div>
                                                    )}
                                                    {portalSettings?.urgentNeedDescription && (
                                                        <div>
                                                            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-semibold uppercase tracking-wide mb-1">Descrição</p>
                                                            <p className="text-sm sm:text-base text-slate-900 dark:text-white leading-relaxed">{portalSettings.urgentNeedDescription}</p>
                                                        </div>
                                                    )}
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                        {portalSettings?.urgentNeedWindow && (
                                                            <div className="p-3 bg-red-100/40 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800/30">
                                                                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-semibold mb-1">Janela de Entrega</p>
                                                                <p className="text-xs sm:text-sm text-slate-900 dark:text-white font-semibold">{portalSettings.urgentNeedWindow}</p>
                                                            </div>
                                                        )}
                                                        {portalSettings?.urgentNeedDelivery && (
                                                            <div className="p-3 bg-red-100/40 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800/30">
                                                                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-semibold mb-1">Local de Entrega</p>
                                                                <p className="text-xs sm:text-sm text-slate-900 dark:text-white font-semibold">{portalSettings.urgentNeedDelivery}</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
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
                                        onClick={() => {
                                            setEditingPortalData({
                                                description: portalSettings?.description || '',
                                                website: portalSettings?.website || '',
                                                phone: portalSettings?.phone || '',
                                                email: portalSettings?.email || '',
                                                phone2: portalSettings?.phone2 || '',
                                                address: portalSettings?.address || '',
                                                instagram: portalSettings?.instagram || '',
                                                instagramHandle: portalSettings?.instagramHandle || '',
                                                facebook: portalSettings?.facebook || '',
                                                facebookHandle: portalSettings?.facebookHandle || '',
                                                pixKey: portalSettings?.pixKey || '',
                                                urgentNeedTitle: portalSettings?.urgentNeedTitle || '',
                                                urgentNeedDescription: portalSettings?.urgentNeedDescription || '',
                                                urgentNeedWindow: portalSettings?.urgentNeedWindow || '',
                                                urgentNeedDelivery: portalSettings?.urgentNeedDelivery || ''
                                            });
                                            setEditingPortal(true);
                                        }}
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
                    <div className="mt-6 sm:mt-8 lg:mt-12 bg-white dark:bg-slate-900 rounded-2xl sm:rounded-[2.5rem] border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm transition-all hover:shadow-md">
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
                            {auditLogs && auditLogs.length > 0 ? (
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
