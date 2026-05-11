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
    <main className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <Link href="/board" className="text-sm text-gray-500 hover:text-gray-700">
          ← 게시판
        </Link>
        <h1 className="text-2xl font-bold mt-1 mb-6">새 글 작성</h1>

        <form action={createPost} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              제목
            </label>
            <input
              id="title"
              name="title"
              type="text"
              required
              maxLength={200}
              placeholder="제목을 입력하세요"
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
              내용
            </label>
            <textarea
              id="content"
              name="content"
              required
              rows={10}
              placeholder="내용을 입력하세요"
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-2">
              {error}
            </p>
          )}

          <div className="flex gap-2 justify-end">
            <Link
              href="/board"
              className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
            >
              취소
            </Link>
            <button
              type="submit"
              className="px-4 py-2 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
            >
              올리기
            </button>
          </div>
        </form>
      </div>
    </main>
  )
}
