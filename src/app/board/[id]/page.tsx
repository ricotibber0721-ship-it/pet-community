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
    <main className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <Link href="/board" className="text-sm text-gray-500 hover:text-gray-700">
          ← 게시판
        </Link>

        <article className="mt-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
          <header className="space-y-2 border-b border-gray-100 pb-4">
            <h1 className="text-2xl font-bold text-gray-900 break-words">{post.title}</h1>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>{post.profiles?.email ?? '익명'}</span>
              <span>·</span>
              <span>{new Date(post.created_at).toLocaleString('ko-KR')}</span>
            </div>
          </header>

          <div className="prose prose-sm max-w-none whitespace-pre-wrap break-words text-gray-800 leading-relaxed">
            {post.content}
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-2">
              {error}
            </p>
          )}

          {isAuthor && (
            <div className="flex justify-end pt-2 border-t border-gray-100">
              <form action={deleteThis}>
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-md text-sm text-red-600 hover:bg-red-50 transition"
                >
                  삭제
                </button>
              </form>
            </div>
          )}
        </article>
      </div>
    </main>
  )
}
