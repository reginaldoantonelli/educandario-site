export interface Document {
  id: number | string
  title: string
  category_id?: string
  category?: string
  year: string
  visibilidade: 'public' | 'private' | 'restricted'
  file_url?: string
  created_at?: string
  updated_at?: string
}

export interface AuditLog {
  id: string
  user_id?: string
  action: string
  timestamp: string
  created_at?: string
}

export interface UserProfile {
  id?: string
  display_name: string
  email: string
  avatar_url?: string
  created_at?: string
  updated_at?: string
}

export interface PortalSettings {
  id?: string
  user_id?: string
  description: string
  website: string
  phone: string
  updated_at?: string
}
