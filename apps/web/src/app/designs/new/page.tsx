'use client'

import React, { useState } from 'react'
import { analyzeDesignPlan, answerDesign } from '@/src/lib/designs'
import type { DesignBrief } from '@/src/types/designs'
import { api } from '@/src/lib/api'
import { idem } from '@/src/lib/idempotency'
import { useRouter } from 'next/navigation'

export default function DesignNewPage() {
  const [prompt, setPrompt] = useState('Planetary şanzıman: oran≈12, güç≈2kW, tork≈50Nm')
  const [auto, setAuto] = useState(true)
  const [chainCam, setChainCam] = useState(false)
  const [chainSim, setChainSim] = useState(false)
  const [questions, setQuestions] = useState<Array<{ id: string; text: string }>>([])
  const [err, setErr] = useState<string | null>(null)
  const router = useRouter()

  async function onAnalyze() {
    setErr(null)
    try {
      // Yeni akış: önce proje oluştur, sonra plan çıkar
      const proj = await api.post<{id:number}>("/api/v1/projects", { name: 'P2D', type: 'part', source: 'prompt', prompt }, { 'Idempotency-Key': idem() })
      const pid = (proj as any).id as number
      const plan = await analyzeDesignPlan(pid, prompt)
      const missing = (plan as any).missing as string[]
      setQuestions(missing.map((m) => ({ id: m, text: m })))
    } catch (e: any) {
      setErr(e.message || 'Hata')
    }
  }

  async function onSubmit() {
    setErr(null)
    try {
      // Şimdilik sadece Q&A kaydet
      alert('Plan oluşturuldu, eksikler soruldu. Yanıtları Q&A sayfasında doldurun.')
      router.push('/projects/new')
    } catch (e: any) {
      setErr(e.message || 'Hata')
    }
  }

  return (
    <main className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Tasarım (P2D)</h1>
      {err && <div className="bg-red-100 text-red-700 p-2">{err}</div>}
      <label className="block text-sm">Tasarım Tanımı</label>
      <textarea className="border p-2 w-full h-40" value={prompt} onChange={(e) => setPrompt(e.target.value)} />
      <div className="flex items-center gap-3">
        <label className="flex items-center gap-2"><input type="checkbox" checked={auto} onChange={(e) => setAuto(e.target.checked)} /> Otomatik netleştir</label>
        <label className="flex items-center gap-2"><input type="checkbox" checked={chainCam} onChange={(e) => setChainCam(e.target.checked)} /> CAM</label>
        <label className="flex items-center gap-2"><input type="checkbox" checked={chainSim} onChange={(e) => setChainSim(e.target.checked)} /> Sim</label>
        <button className="ml-auto px-3 py-1 border rounded" onClick={onAnalyze}>Soruları üret</button>
        <button className="px-3 py-1 bg-indigo-600 text-white rounded" onClick={onSubmit}>Oluştur</button>
      </div>
      {questions.length > 0 && (
        <div className="border rounded p-3">
          <h3 className="font-medium mb-2">Netleştirme Soruları</h3>
          <ul className="list-disc ml-5 space-y-1">
            {questions.map((q) => (
              <li key={q.id}>{q.text}</li>
            ))}
          </ul>
        </div>
      )}
    </main>
  )
}


