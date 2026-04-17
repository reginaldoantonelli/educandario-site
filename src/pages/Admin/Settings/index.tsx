import React from 'react';
import ProfileSection from './components/ProfileSection';
import PortalManagementSection from './components/PortalManagementSection';
import SecuritySection from './components/SecuritySection';
import ActivityHistorySection from './components/ActivityHistorySection';

const Settings: React.FC = () => {
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
                    <ProfileSection />
                    <PortalManagementSection />
                </div>

                {/* Coluna Direita - Segurança e Histórico */}
                <div className="lg:col-span-1">
                    <SecuritySection />
                    <ActivityHistorySection />
                </div>
            </div>
        </div>
    );
};

export default Settings;