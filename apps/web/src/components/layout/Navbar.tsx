'use client'

import Link from 'next/link'
import React from 'react'

export function Navbar() {
  const dev = process.env.NEXT_PUBLIC_DEV_AUTH_BYPASS === 'true'
  return (
    <nav className="w-full border-b bg-white">
      <div className="max-w-6xl mx-auto px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link className="font-semibold" href="/">FreeCAD</Link>
          <Link className="text-sm text-gray-700 hover:underline" href="/assemblies/new">Montaj Oluştur</Link>
          <Link className="text-sm text-gray-700 hover:underline" href="/jobs">İşler</Link>
          <Link className="text-sm text-gray-700 hover:underline" href="/viewer">Görüntüleyici</Link>
          <Link className="text-sm text-gray-700 hover:underline" href="/designs/new">Tasarım (P2D)</Link>
          <Link className="text-sm text-gray-700 hover:underline" href="/downloads">İndirilenler</Link>
          <Link className="text-sm text-gray-700 hover:underline" href="/reports">Raporlar</Link>
          <Link className="text-sm text-gray-700 hover:underline" href="/settings">Ayarlar</Link>
          <Link className="text-sm text-gray-700 hover:underline" href="/status">Durum</Link>
          <Link className="text-sm text-gray-700 hover:underline" href="/help">Yardım</Link>
          <Link className="text-sm text-gray-700 hover:underline" href="/projects/new">Yeni Proje</Link>
        </div>
        <div>
          {dev && <span className="text-xs px-2 py-0.5 rounded bg-yellow-200 text-yellow-900">Dev Mod</span>}
        </div>
      </div>
    </nav>
  )
}


