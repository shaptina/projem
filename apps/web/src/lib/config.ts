export type Bounds = { x: [number, number]; y: [number, number]; z: [number, number] };

export function getMachineBounds(): Bounds {
  try {
    const raw = process.env.NEXT_PUBLIC_MACHINE_BOUNDS;
    if (raw) {
      const obj = JSON.parse(raw);
      if (obj.x && obj.y && obj.z) return obj as Bounds;
    }
  } catch {}
  return { x: [0, 300], y: [0, 300], z: [-50, 150] };
}


