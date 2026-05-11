import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { signOut } from '@/app/auth/actions'

export async function Header() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <header className="sticky top-0 z-40 bg-white/85 backdrop-blur border-b border-[#ffe5d9]/60">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="inline-flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-br from-[#ff8a6f] to-[#ff6b47] text-white font-extrabold text-lg shadow-[0_4px_12px_-2px_rgba(255,107,71,0.5)] group-hover:rotate-6 transition">
            M
          </span>
          <span className="font-extrabold text-lg tracking-tight">
            Mpet<span className="text-[#ff6b47]">care</span>
          </span>
        </Link>

        <nav className="flex items-center gap-1 text-sm font-semibold">
          <Link
            href="/board"
            className="px-3 py-2 rounded-full text-gray-600 hover:text-[#ff6b47] hover:bg-[#fff8f3] transition"
          >
            게시판
          </Link>
          <Link
            href="/chat"
            className="px-3 py-2 rounded-full text-gray-600 hover:text-[#ff6b47] hover:bg-[#fff8f3] transition"
          >
            채팅
          </Link>

          {user ? (
            <form action={signOut} className="ml-1">
              <button
                type="submit"
                className="px-3 py-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition"
              >
                로그아웃
              </button>
            </form>
          ) : (
            <Link
              href="/login"
              className="ml-1 px-4 py-2 rounded-full bg-[#ff6b47] text-white hover:bg-[#e5573a] transition shadow-[0_4px_12px_-2px_rgba(255,107,71,0.5)]"
            >
              로그인
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}
