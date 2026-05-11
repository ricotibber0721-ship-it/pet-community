'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function createPost(formData: FormData) {
  const title = String(formData.get('title') ?? '').trim()
  const content = String(formData.get('content') ?? '').trim()

  if (!title || !content) {
    redirect('/board/new?error=' + encodeURIComponent('제목과 내용을 모두 입력해주세요.'))
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data, error } = await supabase
    .from('posts')
    .insert({ title, content, user_id: user.id })
    .select('id')
    .single()

  if (error || !data) {
    redirect('/board/new?error=' + encodeURIComponent(error?.message ?? '글 작성에 실패했어요.'))
  }

  revalidatePath('/board')
  redirect(`/board/${data.id}`)
}

export async function deletePost(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('posts').delete().eq('id', id)

  if (error) {
    redirect(`/board/${id}?error=` + encodeURIComponent(error.message))
  }

  revalidatePath('/board')
  redirect('/board')
}
