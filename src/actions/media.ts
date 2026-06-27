'use server'

import { createClient } from '@/lib/supabase/server'
import { generateStorageKey, uploadToR2 } from '@/lib/r2'
import crypto from 'crypto'
import { revalidatePath } from 'next/cache'

const MAX_UPLOAD_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];

export async function uploadMedia(formData: FormData) {
  const supabase = await createClient();
  if (!supabase) {
    return { success: false, error: 'Supabase not configured' };
  }
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: 'Unauthorized' };
  }

  const file = formData.get('file') as File | null;
  const folder = (formData.get('folder') as string) || 'general';

  if (!file) {
    return { success: false, error: 'No file provided' };
  }

  if (file.size > MAX_UPLOAD_SIZE) {
    return { success: false, error: 'File size exceeds 10MB limit' };
  }

  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return { success: false, error: 'Invalid file type. Only JPG, PNG, WEBP, and AVIF are allowed.' };
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  
  // Calculate checksum for duplicate detection
  const hash = crypto.createHash('sha256').update(buffer).digest('hex');

  // Check if file already exists in DB
  const { data: existingMedia } = await (supabase as any)
    .from('media')
    .select('*')
    .eq('checksum_sha256', hash)
    .is('deleted_at', null)
    .single();

  if (existingMedia) {
    return { success: true, data: existingMedia };
  }

  // File doesn't exist, upload to R2
  const extension = file.name.split('.').pop() || 'webp';
  const storageKey = generateStorageKey(folder, extension);

  try {
    const url = await uploadToR2(buffer, storageKey, file.type);
    
    // We let the client pass dimensions if possible, or leave null
    const width = Number(formData.get('width')) || null;
    const height = Number(formData.get('height')) || null;
    const altText = (formData.get('alt_text') as string) || file.name.split('.')[0];

    const { data: mediaRecord, error: insertError } = await (supabase as any)
      .from('media')
      .insert({
        filename: file.name,
        original_filename: file.name,
        storage_key: storageKey,
        storage_provider: 'cloudflare_r2',
        mime_type: file.type,
        extension: extension,
        size: file.size,
        checksum_sha256: hash,
        folder: folder,
        url: url,
        width: width,
        height: height,
        alt_text: altText,
        uploaded_by: user.id
      })
      .select()
      .single();

    if (insertError) throw insertError;
    
    revalidatePath('/admin/media');
    return { success: true, data: mediaRecord };

  } catch (error: any) {
    console.error('Upload error:', error);
    return { success: false, error: error.message || 'Failed to upload media' };
  }
}

export async function getMedia(folder?: string, search?: string) {
  const supabase = await createClient();
  if (!supabase) {
    return { success: false, error: 'Supabase not configured' };
  }
  let query = (supabase as any).from('media').select('*').is('deleted_at', null).order('created_at', { ascending: false });

  if (folder && folder !== 'all') {
    query = query.eq('folder', folder);
  }
  
  if (search) {
    query = query.or(`filename.ilike.%${search}%,alt_text.ilike.%${search}%,caption.ilike.%${search}%`);
  }

  const { data, error } = await query;
  if (error) {
    console.error('Failed to get media:', error);
    return { success: false, error: error.message };
  }

  return { success: true, data };
}

export async function softDeleteMedia(id: string) {
  const supabase = await createClient();
  if (!supabase) {
    return { success: false, error: 'Supabase not configured' };
  }
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: 'Unauthorized' };
  }

  // Media Usage Tracking
  const { count: productCount } = await supabase.from('products').select('*', { count: 'exact', head: true }).eq('featured_media_id', id) as any;
  const { count: beanCount } = await supabase.from('beans').select('*', { count: 'exact', head: true }).eq('featured_media_id', id) as any;
  const { count: guideCount } = await supabase.from('guides').select('*', { count: 'exact', head: true }).eq('cover_media_id', id) as any;
  const { count: brandCount } = await supabase.from('brands').select('*', { count: 'exact', head: true }).eq('logo_media_id', id) as any;

  const totalUsage = (productCount || 0) + (beanCount || 0) + (guideCount || 0) + (brandCount || 0);

  if (totalUsage > 0) {
    return { success: false, error: `Cannot delete media. It is currently being used in ${totalUsage} content record(s).` };
  }

  const { error } = await (supabase as any)
    .from('media')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath('/admin/media');
  return { success: true };
}

export async function updateMediaMetadata(id: string, data: { alt_text?: string, caption?: string, folder?: string }) {
  const supabase = await createClient();
  if (!supabase) {
    return { success: false, error: 'Supabase not configured' };
  }
  
  const { error } = await (supabase as any)
    .from('media')
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath('/admin/media');
  return { success: true };
}
