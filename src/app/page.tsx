import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { signOut } from '@/app/auth/actions'

export default async function HomePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-md bg-white rounded-xl shadow-sm border border-gray-200 p-8 space-y-6 text-center">
        <h1 className="text-3xl font-bold">🐾 펫 커뮤니티</h1>
        <p className="text-gray-600">강아지·고양이 보호자들의 공간</p>

        {user ? (
          <div className="space-y-4">
            <p className="text-gray-700">
              <span className="font-semibold">{user.email}</span> 님, 환영해요!
            </p>
            <Link
              href="/board"
              className="block w-full bg-blue-600 text-white font-semibold rounded-md py-2 hover:bg-blue-700 transition"
            >
              자유게시판 가기
            </Link>
            <form action={signOut}>
              <button
                type="submit"
                className="w-full bg-gray-100 text-gray-800 font-semibold rounded-md py-2 hover:bg-gray-200 transition"
              >
                로그아웃
              </button>
            </form>
          </div>
        ) : (
          <div className="space-y-3">
            <Link
              href="/board"
              className="block w-full bg-gray-100 text-gray-800 font-semibold rounded-md py-2 hover:bg-gray-200 transition"
            >
              자유게시판 둘러보기
            </Link>
            <Link
              href="/login"
              className="block w-full bg-blue-600 text-white font-semibold rounded-md py-2 hover:bg-blue-700 transition"
            >
              로그인
            </Link>
            <Link
              href="/signup"
              className="block w-full bg-white text-blue-600 font-semibold rounded-md py-2 border border-blue-600 hover:bg-blue-50 transition"
            >
              회원가입
            </Link>
          </div>
        )}
      </div>
    </main>
  )
}
