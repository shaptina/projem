'use client'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'
import { idem } from '@/lib/idempotency'

const AssemblySchema = z.object({
  type: z.literal('planetary_gearbox'),
  spec: z.object({
    stages: z.array(z.object({ ratio: z.number().positive() })).min(1),
    overall_ratio: z.number().positive(),
    power_kW: z.number().positive(),
    materials: z.object({
      gear: z.enum(['steel', 'aluminum']),
      housing: z.enum(['aluminum', 'steel']),
    }),
    outputs: z.object({
      torqueNm: z.number().min(0),
      radialN: z.number().min(0),
      axialN: z.number().min(0),
    }),
  }),
})

type AssemblyInput = z.infer<typeof AssemblySchema>

export function AssemblyForm() {
  const router = useRouter()
  const { register, handleSubmit, formState, setValue, watch } = useForm<AssemblyInput>({
    resolver: zodResolver(AssemblySchema),
    defaultValues: {
      type: 'planetary_gearbox',
      spec: { stages: [{ ratio: 3.0 }], overall_ratio: 3.0, power_kW: 1, materials: { gear: 'steel', housing: 'aluminum' }, outputs: { torqueNm: 10, radialN: 10, axialN: 5 } },
    },
  })
  const onSubmit = async (data: AssemblyInput) => {
    const fast = (document.getElementById('fast') as HTMLInputElement | null)?.checked
    try {
      const res = await api.post<{ job_id: number }>(`/api/v1/assemblies`, data, {
        'Idempotency-Key': idem(),
        ...(fast ? { 'X-Fast-Mode': '1' } : {}),
      })
      alert('Montaj işi oluşturuldu.')
      router.push(`/jobs/${res.job_id}`)
    } catch (e: any) {
      alert(e.message || 'Hata')
    }
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <div>
        <label className="block text-sm">Kademe Oranları</label>
        <input type="number" step="0.01" {...register('spec.stages.0.ratio', { valueAsNumber: true })} className="border p-2" />
      </div>
      <div className="grid grid-cols-3 gap-2">
        <div>
          <label className="block text-sm">Toplam Oran</label>
          <input type="number" step="0.01" {...register('spec.overall_ratio', { valueAsNumber: true })} className="border p-2 w-full" />
        </div>
        <div>
          <label className="block text-sm">Güç (kW)</label>
          <input type="number" step="0.1" {...register('spec.power_kW', { valueAsNumber: true })} className="border p-2 w-full" />
        </div>
        <div>
          <label className="block text-sm">Dişli</label>
          <select {...register('spec.materials.gear')} className="border p-2 w-full">
            <option value="steel">steel</option>
            <option value="aluminum">aluminum</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <div>
          <label className="block text-sm">Gövde</label>
          <select {...register('spec.materials.housing')} className="border p-2 w-full">
            <option value="aluminum">aluminum</option>
            <option value="steel">steel</option>
          </select>
        </div>
        <div>
          <label className="block text-sm">Tork (Nm)</label>
          <input type="number" step="1" {...register('spec.outputs.torqueNm', { valueAsNumber: true })} className="border p-2 w-full" />
        </div>
        <div>
          <label className="block text-sm">Radyal (N)</label>
          <input type="number" step="1" {...register('spec.outputs.radialN', { valueAsNumber: true })} className="border p-2 w-full" />
        </div>
      </div>
      <div>
        <label className="block text-sm">Eksenel (N)</label>
        <input type="number" step="1" {...register('spec.outputs.axialN', { valueAsNumber: true })} className="border p-2" />
      </div>
      <div className="flex items-center gap-2">
        <input id="fast" type="checkbox" />
        <label htmlFor="fast">Hızlı Mod</label>
      </div>
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Gönder</button>
      {formState.errors && <pre className="text-red-600 text-sm">{JSON.stringify(formState.errors, null, 2)}</pre>}
    </form>
  )
}


