import { 
    collection, 
    doc, 
    getDoc, 
    setDoc, 
    serverTimestamp,
    Timestamp 
} from 'firebase/firestore';
import { firestore } from '@/services/firebase/config';
import { firebaseAuthService } from '@/services/firebase/auth';
import { auditService } from './auditService';

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
  updated_at?: string | Timestamp;
}

class PortalSettingsService {
    private readonly COLLECTION_NAME = 'portal_settings';
    private readonly SETTINGS_DOC_ID = 'main_settings'; // Sempre usa o mesmo documento

    private defaultSettings: PortalSettings = {
        description: 'Instituição dedicada à promoção de educação de qualidade e inclusão social, com foco em transparência e responsabilidade com a comunidade.',
        website: 'https://www.educandario.com.br',
        phone: '(19) 3863-1972',
        email: 'educandarionsa@yahoo.com.br',
        phone2: '(19) 3863-1972',
        address: 'Rua José Pereira, 780 - Vila Bazani, Itapira/SP',
        instagram: 'ensa_itapira',
        instagramHandle: '@ensa_itapira',
        facebook: 'educandarioensa',
        facebookHandle: '@educandarioensa',
        pixKey: 'contato@educandarionsa.com.br',
        urgentNeedTitle: 'Mantimentos prioritários desta semana',
        urgentNeedDescription: 'Precisamos de verduras frescas (ex.: manjericão) para as refeições das crianças.',
        urgentNeedWindow: 'Entrega ideal: 10 a 13/03, 8h às 16h',
        urgentNeedDelivery: 'Entregar na sede - Rua José Pereira, 780, Vila Bazani, Itapira/SP'
    };

    async getSettings(): Promise<PortalSettings> {
        try {
            const docRef = doc(firestore, this.COLLECTION_NAME, this.SETTINGS_DOC_ID);
            const docSnap = await getDoc(docRef);
            
            if (docSnap.exists()) {
                const data = docSnap.data() as PortalSettings;
                return data;
            }
            
            // Se não existir, retorna as configurações padrão
            return { ...this.defaultSettings };
        } catch (error) {
            console.error('Erro ao carregar configurações do Firestore:', error);
            // Fallback para valores padrão se Firestore falhar
            return { ...this.defaultSettings };
        }
    }

    async updateSettings(updates: Partial<PortalSettings>): Promise<PortalSettings> {
        try {
            const user = await firebaseAuthService.getCurrentUser();
            if (!user) {
                throw new Error('Usuário não autenticado');
            }

            const current = await this.getSettings();
            const updated: PortalSettings = { 
                ...current, 
                ...updates,
                id: this.SETTINGS_DOC_ID,
                user_id: user.id,
                updated_at: serverTimestamp() as any
            };
            
            const docRef = doc(firestore, this.COLLECTION_NAME, this.SETTINGS_DOC_ID);
            await setDoc(docRef, updated, { merge: true });
            
            // Log auditoria
            await auditService.addLog('⚙️ Configurações do portal atualizadas');
            
            return updated;
        } catch (error) {
            const errorMsg = error instanceof Error ? error.message : 'Erro desconhecido';
            throw new Error(`Falha ao atualizar configurações: ${errorMsg}`);
        }
    }

    async resetSettings(): Promise<void> {
        try {
            const user = await firebaseAuthService.getCurrentUser();
            if (!user) {
                throw new Error('Usuário não autenticado');
            }

            const docRef = doc(firestore, this.COLLECTION_NAME, this.SETTINGS_DOC_ID);
            const resetData: PortalSettings = {
                ...this.defaultSettings,
                user_id: user.id,
                updated_at: serverTimestamp() as any
            };
            
            await setDoc(docRef, resetData);
            await auditService.addLog('⚙️ Configurações do portal resetadas para padrão');
        } catch (error) {
            console.error('Erro ao resetar configurações:', error);
            throw new Error(`Falha ao resetar configurações: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
        }
    }
}

export const portalSettingsService = new PortalSettingsService();
