import axios from 'axios'
import { performance } from 'node:perf_hooks'
import { writeFileSync } from 'node:fs'

const BASE_URL = process.env.LOAD_BASE_URL ?? 'http://localhost:3000/api'
const EMAIL = process.env.LOAD_EMAIL ?? 'demo@demo.com'
const CLAVE = process.env.LOAD_CLAVE ?? 'Demo1234!'
const REQUESTS = Number(process.env.LOAD_REQUESTS ?? 50)
const ENDPOINT = process.env.LOAD_ENDPOINT ?? '/conferencistas'

function percentile(values, p) {
  if (values.length === 0) return 0
  const sorted = [...values].sort((a, b) => a - b)
  const index = Math.ceil((p / 100) * sorted.length) - 1
  return sorted[Math.max(0, index)]
}

async function main() {
  const startedAtDate = new Date()
  console.log('=== Prueba rápida de carga (frontend -> backend) ===')
  console.log(`Base URL: ${BASE_URL}`)
  console.log(`Endpoint: ${ENDPOINT}`)
  console.log(`Solicitudes: ${REQUESTS}`)

  const authClient = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' },
    timeout: 15000,
  })

  const loginResponse = await authClient.post('/auth/login', {
    email: EMAIL,
    clave: CLAVE,
  })

  const token = loginResponse.data?.data?.token
  if (!token) {
    throw new Error('No se obtuvo token en login. Revisa credenciales o respuesta del backend.')
  }

  const apiClient = axios.create({
    baseURL: BASE_URL,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    timeout: 15000,
  })

  const startedAt = performance.now()

  const tasks = Array.from({ length: REQUESTS }, async (_, index) => {
    const start = performance.now()
    try {
      const response = await apiClient.get(ENDPOINT)
      const duration = performance.now() - start
      return { ok: true, status: response.status, duration, index }
    } catch (error) {
      const duration = performance.now() - start
      const status = error?.response?.status ?? 'ERR'
      return { ok: false, status, duration, index }
    }
  })

  const results = await Promise.all(tasks)
  const finishedAt = performance.now()

  const okResults = results.filter((r) => r.ok)
  const failedResults = results.filter((r) => !r.ok)
  const durations = okResults.map((r) => r.duration)

  const totalMs = finishedAt - startedAt
  const rps = REQUESTS / (totalMs / 1000)

  console.log('\n--- Resultado ---')
  console.log(`✅ Exitosas: ${okResults.length}`)
  console.log(`❌ Fallidas: ${failedResults.length}`)
  console.log(`⏱️  Tiempo total: ${totalMs.toFixed(2)} ms`)
  console.log(`🚀 Req/s aprox: ${rps.toFixed(2)}`)

  if (durations.length > 0) {
    const min = Math.min(...durations)
    const max = Math.max(...durations)
    const avg = durations.reduce((a, b) => a + b, 0) / durations.length

    console.log(`📉 Min: ${min.toFixed(2)} ms`)
    console.log(`📊 Avg: ${avg.toFixed(2)} ms`)
    console.log(`📈 Max: ${max.toFixed(2)} ms`)
    console.log(`📌 p95: ${percentile(durations, 95).toFixed(2)} ms`)
  }

  const min = durations.length > 0 ? Math.min(...durations) : 0
  const max = durations.length > 0 ? Math.max(...durations) : 0
  const avg = durations.length > 0 ? durations.reduce((a, b) => a + b, 0) / durations.length : 0
  const p95 = durations.length > 0 ? percentile(durations, 95) : 0

  if (failedResults.length > 0) {
    const statusSummary = failedResults.reduce((acc, item) => {
      const key = String(item.status)
      acc[key] = (acc[key] ?? 0) + 1
      return acc
    }, {})

    console.log('\nDetalle de fallos por status:', statusSummary)
  }

  const report = `# Informe de Performance\n\n` +
    `- Fecha: ${startedAtDate.toISOString()}\n` +
    `- Base URL: ${BASE_URL}\n` +
    `- Endpoint: ${ENDPOINT}\n` +
    `- Solicitudes: ${REQUESTS}\n\n` +
    `## Resultado\n\n` +
    `- Exitosas: ${okResults.length}\n` +
    `- Fallidas: ${failedResults.length}\n` +
    `- Tiempo total (ms): ${totalMs.toFixed(2)}\n` +
    `- Req/s aprox: ${rps.toFixed(2)}\n` +
    `- Min (ms): ${min.toFixed(2)}\n` +
    `- Avg (ms): ${avg.toFixed(2)}\n` +
    `- Max (ms): ${max.toFixed(2)}\n` +
    `- p95 (ms): ${p95.toFixed(2)}\n` +
    `${failedResults.length > 0 ? `\n## Fallos\n\n${JSON.stringify(failedResults, null, 2)}\n` : ''}`

  writeFileSync('PERF.md', report, 'utf8')
  console.log('📝 Informe generado en PERF.md')

  if (okResults.length === 0) {
    process.exitCode = 1
  }
}

main().catch((error) => {
  console.error('\nError en prueba de carga:', error.message)
  process.exitCode = 1
})
