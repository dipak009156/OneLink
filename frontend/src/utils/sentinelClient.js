import SentinelSDK from '../sentinel-sdk/sentinel-sdk.js'

export const sentinel = new SentinelSDK({
  endpoint: import.meta.env.VITE_SENTINEL_API_URL + '/evaluate',
  apiKey:   import.meta.env.VITE_SENTINEL_API_KEY,
})

export function initializeSentinelSession(userId, sessionId) {
  if (userId)    sentinel.setUserId(String(userId))
  if (sessionId) sentinel.setSessionId(String(sessionId))
}

if (typeof window !== 'undefined') {
  window.sentinel = sentinel
}
