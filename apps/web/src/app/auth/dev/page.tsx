'use client'
import { useEffect } from 'react'
import { devLoginOnce } from '@/lib/auth'
import { useRouter } from 'next/navigation'

export default function DevAuthPage() {
  const router = useRouter()
  useEffect(() => {
    (async () => {
      await devLoginOnce()
      router.replace('/jobs')
    })()
  }, [router])
  return (
    <div className="p-6">
      <div className="bg-yellow-200 p-3 rounded">Dev moddasınız. Oturum açılıyor...</div>
    </div>
  )
}


