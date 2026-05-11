import Link from 'next/link'
import { signUp } from '@/app/auth/actions'
import { GoogleButton } from '@/app/auth/google-button'

export default async function SignupPage(props: PageProps<'/signup'>) {
  const sp = await props.searchParams
  const error = typeof sp.error === 'string' ? sp.error : undefined
  const success = sp.success === '1'

  return (
    <main className="bg-gradient-to-b from-[#fff1e8] to-[#fff8f3] min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-10 relative overflow-hidden">
      <span className="absolute top-20 left-[10%] text-3xl opacity-40 animate-float-slow">💕</span>
      <span className="absolute bottom-16 right-[12%] text-3xl opacity-40 animate-float">🐾</span>

      <div className="relative w-full max-w-sm bg-white rounded-[2rem] shadow-[0_20px_50px_-20px_rgba(255,107,71,0.3)] border-2 border-[#ffe5d9]/60 p-8 space-y-5">
        <div className="text-center space-y-2">
          <div className="text-5xl animate-wiggle inline-block">🐱</div>
          <h1 className="text-2xl font-extrabold text-gray-900">처음 오셨어요?</h1>
          <p className="text-sm text-gray-500">Mpetcare 가족이 되어보세요 🌷</p>
        </div>

        {success ? (
          <div className="space-y-4 text-center py-2">
            <div className="text-5xl animate-pop">📬</div>
            <p className="text-green-700 bg-green-50 border-2 border-green-100 rounded-2xl px-4 py-3 text-sm leading-relaxed">
              가입 완료! 🎉
              <br />
              이메일로 받은 인증 링크를 클릭한 후 로그인하세요.
            </p>
            <Link
              href="/login"
              className="inline-block text-[#ff6b47] font-bold hover:underline"
            >
              로그인하러 가기 →
            </Link>
          </div>
        ) : (
          <>
            <form action={signUp} className="space-y-3">
              <div>
                <label htmlFor="email" className="block text-xs font-bold text-gray-600 mb-1.5">
                  이메일
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  className="w-full rounded-2xl border-2 border-gray-100 bg-white px-4 py-3 text-sm focus:outline-none focus:border-[#ff6b47] focus:bg-[#fff8f3] transition"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-xs font-bold text-gray-600 mb-1.5">
                  비밀번호 (6자 이상)
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  minLength={6}
                  required
                  placeholder="••••••••"
                  className="w-full rounded-2xl border-2 border-gray-100 bg-white px-4 py-3 text-sm focus:outline-none focus:border-[#ff6b47] focus:bg-[#fff8f3] transition"
                />
              </div>

              {error && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-2xl px-3 py-2.5">
                  {error}
                </p>
              )}

              <button
                type="submit"
                className="w-full bg-[#ff6b47] text-white font-bold rounded-2xl py-3 hover:bg-[#e5573a] transition shadow-[0_8px_20px_-6px_rgba(255,107,71,0.5)] hover:scale-[1.02]"
              >
                가입하기 🎀
              </button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-100"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white px-3 text-gray-400">또는</span>
              </div>
            </div>

            <GoogleButton label="Google로 가입" />

            <p className="text-center text-sm text-gray-500">
              이미 계정이 있으세요?{' '}
              <Link href="/login" className="text-[#ff6b47] font-bold hover:underline">
                로그인
              </Link>
            </p>
          </>
        )}
      </div>
    </main>
  )
}
