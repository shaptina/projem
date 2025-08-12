import { http, HttpResponse } from 'msw'

export const handlers = [
  http.post('http://localhost:8000/api/v1/assemblies', async ({ request }) => {
    const idem = (request.headers as any).get?.('Idempotency-Key')
    if (!idem) return HttpResponse.json({ detail: 'Idempotency-Key yok' }, { status: 422 })
    return HttpResponse.json({ job_id: 1 }, { status: 200 })
  }),
  http.get('http://localhost:8000/api/v1/jobs', () =>
    HttpResponse.json({
      items: [
        {
          id: 1,
          type: 'assembly',
          queue: 'freecad',
          status: 'success',
          created_at: new Date().toISOString(),
          metrics: { elapsed_ms: 1234 },
          artefacts: [{ type: 'fcstd', signed_url: 'https://e.cz/fcstd' }],
        },
      ],
      total: 1,
    }),
  ),
  http.get('http://localhost:8000/api/v1/jobs/:id', ({ params, request }) => {
    const id = Number((params as any).id)
    // id tek ise sim-mesh içersin, çift ise içermesin gibi basit varyant
    const artefacts = id % 2 === 1
      ? [
          { type: 'fcstd', signed_url: 'https://e.cz/fcstd' },
          { type: 'gcode', signed_url: 'https://e.cz/gcode' },
          { type: 'sim-mesh', signed_url: 'https://e.cz/mesh.gltf' },
        ]
      : [
          { type: 'fcstd', signed_url: 'https://e.cz/fcstd' },
        ]
    return HttpResponse.json({
      id,
      type: 'assembly',
      queue: 'freecad',
      status: 'success',
      created_at: new Date().toISOString(),
      metrics: { elapsed_ms: 1234 },
      artefacts,
    })
  }),
  http.post('http://localhost:8000/api/v1/cam/gcode', async () => HttpResponse.json({ job_id: 2 })),
  http.post('http://localhost:8000/api/v1/simulate', async () => HttpResponse.json({ job_id: 3 })),
]


