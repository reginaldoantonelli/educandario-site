import { auditService } from './auditService';

interface PortalSettings {
  id?: string;
  user_id?: string;
  description: string;
  website: string;
  phone: string;
  updated_at?: string;
}

class PortalSettingsService {
    private readonly STORAGE_KEY = 'adminPortal';

    private defaultSettings: PortalSettings = {
        description: 'Instituição dedicada à promoção de educação de qualidade e inclusão social, com foco em transparência e responsabilidade com a comunidade.',
        website: 'https://www.educandario.com.br',
        phone: '(11) 3456-7890'
    };

    async getSettings(): Promise<PortalSettings> {
        try {
            const settings = localStorage.getItem(this.STORAGE_KEY);
            if (settings) {
                return JSON.parse(settings);
            }
            return { ...this.defaultSettings };
        } catch (error) {
            console.error('Erro ao carregar configurações do portal', error);
            return { ...this.defaultSettings };
        }
    }

    async updateSettings(updates: Partial<PortalSettings>): Promise<PortalSettings> {
        try {
            const current = await this.getSettings();
            const updated = { ...current, ...updates };
            
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updated));
            
            // Log auditoria
            await auditService.addLog('⚙️ Configurações do portal atualizadas');
            
            return updated;
        } catch (error) {
            throw new Error(`Falha ao atualizar configurações: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
        }
    }

    async resetSettings(): Promise<void> {
        try {
            localStorage.removeItem(this.STORAGE_KEY);
            await auditService.addLog('⚙️ Configurações do portal resetadas');
        } catch (error) {
            console.error('Erro ao resetar configurações', error);
        }
    }
}

export const portalSettingsService = new PortalSettingsService();
