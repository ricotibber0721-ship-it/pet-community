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
    <main className="bg-gradient-to-b from-[#fff1e8] to-[#fff8f3] min-h-[calc(100vh-4rem)]">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-end justify-between mb-6 gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 flex items-center gap-2">
              <span className="text-3xl">📔</span> 자유게시판
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              우리 아이 이야기 들려주세요 🐾
            </p>
          </div>
          {user && (
            <Link
              href="/board/new"
              className="bg-[#ff6b47] text-white text-sm font-bold rounded-full px-5 py-3 hover:bg-[#e5573a] transition shadow-[0_6px_18px_-4px_rgba(255,107,71,0.5)] hover:scale-105 whitespace-nowrap"
            >
              ✏️ 글쓰기
            </Link>
          )}
        </div>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 border-2 border-red-100 rounded-2xl p-3 mb-4">
            글 목록을 불러오지 못했어요: {error.message}
          </p>
        )}

        <div className="bg-white rounded-3xl shadow-[0_8px_30px_-12px_rgba(255,107,71,0.15)] border-2 border-[#ffe5d9]/40 overflow-hidden">
          {!posts || posts.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-5xl mb-3 animate-float inline-block">🐕</div>
              <p className="text-gray-500 text-sm leading-relaxed">
                아직 글이 없어요.
                <br />
                {user ? '첫 글을 써보세요! 🐾' : '로그인하고 첫 글의 주인공이 되어보세요.'}
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-[#fff1e8]">
              {posts.map((post) => (
                <li key={post.id}>
                  <Link
                    href={`/board/${post.id}`}
                    className="block px-5 py-4 hover:bg-[#fff8f3] transition group"
                  >
                    <h2 className="font-bold text-gray-900 truncate group-hover:text-[#ff6b47] transition">
                      {post.title}
                    </h2>
                    <div className="mt-1.5 flex items-center gap-1.5 text-xs text-gray-400">
                      <span>🐾 {post.profiles?.email ?? '익명'}</span>
                      <span>·</span>
                      <time>{new Date(post.created_at).toLocaleString('ko-KR')}</time>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </main>
  )
}
