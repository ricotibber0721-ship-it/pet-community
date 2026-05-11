import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export default async function HomePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <main className="bg-white overflow-hidden">
      {/* Hero */}
      <section className="relative bg-gradient-to-b from-[#fff1e8] via-[#fff8f3] to-white overflow-hidden">
        {/* Floating decorations */}
        <span className="absolute top-12 left-[8%] text-3xl opacity-40 animate-float">🐾</span>
        <span className="absolute top-32 right-[10%] text-2xl opacity-40 animate-float-slow">🐾</span>
        <span className="absolute bottom-20 left-[15%] text-2xl opacity-30 animate-float-slow">✨</span>
        <span className="absolute bottom-12 right-[20%] text-2xl opacity-40 animate-float">💕</span>

        <div className="relative max-w-5xl mx-auto px-4 py-20 sm:py-28 text-center">
          <div className="flex justify-center gap-3 mb-6">
            <span className="text-6xl sm:text-7xl inline-block animate-wiggle origin-bottom">🐶</span>
            <span className="text-6xl sm:text-7xl inline-block animate-float">🐱</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900 leading-tight">
            우리집 댕댕이·냥냥이의
            <br />
            <span className="bg-gradient-to-r from-[#ff8a6f] to-[#ff6b47] bg-clip-text text-transparent">
              작고 귀여운 커뮤니티
            </span>{' '}
            🌷
          </h1>
          <p className="mt-5 text-base sm:text-lg text-gray-600 max-w-xl mx-auto leading-relaxed">
            보호자들끼리 서로 안부 묻고, 일상 자랑하고,
            <br className="hidden sm:block" /> 실시간으로 수다 떠는 따뜻한 공간이에요 🍯
          </p>

          {user ? (
            <div className="mt-8 inline-flex items-center gap-2 bg-white border-2 border-[#ffe5d9] rounded-full px-5 py-2.5 shadow-sm">
              <span>👋</span>
              <span className="text-sm font-semibold text-gray-700">
                {user.email} 님, 어서오세요!
              </span>
            </div>
          ) : (
            <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/signup"
                className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-[#ff6b47] text-white font-bold hover:bg-[#e5573a] transition shadow-[0_8px_24px_-4px_rgba(255,107,71,0.5)] hover:scale-105"
              >
                🐾 무료로 시작하기
              </Link>
              <Link
                href="/login"
                className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-white text-gray-700 font-bold border-2 border-gray-100 hover:bg-gray-50 transition"
              >
                로그인
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Feature cards */}
      <section className="max-w-5xl mx-auto px-4 py-14 sm:py-20">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
            오늘 뭐하러 오셨어요?
          </h2>
          <p className="text-sm text-gray-500 mt-2">고르기만 하면 바로 시작해요 🐾</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Link
            href="/board"
            className="group relative overflow-hidden rounded-3xl border-2 border-[#ffe5d9] bg-gradient-to-br from-[#fff1e8] to-[#fff8f3] p-7 transition hover:-translate-y-1 hover:shadow-[0_16px_40px_-12px_rgba(255,107,71,0.3)]"
          >
            <span className="absolute top-3 right-3 text-2xl opacity-30 group-hover:opacity-70 group-hover:rotate-12 transition">
              🐾
            </span>
            <div className="text-5xl mb-3 inline-block group-hover:animate-wiggle">📔</div>
            <h3 className="text-xl font-extrabold text-gray-900">자유게시판</h3>
            <p className="mt-1.5 text-sm text-gray-600 leading-relaxed">
              우리 아이 자랑부터 키울 때 궁금한 거까지,
              <br />
              다 같이 나눠요!
            </p>
            <span className="mt-5 inline-flex items-center text-sm font-bold text-[#ff6b47] group-hover:translate-x-1 transition">
              둘러보러 가기 →
            </span>
          </Link>

          <Link
            href="/chat"
            className="group relative overflow-hidden rounded-3xl border-2 border-[#d9ecff] bg-gradient-to-br from-[#eaf4ff] to-[#f7faff] p-7 transition hover:-translate-y-1 hover:shadow-[0_16px_40px_-12px_rgba(100,150,255,0.3)]"
          >
            <span className="absolute top-3 right-3 text-2xl opacity-30 group-hover:opacity-70 group-hover:rotate-12 transition">
              ✨
            </span>
            <div className="text-5xl mb-3 inline-block group-hover:animate-wiggle">💬</div>
            <h3 className="text-xl font-extrabold text-gray-900">실시간 채팅</h3>
            <p className="mt-1.5 text-sm text-gray-600 leading-relaxed">
              지금 접속한 친구들이랑
              <br />
              바로바로 이야기해요!
            </p>
            <span className="mt-5 inline-flex items-center text-sm font-bold text-[#4a90e2] group-hover:translate-x-1 transition">
              들어가러 가기 →
            </span>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#ffe5d9]/60 py-10 text-center text-xs text-gray-400 space-y-1">
        <p className="text-2xl">🐶 🐱</p>
        <p>Mpetcare · 우리 아이가 행복하면 우리도 행복해요 💕</p>
      </footer>
    </main>
  )
}
