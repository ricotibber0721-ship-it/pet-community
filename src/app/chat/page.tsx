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
    <main className="bg-gradient-to-b from-[#fff1e8] to-[#fff8f3] min-h-[calc(100vh-4rem)]">
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="mb-4">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 flex items-center gap-2">
            <span className="text-3xl animate-wiggle inline-block">💬</span> 실시간 채팅방
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            지금 접속한 친구들이랑 수다 떠세요 🐾
          </p>
        </div>

        <ChatClient initialMessages={messages ?? []} userId={user.id} />
      </div>
    </main>
  )
}
