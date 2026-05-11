'use server'

import { createClient } from '@/lib/supabase/server'

export type SendResult = { ok: true } | { ok: false; error: string }

export async function sendMessage(content: string): Promise<SendResult> {
  const trimmed = content.trim()
  if (!trimmed) return { ok: false, error: '내용을 입력해주세요.' }
  if (trimmed.length > 1000) return { ok: false, error: '메시지가 너무 길어요 (1000자 이하).' }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { ok: false, error: '로그인이 필요해요.' }

  const { error } = await supabase.from('messages').insert({
    content: trimmed,
    user_id: user.id,
    author_email: user.email ?? '익명',
  })

  if (error) return { ok: false, error: error.message }
  return { ok: true }
}
