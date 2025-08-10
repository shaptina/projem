'use client';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid, GizmoHelper, GizmoViewport } from '@react-three/drei';
import * as THREE from 'three';
import { parseGcode } from '../../lib/gcode';
import { getMachineBounds } from '../../lib/config';

type Job = {
  id: number;
  artefacts?: { type: string; signed_url?: string }[];
  metrics?: Record<string, unknown>;
};

function Polyline({ points, color, dashed = false }: { points: [number, number, number][]; color: string; dashed?: boolean }) {
  const positions = useMemo(() => points.flat(), [points]);
  return (
    <line>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={positions.length / 3} array={new Float32Array(positions)} itemSize={3} />
      </bufferGeometry>
      <lineBasicMaterial color={color} linewidth={1} />
    </line>
  );
}

export default function ViewerPage() {
  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
  const url = new URL(typeof window !== 'undefined' ? window.location.href : 'http://localhost');
  const jobId = url.searchParams.get('jobId');
  const [job, setJob] = useState<Job | null>(null);
  const [gcode, setGcode] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [units, setUnits] = useState<'mm' | 'inch' | 'unknown'>('unknown');
  const [showSim, setShowSim] = useState(true);
  const [progress, setProgress] = useState<number>(0);

  const evtSrc = useRef<EventSource | null>(null);

  useEffect(() => {
    if (!jobId) return;
    (async () => {
      try {
        const r = await fetch(`${apiBase}/api/v1/jobs/${jobId}`);
        if (!r.ok) throw new Error('İş detayları alınamadı');
        const data = await r.json();
        setJob(data);
        const g = data.artefacts?.find((a: any) => a.type === 'gcode')?.signed_url;
        if (g) {
          const gr = await fetch(g);
          if (!gr.ok) throw new Error('G-code indirilemedi. İmzalı URL süresi dolmuş olabilir.');
          const txt = await gr.text();
          setGcode(txt);
          const parsed = parseGcode(txt);
          setUnits(parsed.units);
        }
        // sim mesh var mı?
        const sim = data.artefacts?.find((a: any) => a.type === 'sim-mesh')?.signed_url;
        if (sim) {
          // glTF mesh'i sahneye eklemek için üç.js loader ile ileriki adımda bağlarız
        }
      } catch (e: any) {
        setError(e.message || 'Hata');
      }
    })();
  }, [jobId]);

  const parsed = useMemo(() => (gcode ? parseGcode(gcode) : null), [gcode]);
  const bounds = useMemo(() => getMachineBounds(), []);

  useEffect(() => {
    if (!jobId) return;
    // SSE: canlı ilerleme
    const src = new EventSource(`${apiBase}/api/v1/sim/${jobId}/events`);
    evtSrc.current = src;
    src.onmessage = (ev) => {
      try {
        const data = JSON.parse(ev.data);
        if (typeof data.progress === 'number') setProgress(data.progress);
      } catch {}
    };
    src.onerror = () => {
      // otomatik yeniden bağlanmayı tarayıcı yapar; kullanıcıya bilgi
      // ileride toast/banner ile “SSE bağlantısı koptu, yeniden bağlanılıyor…” gösterilebilir
    };
    return () => { src.close(); };
  }, [jobId]);

  return (
    <main className="p-0 h-screen">
      <div className="p-3 border-b flex items-center justify-between">
        <div>
          <div className="font-semibold">G-code Önizleme</div>
          <div className="text-sm text-gray-600">İş #{jobId} — Birimler: {units}</div>
        </div>
        {gcode && (
          <a href={`data:text/plain;charset=utf-8,${encodeURIComponent(gcode)}`} download={`job-${jobId}.nc`} className="px-3 py-1 bg-blue-600 text-white rounded">İndir</a>
        )}
      </div>
      {error && <div className="p-2 bg-red-100 text-red-700">{error}</div>}
      <div className="px-3 py-2 border-b flex items-center gap-3">
        <label className="flex items-center gap-2 text-sm text-gray-700"><input type="checkbox" checked={showSim} onChange={e => setShowSim(e.target.checked)} /> Simülasyon Mesh</label>
        {progress > 0 && progress < 100 && (
          <div className="flex-1">
            <div className="h-2 bg-gray-200 rounded"><div className="h-2 bg-blue-600 rounded" style={{ width: `${progress}%` }} /></div>
            <div className="text-xs text-gray-600">İlerleme: {progress.toFixed(0)}%</div>
          </div>
        )}
      </div>
      <Canvas camera={{ position: [200, 200, 200], fov: 50 }} style={{ height: 'calc(100vh - 56px)' }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[100, 100, 100]} />
        <Grid args={[500, 50]} />
        <axesHelper args={[50]} />
        <OrbitControls makeDefault />
        <GizmoHelper alignment="bottom-right" margin={[80, 80]}>
          <GizmoViewport labelColor="white" axisHeadScale={1} />
        </GizmoHelper>

        {parsed?.polylines.map((pl, idx) => (
          <Polyline key={idx} points={pl.points} color={pl.type === 'rapid' ? '#888' : '#1976d2'} />
        ))}

        {/* Makine sınırları wireframe kutu */}
        <mesh position={[(bounds.x[1] - bounds.x[0]) / 2, (bounds.y[1] - bounds.y[0]) / 2, (bounds.z[1] - bounds.z[0]) / 2]}> 
          <boxGeometry args={[bounds.x[1] - bounds.x[0], bounds.y[1] - bounds.y[0], bounds.z[1] - bounds.z[0]]} />
          <meshBasicMaterial color="#00aaff" wireframe />
        </mesh>
      </Canvas>
    </main>
  );
}



