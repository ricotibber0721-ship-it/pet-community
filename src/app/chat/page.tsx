import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ChatClient, type Message } from './chat-client'

export default async function ChatPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: messages } = await supabase
    .from('messages')
    .select('id, content, user_id, author_email, created_at')
    .order('created_at', { ascending: true })
    .limit(100)
    .returns<Message[]>()

  return (
    <main className="min-h-screen bg-gray-50 py-6 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-4">
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">
            ← 홈
          </Link>
          <h1 className="text-2xl font-bold mt-1">💬 실시간 채팅</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            모든 회원이 함께하는 단체 채팅방
          </p>
        </div>

        <ChatClient initialMessages={messages ?? []} userId={user.id} />
      </div>
    </main>
  )
}
