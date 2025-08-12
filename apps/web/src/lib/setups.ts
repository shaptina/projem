export type SetupOut = {
  id: number;
  project_id: number;
  name: string;
  wcs: string;
  status: 'draft' | 'cam_ready' | 'sim_ok' | 'post_ok';
  orientation_rx_deg: number;
  orientation_ry_deg: number;
  orientation_rz_deg: number;
};

async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL!;
  const res = await fetch(`${base}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...(init.headers || {}) },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json() as Promise<T>;
}

export function idem() { return crypto.randomUUID(); }

export async function createSetup(input: { project_id: number; name: string; wcs: string; rx?: number; ry?: number; rz?: number; }) {
  return api<SetupOut>('/api/v1/setups', {
    method: 'POST',
    headers: { 'Idempotency-Key': idem() },
    body: JSON.stringify({
      project_id: input.project_id,
      name: input.name,
      wcs: input.wcs,
      orientation_rx_deg: input.rx ?? 0,
      orientation_ry_deg: input.ry ?? 0,
      orientation_rz_deg: input.rz ?? 0,
    }),
  });
}

export async function listSetups(projectId: number) {
  return api<{ items: SetupOut[] }>(`/api/v1/setups/project/${projectId}`);
}

export async function planOps3D(setupId: number, ops: any[]) {
  return api(`/api/v1/setups/${setupId}/plan-ops3d`, { method: 'POST', body: JSON.stringify({ ops }) });
}

export async function startCam(setupId: number) {
  return api(`/api/v1/setups/${setupId}/cam`, { method: 'POST' });
}

export async function startSim(setupId: number) {
  return api(`/api/v1/setups/${setupId}/simulate`, { method: 'POST' });
}

export async function startPost(setupId: number) {
  return api(`/api/v1/setups/${setupId}/post`, { method: 'POST' });
}


