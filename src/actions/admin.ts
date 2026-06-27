'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { updateSearchIndex, deleteSearchIndex } from '@/lib/search/indexer'

export async function createRecord(table: string, data: any, revalidatePaths: string[] = []) {
  const supabase = await createClient()
  if (!supabase) return { success: false, error: 'Supabase is not configured' }

  // Check auth
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Unauthorized' }

  // Extract tags from data so it doesn't break table insert
  const { tags, ...cleanData } = data
  const tagsList = tags || []

  // Set created_by and updated_by for audit trail
  const recordData = {
    ...cleanData,
    created_by: user.id,
    updated_by: user.id
  }

  const { data: result, error } = await supabase
    .from(table as any)
    .insert(recordData as any)
    .select()
    .single()

  if (error) {
    console.error(`Error creating in ${table}:`, error)
    return { success: false, error: error.message }
  }

  // Handle tags
  if (tagsList.length > 0) {
    const assignments = tagsList.map((tagId: string) => ({
      entity_type: table,
      entity_id: (result as any).id,
      tag_id: tagId,
      created_by: user.id
    }))
    const { error: tagError } = await supabase.from('tag_assignments').insert(assignments)
    if (tagError) console.error('Error assigning tags:', tagError)
  }

  // Update Search Index
  await updateSearchIndex(table, (result as any).id, result, tagsList)

  for (const path of revalidatePaths) {
    revalidatePath(path)
  }

  return { success: true, data: result }
}

export async function updateRecord(table: string, id: string | number, data: any, revalidatePaths: string[] = []) {
  const supabase = await createClient()
  if (!supabase) return { success: false, error: 'Supabase is not configured' }

  // Check auth
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Unauthorized' }

  // Extract tags from data
  const { tags, ...cleanData } = data
  const tagsList = tags || []

  // Set updated_by for audit trail
  const recordData = {
    ...cleanData,
    updated_by: user.id,
    updated_at: new Date().toISOString()
  }

  const { data: result, error } = await supabase
    .from(table as any)
    // @ts-ignore Dynamic table name makes type inference fail
    .update(recordData as any)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error(`Error updating in ${table}:`, error)
    return { success: false, error: error.message }
  }

  // Handle tags (delete existing, then insert new)
  if (tags !== undefined) {
    await supabase.from('tag_assignments').delete().eq('entity_type', table).eq('entity_id', id)
    if (tagsList.length > 0) {
      const assignments = tagsList.map((tagId: string) => ({
        entity_type: table,
        entity_id: id,
        tag_id: tagId,
        created_by: user.id
      }))
      const { error: tagError } = await supabase.from('tag_assignments').insert(assignments)
      if (tagError) console.error('Error re-assigning tags:', tagError)
    }
  }

  // Fetch current tags if they weren't provided in the payload but we need them for index
  let finalTags = tagsList
  if (tags === undefined) {
    const { data: existingTags } = await supabase.from('tag_assignments').select('tag_id').eq('entity_type', table).eq('entity_id', id)
    finalTags = existingTags?.map((t: any) => t.tag_id) || []
  }

  // Update Search Index
  await updateSearchIndex(table, id as string, result, finalTags)

  for (const path of revalidatePaths) {
    revalidatePath(path)
  }

  return { success: true, data: result }
}

export async function deleteRecord(table: string, id: string | number, revalidatePaths: string[] = [], hard: boolean = false) {
  const supabase = await createClient()
  if (!supabase) return { success: false, error: 'Supabase is not configured' }

  // Check auth
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Unauthorized' }

  let error;

  if (hard) {
    const { error: deleteError } = await supabase
      .from(table as any)
      .delete()
      .eq('id', id)
    error = deleteError;
  } else {
    // Soft delete
    const { error: updateError } = await (supabase
      .from(table as any)
      // @ts-ignore Dynamic table name makes type inference fail
      .update({
        deleted_at: new Date().toISOString(),
        updated_by: user.id
      } as any) as any)
      .eq('id', id)
    error = updateError;
  }

  if (error) {
    console.error(`Error deleting in ${table}:`, error)
    return { success: false, error: error.message }
  }

  if (hard) {
    await supabase.from('tag_assignments').delete().eq('entity_type', table).eq('entity_id', id)
    await deleteSearchIndex(table, id as string)
  } else {
    // For soft delete, update status in search index
    const { data: result } = await supabase.from(table).select('*').eq('id', id).single()
    if (result) {
      const { data: existingTags } = await supabase.from('tag_assignments').select('tag_id').eq('entity_type', table).eq('entity_id', id)
      await updateSearchIndex(table, id as string, { ...(result as any), status: 'deleted' }, existingTags?.map((t: any) => t.tag_id) || [])
    }
  }

  for (const path of revalidatePaths) {
    revalidatePath(path)
  }

  return { success: true }
}
