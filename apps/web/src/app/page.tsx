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
    <main className="p-6">
      <h1 className="text-2xl font-bold">FreeCAD Üretim Platformu</h1>
      <p className="mt-2 text-gray-700">{mesaj}</p>
    </main>
  );
}


