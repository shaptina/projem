"use client";
import { useEffect, useState } from "react";
import { createSetup, listSetups, planOps3D, startCam, startPost, startSim, type SetupOut } from "@/lib/setups";
import { useParams } from "next/navigation";

export default function ProjectSetupsPage() {
  const params = useParams();
  const pid = Number(params?.id);
  const [items, setItems] = useState<SetupOut[]>([]);
  const [name, setName] = useState("");
  const [wcs, setWcs] = useState("G54");

  async function refresh() {
    const data = await listSetups(pid);
    setItems(data.items);
  }

  useEffect(()=>{ if (pid) refresh(); }, [pid]);

  async function onCreate() {
    await createSetup({ project_id: pid, name: name || "Yeni Yön", wcs });
    setName("");
    await refresh();
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Setuplar</h1>
      <div className="flex gap-2">
        <input className="border p-2" placeholder="Ad" value={name} onChange={e=>setName(e.target.value)} />
        <input className="border p-2 w-24" placeholder="WCS" value={wcs} onChange={e=>setWcs(e.target.value)} />
        <button onClick={onCreate} className="px-3 py-2 bg-black text-white rounded">Yön Ekle</button>
      </div>
      <div className="grid gap-3">
        {items.map(it=> (
          <div key={it.id} className="border p-3 rounded">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">#{it.id} {it.name}</div>
                <div className="text-sm text-gray-600">WCS {it.wcs} · rx/ry/rz {it.orientation_rx_deg}/{it.orientation_ry_deg}/{it.orientation_rz_deg} · durum {it.status}</div>
              </div>
              <div className="flex gap-2">
                <button onClick={async()=>{ await planOps3D(it.id, [{ op_type:'surface', params:{ stepover_pct:30 } }]); }} className="px-2 py-1 border rounded">Plan 3D</button>
                <button onClick={async()=>{ await startCam(it.id); }} className="px-2 py-1 border rounded">CAM</button>
                <button onClick={async()=>{ await startSim(it.id); }} className="px-2 py-1 border rounded">SIM</button>
                <button onClick={async()=>{ await startPost(it.id); }} className="px-2 py-1 border rounded">POST</button>
                <button onClick={refresh} className="px-2 py-1 border rounded">Yenile</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


