import { supabase } from './config';

interface StorageUploadOptions {
  folder?: string;
  isPublic?: boolean;
}

interface StorageFile {
  name: string;
  url: string;
  size: number;
  lastModified: string;
}

/**
 * Supabase Storage Service
 * Handles file uploads, downloads, and deletions using Supabase Storage
 */
export class SupabaseStorageService {
  private bucketName = 'pdfs';

  /**
   * Sanitize filename by removing accents, special characters, and spaces
   * Supabase Storage is sensitive to these characters in file paths
   */
  private sanitizeFileName(fileName: string): string {
    return fileName
      // Normalize and remove accents/diacritics
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      // Replace common special characters and spaces
      .replace(/[^\w.-]/g, '_')
      // Replace multiple underscores with single one
      .replace(/_+/g, '_')
      // Remove leading/trailing underscores
      .replace(/^_+|_+$/g, '');
  }

  /**
   * Upload a file to Supabase Storage
   */
  async uploadFile(
    file: File,
    fileName: string,
    options?: StorageUploadOptions
  ): Promise<{ path: string; url: string }> {
    try {
      const folder = options?.folder || 'documents';
      const timestamp = Date.now();
      // Sanitize the filename before creating the unique name
      const sanitizedFileName = this.sanitizeFileName(fileName);
      const uniqueName = `${timestamp}-${sanitizedFileName}`;
      const filePath = `${folder}/${uniqueName}`;

      // Upload to Supabase Storage
      const { error } = await supabase.storage
        .from(this.bucketName)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (error) {
        throw new Error(`Upload failed: ${error.message}`);
      }

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from(this.bucketName)
        .getPublicUrl(filePath);

      return {
        path: filePath,
        url: publicUrlData.publicUrl,
      };
    } catch (error) {
      console.error('Storage upload error:', error);
      throw error;
    }
  }

  /**
   * Delete a file from Supabase Storage
   */
  async deleteFile(filePath: string): Promise<void> {
    try {
      const { error } = await supabase.storage
        .from(this.bucketName)
        .remove([filePath]);

      if (error) {
        throw new Error(`Delete failed: ${error.message}`);
      }
    } catch (error) {
      console.error('Storage delete error:', error);
      throw error;
    }
  }

  /**
   * Get public URL for a file
   */
  getPublicUrl(filePath: string): string {
    const { data } = supabase.storage
      .from(this.bucketName)
      .getPublicUrl(filePath);

    return data.publicUrl;
  }

  /**
   * List files in a folder
   */
  async listFiles(folderPath: string): Promise<StorageFile[]> {
    try {
      const { data, error } = await supabase.storage
        .from(this.bucketName)
        .list(folderPath, {
          limit: 100,
          offset: 0,
          sortBy: { column: 'name', order: 'asc' },
        });

      if (error) {
        throw new Error(`List failed: ${error.message}`);
      }

      return (data || []).map((file: any) => ({
        name: file.name,
        url: this.getPublicUrl(`${folderPath}/${file.name}`),
        size: file.metadata?.size || 0,
        lastModified: file.updated_at || new Date().toISOString(),
      }));
    } catch (error) {
      console.error('Storage list error:', error);
      throw error;
    }
  }
}

export const storageService = new SupabaseStorageService();
export default storageService;
