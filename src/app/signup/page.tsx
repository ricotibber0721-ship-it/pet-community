import Link from 'next/link'
import { signUp } from '@/app/auth/actions'
import { GoogleButton } from '@/app/auth/google-button'

export default async function SignupPage(props: PageProps<'/signup'>) {
  const sp = await props.searchParams
  const error = typeof sp.error === 'string' ? sp.error : undefined
  const success = sp.success === '1'

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-sm bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
        <h1 className="text-2xl font-bold text-center">회원가입</h1>

        {success ? (
          <div className="space-y-3 text-center">
            <p className="text-green-700 bg-green-50 border border-green-200 rounded-md p-3 text-sm">
              가입 성공! 이메일로 발송된 인증 링크를 클릭하면 로그인할 수 있어요.
            </p>
            <Link href="/login" className="inline-block text-blue-600 hover:underline">
              로그인 화면으로 이동
            </Link>
          </div>
        ) : (
          <>
            <form action={signUp} className="space-y-3">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  이메일
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  비밀번호 (6자 이상)
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  minLength={6}
                  required
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {error && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-2">
                  {error}
                </p>
              )}

              <button
                type="submit"
                className="w-full bg-blue-600 text-white font-semibold rounded-md py-2 hover:bg-blue-700 transition"
              >
                가입하기
              </button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white px-2 text-gray-500">또는</span>
              </div>
            </div>

            <GoogleButton label="Google로 가입" />

            <p className="text-center text-sm text-gray-600">
              이미 계정이 있으신가요?{' '}
              <Link href="/login" className="text-blue-600 hover:underline">
                로그인
              </Link>
            </p>
          </>
        )}
      </div>
    </main>
  )
}
