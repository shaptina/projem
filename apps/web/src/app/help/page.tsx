'use client'

export default function HelpPage() {
  return (
    <main className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Yardım</h1>
      <section>
        <h2 className="text-lg font-semibold">Hızlı Başlangıç</h2>
        <ol className="list-decimal ml-5 mt-2 space-y-1">
          <li>Montaj oluşturun (planet).</li>
          <li>İş detayında “CAM başlat”.</li>
          <li>G-code üretince “Simülasyon başlat”.</li>
          <li>Görüntüleyici’de mesh ve G-code’u görüntüleyin.</li>
        </ol>
      </section>
      <section>
        <h2 className="text-lg font-semibold">Sık Hatalar</h2>
        <ul className="list-disc ml-5 mt-2 space-y-1 text-gray-700">
          <li>429: Hız sınırı. Biraz bekleyip tekrar deneyin.</li>
          <li>409: Kuyruk duraklatılmış. Kısa süre sonra tekrar deneyin.</li>
          <li>403: Yetki yok. Gerekli rolünüz olduğundan emin olun.</li>
        </ul>
      </section>
      <section>
        <h2 className="text-lg font-semibold">Döküman</h2>
        <a className="text-indigo-600 underline" href="/docs/PRD.md" target="_blank" rel="noreferrer">PRD</a>
      </section>
    </main>
  )
}


