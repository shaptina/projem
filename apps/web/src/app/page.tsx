'use client';
import React, { useEffect, useState } from 'react';

export default function HomePage() {
  const [mesaj, setMesaj] = useState<string>('Yükleniyor...');

  useEffect(() => {
    const dev = process.env.NEXT_PUBLIC_DEV_AUTH_BYPASS === 'true';
    const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
    async function ensureDevLogin() {
      if (!dev) {
        setMesaj('Hoş geldiniz');
        return;
      }
      const token = localStorage.getItem('access_token');
      if (token) {
        setMesaj('Hoş geldiniz (Geliştirici)');
        return;
      }
      const res = await fetch(`${apiBase}/api/v1/auth/dev-login`, {
        method: 'POST',
        headers: { 'X-Dev-User': 'dev@local' },
      });
      if (!res.ok) {
        setMesaj('Geliştirici oturumu başlatılamadı');
        return;
      }
      const data = await res.json();
      localStorage.setItem('access_token', data.access_token);
      setMesaj('Hoş geldiniz (Geliştirici)');
    }
    ensureDevLogin();
  }, []);

  return (
    <main>
      <h1 className="text-2xl font-bold">FreeCAD Üretim Platformu</h1>
      <p className="mt-2 text-gray-700">{mesaj}</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div className="border rounded p-4">
          <h3 className="font-semibold">Montaj Oluştur</h3>
          <p className="text-sm text-gray-600 mt-1">Planet türünde montaj taslağı oluşturun.</p>
          <a href="/assemblies/new" className="inline-block mt-3 px-3 py-1 bg-indigo-600 text-white rounded">Başla</a>
        </div>
        <div className="border rounded p-4">
          <h3 className="font-semibold">İşler</h3>
          <p className="text-sm text-gray-600 mt-1">Tüm işlerinizi görüntüleyin ve durumlarını takip edin.</p>
          <a href="/jobs" className="inline-block mt-3 px-3 py-1 bg-indigo-600 text-white rounded">Git</a>
        </div>
        <div className="border rounded p-4">
          <h3 className="font-semibold">Görüntüleyici</h3>
          <p className="text-sm text-gray-600 mt-1">Simülasyon mesh ve G-code önizleme.</p>
          <a href="/viewer" className="inline-block mt-3 px-3 py-1 bg-indigo-600 text-white rounded">Aç</a>
        </div>
      </div>
    </main>
  );
}


