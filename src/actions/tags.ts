'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function mergeTags(sourceTagId: string, targetTagId: string) {
  const supabase = await createClient()
  if (!supabase) return { success: false, error: 'Supabase is not configured' }

  // Check auth
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Unauthorized' }

  // Start a "transaction" via rpc or execute multiple queries
  // Update all tag_assignments pointing to sourceTagId to point to targetTagId
  const { error: updateError } = await supabase
    .from('tag_assignments')
    // @ts-ignore
    .update({ tag_id: targetTagId })
    .eq('tag_id', sourceTagId)

  if (updateError) {
    return { success: false, error: updateError.message }
  }

  // Delete the source tag
  const { error: deleteError } = await supabase
    .from('tags')
    // @ts-ignore
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', sourceTagId)

  if (deleteError) {
    return { success: false, error: deleteError.message }
  }

  // Optionally update usage counts
  // We can leave this for a background job or DB trigger later

  revalidatePath('/admin/tags')
  return { success: true }
}

export async function assignTags(entityType: string, entityId: string, tagIds: string[]) {
  const supabase = await createClient()
  if (!supabase) return { success: false, error: 'Supabase is not configured' }

  // Check auth
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Unauthorized' }

  // Delete existing assignments for this entity
  await supabase
    .from('tag_assignments')
    .delete()
    .eq('entity_type', entityType)
    .eq('entity_id', entityId)

  // If no new tags to assign, just return
  if (!tagIds || tagIds.length === 0) {
    return { success: true }
  }

  // Create new assignments
  const assignments = tagIds.map(tagId => ({
    tag_id: tagId,
    entity_type: entityType,
    entity_id: entityId
  }))

  const { error } = await supabase
    .from('tag_assignments')
    // @ts-ignore
    .insert(assignments)

  if (error) {
    console.error('Error assigning tags:', error)
    return { success: false, error: error.message }
  }

  return { success: true }
}
