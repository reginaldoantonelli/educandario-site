import { useState, useEffect, useCallback } from 'react';
import { portalSettingsService } from '@/services/portalSettingsService';

interface PortalSettings {
  id?: string;
  user_id?: string;
  description: string;
  website: string;
  phone: string;
  email?: string;
  phone2?: string;
  address?: string;
  instagram?: string;
  instagramHandle?: string;
  facebook?: string;
  facebookHandle?: string;
  pixKey?: string;
  urgentNeedTitle?: string;
  urgentNeedDescription?: string;
  urgentNeedWindow?: string;
  urgentNeedDelivery?: string;
  updated_at?: string;
}

export const usePortalSettings = () => {
    const [settings, setSettings] = useState<PortalSettings | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Buscar configurações ao montar
    const fetchSettings = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await portalSettingsService.getSettings();
            setSettings(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro ao carregar configurações');
            console.error('Erro ao buscar configurações:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSettings();
    }, [fetchSettings]);

    // Atualizar configurações
    const updateSettings = useCallback(async (updates: Partial<PortalSettings>) => {
        try {
            setError(null);
            const updated = await portalSettingsService.updateSettings(updates);
            setSettings(updated);
            return updated;
        } catch (err) {
            const errorMsg = err instanceof Error ? err.message : 'Erro ao atualizar configurações';
            setError(errorMsg);
            throw err;
        }
    }, []);

    // Resetar configurações
    const resetSettings = useCallback(async () => {
        try {
            setError(null);
            await portalSettingsService.resetSettings();
            const updated = await portalSettingsService.getSettings();
            setSettings(updated);
        } catch (err) {
            const errorMsg = err instanceof Error ? err.message : 'Erro ao resetar configurações';
            setError(errorMsg);
            throw err;
        }
    }, []);

    // Limpar erro
    const clearError = useCallback(() => {
        setError(null);
    }, []);

    return {
        settings,
        loading,
        error,
        fetchSettings,
        updateSettings,
        resetSettings,
        clearError
    };
};
