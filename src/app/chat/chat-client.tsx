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
    <div className="flex flex-col h-[calc(100vh-12rem)] bg-white rounded-3xl shadow-[0_8px_30px_-12px_rgba(255,107,71,0.2)] border-2 border-[#ffe5d9]/40 overflow-hidden">
      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-3 bg-gradient-to-b from-[#fff8f3] to-white">
        {messages.length === 0 ? (
          <div className="text-center mt-16">
            <div className="text-5xl mb-3 animate-wiggle inline-block">🐾</div>
            <p className="text-gray-400 text-sm leading-relaxed">
              아직 메시지가 없어요.
              <br />
              먼저 인사 한 마디 어때요? 🤗
            </p>
          </div>
        ) : (
          messages.map((m, i) => {
            const mine = m.user_id === userId
            const prev = messages[i - 1]
            const showAuthor = !mine && (!prev || prev.user_id !== m.user_id)
            return (
              <div
                key={m.id}
                className={`flex ${mine ? 'justify-end' : 'justify-start'} animate-pop`}
              >
                <div className={`max-w-[78%] ${mine ? 'items-end' : 'items-start'} flex flex-col`}>
                  {showAuthor && (
                    <span className="text-[11px] font-semibold text-gray-500 mb-1 px-2 flex items-center gap-1">
                      <span>🐾</span> {m.author_email}
                    </span>
                  )}
                  <div
                    className={`rounded-3xl px-4 py-2.5 text-sm leading-relaxed ${
                      mine
                        ? 'bg-gradient-to-br from-[#ff8a6f] to-[#ff6b47] text-white rounded-br-md shadow-[0_4px_12px_-2px_rgba(255,107,71,0.4)]'
                        : 'bg-white text-gray-900 border-2 border-[#ffe5d9]/60 rounded-bl-md shadow-sm'
                    }`}
                  >
                    <div className="whitespace-pre-wrap break-words">{m.content}</div>
                  </div>
                  <span
                    className={`text-[10px] mt-1 px-2 text-gray-400`}
                  >
                    {new Date(m.created_at).toLocaleTimeString('ko-KR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>
            )
          })
        )}
        <div ref={bottomRef} />
      </div>

      {error && (
        <div className="px-4 py-2 text-xs text-red-600 bg-red-50 border-t border-red-100">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="border-t border-[#ffe5d9]/60 p-3 flex gap-2 bg-white"
      >
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="메시지를 입력하세요 💬"
          maxLength={1000}
          className="flex-1 rounded-full border-2 border-gray-100 px-5 py-3 text-sm focus:outline-none focus:border-[#ff6b47] focus:bg-[#fff8f3] transition"
        />
        <button
          type="submit"
          disabled={isPending || !text.trim()}
          className="rounded-full bg-[#ff6b47] text-white font-bold px-6 py-3 text-sm hover:bg-[#e5573a] transition disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_4px_12px_-2px_rgba(255,107,71,0.4)] hover:scale-105"
        >
          전송 ✨
        </button>
      </form>
    </div>
  )
}
