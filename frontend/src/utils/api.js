import axios from 'axios'
import { sentinel } from './sentinelClient'

// Base API client
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000',
  headers: {
    'Content-Type': 'application/json',
  },
})

// ── Sentinel telemetry interceptor ───────────────────────────────────────────
// Automatically injects behavioral telemetry into all write requests
apiClient.interceptors.request.use((config) => {
  const isWrite = ['post', 'patch', 'put', 'delete'].includes(config.method?.toLowerCase())

  if (isWrite) {
    const telemetry = sentinel.getTelemetry()
    config.data = {
      ...config.data,
      sentinelTelemetry: {
        device: telemetry.device,
        behavioral: {
          typing_speed:   parseFloat(telemetry.behavioral?.typing_speed)  || 0,
          mouse_velocity: parseFloat(telemetry.behavioral?.mouse_velocity) || 0,
          time_on_page:   parseInt(telemetry.behavioral?.time_on_page)     || 0,
        }
      }
    }
  }
  return config
})

export default apiClient
