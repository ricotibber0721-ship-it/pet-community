import { HospitalsClient } from './hospitals-client'

export default function HospitalsPage() {
  return (
    <main className="bg-gradient-to-b from-[#fff1e8] to-[#fff8f3] min-h-[calc(100vh-4rem)]">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 flex items-center gap-2">
            <span className="text-3xl animate-wiggle inline-block">🏥</span> 내 주변 동물병원
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            우리 아이 아플 때 가까운 병원 찾아요 🐾
          </p>
        </div>

        <HospitalsClient />
      </div>
    </main>
  )
}
