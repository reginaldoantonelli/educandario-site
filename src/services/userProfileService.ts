import { auditService } from './auditService';

interface UserProfileData {
    displayName: string;
    email: string;
    avatar: string | null;
    role?: string;
}

class UserProfileService {
    private readonly STORAGE_KEY = 'adminProfile';
    private readonly AVATAR_KEY = 'adminAvatar';

    private defaultProfile: UserProfileData = {
        displayName: 'Iago',
        email: 'iago@educandario.com.br',
        avatar: null,
        role: 'Admin'
    };

    async getProfile(): Promise<UserProfileData> {
        try {
            const profile = localStorage.getItem(this.STORAGE_KEY);
            const avatar = localStorage.getItem(this.AVATAR_KEY);
            
            if (profile) {
                return { ...JSON.parse(profile), avatar };
            }
            return { ...this.defaultProfile, avatar };
        } catch (error) {
            console.error('Erro ao carregar perfil do usuário', error);
            return { ...this.defaultProfile, avatar: null };
        }
    }

    async updateProfile(updates: Partial<UserProfileData>): Promise<UserProfileData> {
        try {
            const current = await this.getProfile();
            const updated = { ...current, ...updates };
            
            // Não salvar avatar aqui (é handled separadamente)
            const { avatar, ...profileData } = updated;
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(profileData));
            
            // Log auditoria
            await auditService.addLog(`👤 Perfil atualizado: ${updated.displayName}`);
            
            return updated;
        } catch (error) {
            throw new Error(`Falha ao atualizar perfil: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
        }
    }

    async uploadAvatar(base64: string): Promise<string> {
        try {
            // Validar tamanho (máximo 5MB)
            const sizeInBytes = (base64.length * 3) / 4;
            const sizeInMB = sizeInBytes / (1024 * 1024);
            
            if (sizeInMB > 5) {
                throw new Error('Avatar deve ter no máximo 5MB');
            }
            
            localStorage.setItem(this.AVATAR_KEY, base64);
            await auditService.addLog('📷 Foto de perfil atualizada');
            
            return base64;
        } catch (error) {
            throw new Error(`Falha ao enviar avatar: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
        }
    }

    async removeAvatar(): Promise<void> {
        try {
            localStorage.removeItem(this.AVATAR_KEY);
            await auditService.addLog('📷 Foto de perfil removida');
        } catch (error) {
            throw new Error(`Falha ao remover avatar: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
        }
    }

    async clearProfile(): Promise<void> {
        try {
            localStorage.removeItem(this.STORAGE_KEY);
            localStorage.removeItem(this.AVATAR_KEY);
        } catch (error) {
            console.error('Erro ao limpar perfil', error);
        }
    }
}

export const userProfileService = new UserProfileService();
