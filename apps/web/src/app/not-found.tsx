export default function NotFound() {
  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold">Sayfa bulunamadı</h1>
      <p className="text-gray-700 mt-2">Aradığınız sayfa mevcut değil veya taşınmış olabilir.</p>
      <a href="/" className="inline-block mt-4 px-3 py-1 bg-indigo-600 text-white rounded">Ana sayfaya dön</a>
    </div>
  )
}


