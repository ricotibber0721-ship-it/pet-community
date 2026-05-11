import { NextResponse } from 'next/server'

type NaverItem = {
  title: string
  link: string
  category: string
  description: string
  telephone: string
  address: string
  roadAddress: string
  mapx: string
  mapy: string
}

export type Hospital = {
  name: string
  category: string
  address: string
  roadAddress: string
  telephone: string
  lat: number
  lng: number
  link: string
  distanceKm?: number
}

function stripTags(html: string) {
  return html
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim()
}

function distanceKm(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371
  const toRad = (d: number) => (d * Math.PI) / 180
  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(a))
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const lat = parseFloat(searchParams.get('lat') ?? '')
  const lng = parseFloat(searchParams.get('lng') ?? '')
  const query = (searchParams.get('q') ?? '동물병원').slice(0, 50)

  const id = process.env.NAVER_CLIENT_ID
  const secret = process.env.NAVER_CLIENT_SECRET

  if (!id || !secret) {
    return NextResponse.json(
      { error: '네이버 API 키가 설정되지 않았어요.' },
      { status: 500 }
    )
  }

  const naverUrl = new URL('https://openapi.naver.com/v1/search/local.json')
  naverUrl.searchParams.set('query', query)
  naverUrl.searchParams.set('display', '5')
  naverUrl.searchParams.set('sort', 'random')

  const res = await fetch(naverUrl, {
    headers: {
      'X-Naver-Client-Id': id,
      'X-Naver-Client-Secret': secret,
    },
    cache: 'no-store',
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    return NextResponse.json(
      { error: `네이버 검색 실패: ${res.status} ${text.slice(0, 200)}` },
      { status: 502 }
    )
  }

  const data: { items: NaverItem[] } = await res.json()

  const hasCoords = Number.isFinite(lat) && Number.isFinite(lng)

  const hospitals: Hospital[] = (data.items ?? []).map((item) => {
    const placeLng = parseFloat(item.mapx) / 1e7
    const placeLat = parseFloat(item.mapy) / 1e7
    const name = stripTags(item.title)
    const dist = hasCoords ? distanceKm(lat, lng, placeLat, placeLng) : undefined
    return {
      name,
      category: item.category,
      address: item.address,
      roadAddress: item.roadAddress,
      telephone: item.telephone,
      lat: placeLat,
      lng: placeLng,
      link: item.link,
      distanceKm: dist,
    }
  })

  if (hasCoords) {
    hospitals.sort((a, b) => (a.distanceKm ?? 0) - (b.distanceKm ?? 0))
  }

  return NextResponse.json({ hospitals })
}
