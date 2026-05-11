import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

type PostRow = {
  id: string
  title: string
  created_at: string
  profiles: { email: string } | null
}

export default async function BoardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: posts, error } = await supabase
    .from('posts')
    .select('id, title, created_at, profiles(email)')
    .order('created_at', { ascending: false })
    .limit(50)
    .returns<PostRow[]>()

  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">
              ← 홈
            </Link>
            <h1 className="text-2xl font-bold mt-1">🐾 자유게시판</h1>
          </div>
          {user && (
            <Link
              href="/board/new"
              className="bg-blue-600 text-white font-semibold rounded-md px-4 py-2 hover:bg-blue-700 transition"
            >
              + 글쓰기
            </Link>
          )}
        </div>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-3 mb-4">
            글 목록을 불러오지 못했어요: {error.message}
          </p>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 divide-y divide-gray-100">
          {!posts || posts.length === 0 ? (
            <p className="p-6 text-center text-gray-500">
              아직 글이 없어요. {user ? '첫 글을 써보세요!' : '로그인 후 글을 써보세요.'}
            </p>
          ) : (
            posts.map((post) => (
              <Link
                key={post.id}
                href={`/board/${post.id}`}
                className="block p-4 hover:bg-gray-50 transition"
              >
                <h2 className="font-semibold text-gray-900 truncate">{post.title}</h2>
                <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                  <span>{post.profiles?.email ?? '익명'}</span>
                  <span>·</span>
                  <span>{new Date(post.created_at).toLocaleString('ko-KR')}</span>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </main>
  )
}
