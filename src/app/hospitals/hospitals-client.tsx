'use client'

import { useState } from 'react'
import type { Hospital } from '@/app/api/hospitals/route'

type Status = 'idle' | 'locating' | 'searching' | 'done' | 'error'

export function HospitalsClient() {
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState<string | null>(null)
  const [hospitals, setHospitals] = useState<Hospital[]>([])
  const [hasLocation, setHasLocation] = useState(false)
  const [query, setQuery] = useState('동물병원')
  const [resolvedQuery, setResolvedQuery] = useState<string | null>(null)

  async function search(opts: { useLocation: boolean }) {
    setError(null)
    setHospitals([])

    let lat: number | undefined
    let lng: number | undefined

    if (opts.useLocation) {
      setStatus('locating')
      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          if (!('geolocation' in navigator)) {
            reject(new Error('이 브라우저는 위치 정보를 지원하지 않아요.'))
            return
          }
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: false,
            timeout: 20000,
            maximumAge: 300000,
          })
        })
        lat = position.coords.latitude
        lng = position.coords.longitude
        setHasLocation(true)
      } catch (e: unknown) {
        const code = (e as GeolocationPositionError | undefined)?.code
        let msg = '위치를 가져오지 못했어요.'
        if (code === 1) msg = '위치 권한이 거부되었어요. 브라우저 설정에서 권한을 허용해주세요.'
        else if (code === 2) msg = '위치를 알 수 없어요. 잠시 후 다시 시도해주세요.'
        else if (code === 3) msg = '위치 가져오는 데 시간이 너무 걸려요.'
        setError(msg)
        setStatus('error')
        return
      }
    }

    setStatus('searching')
    try {
      const params = new URLSearchParams()
      params.set('q', query.trim() || '동물병원')
      if (typeof lat === 'number' && typeof lng === 'number') {
        params.set('lat', String(lat))
        params.set('lng', String(lng))
      }
      const res = await fetch(`/api/hospitals?${params.toString()}`)
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data?.error ?? '검색에 실패했어요.')
      }
      setHospitals(data.hospitals ?? [])
      setResolvedQuery(data.query ?? null)
      setStatus('done')
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : '검색에 실패했어요.')
      setStatus('error')
    }
  }

  return (
    <div className="space-y-5">
      {/* Action buttons */}
      <div className="bg-white rounded-3xl shadow-[0_8px_30px_-12px_rgba(255,107,71,0.2)] border-2 border-[#ffe5d9]/40 p-5 space-y-3">
        <button
          onClick={() => search({ useLocation: true })}
          disabled={status === 'locating' || status === 'searching'}
          className="w-full bg-[#ff6b47] text-white font-bold rounded-2xl py-3.5 hover:bg-[#e5573a] transition shadow-[0_8px_20px_-6px_rgba(255,107,71,0.5)] hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100"
        >
          {status === 'locating'
            ? '📍 위치 확인 중…'
            : status === 'searching'
              ? '🔍 검색 중…'
              : '📍 내 주변 동물병원 찾기'}
        </button>

        <div className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="예: 강남 동물병원, 24시간 동물병원"
            className="flex-1 rounded-2xl border-2 border-gray-100 bg-white px-4 py-2.5 text-sm focus:outline-none focus:border-[#ff6b47] focus:bg-[#fff8f3] transition"
          />
          <button
            onClick={() => search({ useLocation: false })}
            disabled={status === 'locating' || status === 'searching'}
            className="px-5 py-2.5 rounded-2xl bg-gray-100 text-gray-700 font-bold text-sm hover:bg-gray-200 transition disabled:opacity-50"
          >
            검색
          </button>
        </div>
        <p className="text-xs text-gray-400 text-center">
          💡 위치 권한을 허용하면 가까운 순으로 정렬돼요
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border-2 border-red-100 text-red-600 text-sm rounded-2xl p-4">
          {error}
        </div>
      )}

      {/* Results */}
      {status === 'done' && hospitals.length === 0 && (
        <div className="bg-white rounded-3xl border-2 border-[#ffe5d9]/40 p-10 text-center">
          <div className="text-5xl mb-2 inline-block animate-float">🐶</div>
          <p className="text-gray-500 text-sm">
            검색 결과가 없어요.
            <br />
            다른 검색어로 시도해보세요!
          </p>
        </div>
      )}

      {hospitals.length > 0 && resolvedQuery && (
        <p className="text-center text-xs text-gray-500">
          🔎 <span className="font-semibold text-gray-700">{resolvedQuery}</span> 검색 결과
        </p>
      )}

      {hospitals.length > 0 && (
        <ul className="space-y-3">
          {hospitals.map((h, i) => (
            <li
              key={i}
              className="bg-white rounded-3xl shadow-[0_4px_20px_-8px_rgba(255,107,71,0.2)] border-2 border-[#ffe5d9]/40 p-5 hover:-translate-y-0.5 transition"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <h3 className="font-extrabold text-gray-900 text-base truncate flex items-center gap-1.5">
                    🏥 {h.name}
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">{h.category}</p>
                </div>
                {typeof h.distanceKm === 'number' && (
                  <span className="shrink-0 inline-flex items-center gap-1 bg-[#ffe5d9] text-[#ff6b47] text-xs font-bold rounded-full px-3 py-1">
                    📍 {h.distanceKm < 1
                      ? `${Math.round(h.distanceKm * 1000)}m`
                      : `${h.distanceKm.toFixed(1)}km`}
                  </span>
                )}
              </div>

              <p className="text-sm text-gray-600 mt-3 leading-relaxed">
                {h.roadAddress || h.address}
              </p>

              {h.telephone && (
                <a
                  href={`tel:${h.telephone}`}
                  className="inline-flex items-center gap-1 mt-2 text-sm text-gray-600 hover:text-[#ff6b47]"
                >
                  📞 {h.telephone}
                </a>
              )}

              <div className="flex gap-2 mt-4">
                <a
                  href={`https://map.naver.com/p/search/${encodeURIComponent(h.name + ' ' + (h.roadAddress || h.address))}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 text-center px-4 py-2 rounded-full bg-[#03c75a] text-white font-bold text-sm hover:bg-[#02b350] transition shadow-sm"
                >
                  🗺 네이버 지도에서 보기
                </a>
                {h.telephone && (
                  <a
                    href={`tel:${h.telephone}`}
                    className="px-4 py-2 rounded-full bg-gray-100 text-gray-700 font-bold text-sm hover:bg-gray-200 transition"
                  >
                    📞 전화
                  </a>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      {status === 'idle' && (
        <div className="bg-white rounded-3xl border-2 border-[#ffe5d9]/40 p-10 text-center">
          <div className="text-5xl mb-3 inline-block animate-wiggle">🐾</div>
          <p className="text-gray-500 text-sm leading-relaxed">
            위 버튼을 눌러서
            <br />
            우리 아이 병원을 찾아보세요!
          </p>
        </div>
      )}

      {hasLocation && status === 'done' && (
        <p className="text-center text-xs text-gray-400">
          💡 검색 결과는 최대 5개입니다. 더 많은 결과는 네이버 지도에서 보세요.
        </p>
      )}
    </div>
  )
}
