'use client'

import { useEffect, useRef, useState, useTransition } from 'react'
import { createClient } from '@/lib/supabase/client'
import { sendMessage } from './actions'

export type Message = {
  id: string
  content: string
  user_id: string
  author_email: string
  created_at: string
}

export function ChatClient({
  initialMessages,
  userId,
}: {
  initialMessages: Message[]
  userId: string
}) {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [text, setText] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const supabase = createClient()
    const channel = supabase
      .channel('public:messages')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        (payload) => {
          const incoming = payload.new as Message
          setMessages((prev) =>
            prev.some((m) => m.id === incoming.id) ? prev : [...prev, incoming]
          )
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const value = text.trim()
    if (!value) return
    setError(null)
    setText('')
    startTransition(async () => {
      const result = await sendMessage(value)
      if (!result.ok) setError(result.error)
    })
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-50">
        {messages.length === 0 ? (
          <p className="text-center text-gray-400 text-sm mt-8">
            아직 메시지가 없어요. 첫 메시지를 보내보세요!
          </p>
        ) : (
          messages.map((m) => {
            const mine = m.user_id === userId
            return (
              <div
                key={m.id}
                className={`flex ${mine ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[75%] rounded-2xl px-3 py-2 text-sm ${
                    mine
                      ? 'bg-blue-600 text-white rounded-br-sm'
                      : 'bg-white text-gray-900 border border-gray-200 rounded-bl-sm'
                  }`}
                >
                  {!mine && (
                    <div className="text-xs font-semibold mb-0.5 text-blue-700">
                      {m.author_email}
                    </div>
                  )}
                  <div className="whitespace-pre-wrap break-words">{m.content}</div>
                  <div
                    className={`text-[10px] mt-1 ${
                      mine ? 'text-blue-100' : 'text-gray-400'
                    }`}
                  >
                    {new Date(m.created_at).toLocaleTimeString('ko-KR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>
              </div>
            )
          })
        )}
        <div ref={bottomRef} />
      </div>

      {error && (
        <div className="px-4 py-2 text-sm text-red-600 bg-red-50 border-t border-red-200">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="border-t border-gray-200 p-3 flex gap-2 bg-white"
      >
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="메시지를 입력하세요"
          maxLength={1000}
          className="flex-1 rounded-full border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={isPending || !text.trim()}
          className="rounded-full bg-blue-600 text-white font-semibold px-5 py-2 hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          전송
        </button>
      </form>
    </div>
  )
}
