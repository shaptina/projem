export type GcodeMove = { x?: number; y?: number; z?: number; f?: number; type: 'G0' | 'G1' };
export type GcodePolyline = { type: 'rapid' | 'feed'; points: [number, number, number][] };

export function parseGcode(text: string) {
  const lines = text.split(/\r?\n/);
  const moves: GcodeMove[] = [];
  let lastF: number | undefined;
  const feedValues: number[] = [];
  for (const raw of lines) {
    const line = raw.trim();
    if (!line || line.startsWith(';') || line.startsWith('(')) continue;
    const m = line.match(/^(G0|G1)\s+.*$/i);
    if (!m) continue;
    const type = m[1].toUpperCase() as 'G0' | 'G1';
    const x = matchNum(line, /\bX(-?\d+(?:\.\d+)?)\b/i);
    const y = matchNum(line, /\bY(-?\d+(?:\.\d+)?)\b/i);
    const z = matchNum(line, /\bZ(-?\d+(?:\.\d+)?)\b/i);
    const f = matchNum(line, /\bF(\d+(?:\.\d+)?)\b/i) ?? lastF;
    if (type === 'G1' && f) { lastF = f; feedValues.push(f); }
    moves.push({ x, y, z, f: f ?? undefined, type });
  }
  const polylines: GcodePolyline[] = [];
  let curRapid: [number, number, number][] = [];
  let curFeed: [number, number, number][] = [];
  let cx = 0, cy = 0, cz = 0;
  for (const mv of moves) {
    cx = mv.x ?? cx; cy = mv.y ?? cy; cz = mv.z ?? cz;
    if (mv.type === 'G0') {
      curRapid.push([cx, cy, cz]);
    } else {
      curFeed.push([cx, cy, cz]);
    }
  }
  if (curRapid.length > 1) polylines.push({ type: 'rapid', points: curRapid });
  if (curFeed.length > 1) polylines.push({ type: 'feed', points: curFeed });
  const hasFBeforeG1 = lines.findIndex(l => /^G1/i.test(l)) === -1 || /\bF\d/.test(text);
  const isMM = /^G21/m.test(text);
  const isIN = /^G20/m.test(text);
  return { polylines, hasFBeforeG1, units: isMM ? 'mm' : (isIN ? 'inch' : 'unknown'), feedValues } as const;
}

function matchNum(line: string, re: RegExp): number | undefined {
  const m = line.match(re);
  return m ? Number(m[1]) : undefined;
}


