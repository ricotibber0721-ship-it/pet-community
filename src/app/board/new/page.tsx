import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createPost } from '@/app/board/actions'

export default async function NewPostPage(props: PageProps<'/board/new'>) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const sp = await props.searchParams
  const error = typeof sp.error === 'string' ? sp.error : undefined

  return (
    <main className="bg-gradient-to-b from-[#fff1e8] to-[#fff8f3] min-h-[calc(100vh-4rem)]">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <Link
          href="/board"
          className="inline-flex items-center text-sm font-semibold text-gray-500 hover:text-[#ff6b47] transition"
        >
          ← 게시판으로
        </Link>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-2 mb-6 flex items-center gap-2">
          <span className="text-3xl animate-wiggle inline-block">✏️</span> 새 글 작성
        </h1>

        <form
          action={createPost}
          className="bg-white rounded-3xl shadow-[0_8px_30px_-12px_rgba(255,107,71,0.2)] border-2 border-[#ffe5d9]/40 p-6 space-y-4"
        >
          <div>
            <label htmlFor="title" className="block text-xs font-bold text-gray-600 mb-1.5">
              제목
            </label>
            <input
              id="title"
              name="title"
              type="text"
              required
              maxLength={200}
              placeholder="어떤 이야기를 들려주실래요?"
              className="w-full rounded-2xl border-2 border-gray-100 bg-white px-4 py-3 text-sm focus:outline-none focus:border-[#ff6b47] focus:bg-[#fff8f3] transition"
            />
          </div>
          <div>
            <label htmlFor="content" className="block text-xs font-bold text-gray-600 mb-1.5">
              내용
            </label>
            <textarea
              id="content"
              name="content"
              required
              rows={12}
              placeholder="우리 아이 이야기를 들려주세요 🐾"
              className="w-full rounded-2xl border-2 border-gray-100 bg-white px-4 py-3 text-sm focus:outline-none focus:border-[#ff6b47] focus:bg-[#fff8f3] transition resize-y"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-2xl px-3 py-2.5">
              {error}
            </p>
          )}

          <div className="flex gap-2 justify-end pt-2">
            <Link
              href="/board"
              className="px-5 py-2.5 rounded-full text-sm font-semibold border-2 border-gray-100 text-gray-700 hover:bg-gray-50 transition"
            >
              취소
            </Link>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-full text-sm bg-[#ff6b47] text-white font-bold hover:bg-[#e5573a] transition shadow-[0_6px_18px_-4px_rgba(255,107,71,0.5)] hover:scale-105"
            >
              올리기 🎀
            </button>
          </div>
        </form>
      </div>
    </main>
  )
}
