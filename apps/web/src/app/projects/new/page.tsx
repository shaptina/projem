"use client";
import { useState } from "react";
import { api } from "@/lib/api";
import { idem } from "@/lib/idempotency";
import { useRouter } from "next/navigation";

export default function NewProjectPage() {
  const [name,setName] = useState("");
  const [prompt,setPrompt] = useState("");
  const r = useRouter();

  async function create() {
    const proj = await api.post<{id:number}>("/api/v1/projects", {
      name,
      type: "part",
      source: "prompt",
      prompt
    }, { "Idempotency-Key": idem() });
    const pid = (proj as any).id as number;
    await api.post("/api/v1/design/plan", {
      project_id: pid,
      prompt
    }, { "Idempotency-Key": idem() });
    r.push(`/qna?projectId=${pid}`);
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Yeni Proje</h1>
      <input className="border p-2 w-full" placeholder="Proje adı" value={name} onChange={e=>setName(e.target.value)} />
      <textarea className="border p-2 w-full h-40" placeholder="Doğal dille tarif" value={prompt} onChange={e=>setPrompt(e.target.value)} />
      <button onClick={create} className="px-4 py-2 rounded bg-black text-white">Oluştur ve Planla</button>
    </div>
  );
}


