import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { deletePost } from '@/app/board/actions'

type PostDetail = {
  id: string
  title: string
  content: string
  created_at: string
  user_id: string
  profiles: { email: string } | null
}

export default async function PostDetailPage(props: PageProps<'/board/[id]'>) {
  const { id } = await props.params
  const sp = await props.searchParams
  const error = typeof sp.error === 'string' ? sp.error : undefined

  const supabase = await createClient()
  const { data: post } = await supabase
    .from('posts')
    .select('id, title, content, created_at, user_id, profiles(email)')
    .eq('id', id)
    .maybeSingle<PostDetail>()

  if (!post) notFound()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  const isAuthor = user?.id === post.user_id

  const deleteThis = deletePost.bind(null, post.id)

  return (
    <main className="bg-gradient-to-b from-[#fff1e8] to-[#fff8f3] min-h-[calc(100vh-4rem)]">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <Link
          href="/board"
          className="inline-flex items-center text-sm font-semibold text-gray-500 hover:text-[#ff6b47] transition"
        >
          ← 게시판으로
        </Link>

        <article className="mt-3 bg-white rounded-3xl shadow-[0_8px_30px_-12px_rgba(255,107,71,0.2)] border-2 border-[#ffe5d9]/40 overflow-hidden">
          <header className="px-7 pt-7 pb-5 border-b border-[#fff1e8]">
            <h1 className="text-2xl sm:text-[1.6rem] font-extrabold text-gray-900 break-words leading-snug">
              {post.title}
            </h1>
            <div className="mt-3 flex items-center gap-1.5 text-xs text-gray-400">
              <span>🐾 {post.profiles?.email ?? '익명'}</span>
              <span>·</span>
              <time>{new Date(post.created_at).toLocaleString('ko-KR')}</time>
            </div>
          </header>

          <div className="px-7 py-7 whitespace-pre-wrap break-words text-gray-800 leading-relaxed text-[15px]">
            {post.content}
          </div>

          {error && (
            <div className="mx-7 mb-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-2xl px-3 py-2.5">
              {error}
            </div>
          )}

          {isAuthor && (
            <div className="flex justify-end px-7 py-4 border-t border-[#fff1e8] bg-[#fff8f3]/40">
              <form action={deleteThis}>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-full text-sm font-semibold text-red-500 hover:bg-red-50 transition"
                >
                  🗑 삭제
                </button>
              </form>
            </div>
          )}
        </article>
      </div>
    </main>
  )
}
