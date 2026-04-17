/**
 * Hook useAuth - Agora re-exporta do AuthContext
 * Garante um listener GLOBAL único que persiste entre navegações
 * 
 * Anteriormente, cada componente criava seu próprio listener,
 * causando conflitos e logout automático. Agora há apenas UM listener
 * gerenciado centralmente pelo AuthProvider.
 */

// Re-exportar do context centralizado
export { useAuth } from '@/contexts/AuthContext';
