/**
 * securePost.js — Sentinel-protected POST/PUT wrapper.
 *
 * Drop-in replacement for api.post() / api.put() on sensitive routes.
 * Automatically attaches behavioral telemetry + session ID header so
 * sentinelGuard.js on the backend can evaluate every request.
 *
 * Usage:
 *   import { securePost, securePut } from '../../utils/securePost';
 *   const result = await securePost('/api/users/profile', { bio, location });
 *
 * Verdict handling:
 *   result.sentinelVerdict === 'STEP_UP_AUTH'     → show step-up modal
 *   result.sentinelVerdict === 'BLOCK'             → show blocked error
 *   result.sentinelVerdict === 'TERMINATE_SESSION' → logout user
 *   (no sentinelVerdict field)                     → normal success
 */
import api from './api';
import { sentinel } from './sentinelClient';

function buildSecureRequest(body = {}) {
  const telemetry = sentinel.getTelemetry();

  const secureBody = {
    ...body,
    sentinelTelemetry: {
      device: telemetry.device,
      behavioral: {
        typing_speed:   parseFloat(telemetry.behavioral?.typing_speed)  || 0,
        mouse_velocity: parseFloat(telemetry.behavioral?.mouse_velocity) || 0,
        time_on_page:   parseInt(telemetry.behavioral?.time_on_page)    || 0,
      },
    },
  };

  const config = {
    headers: { 'x-session-id': sentinel.sessionId },
  };

  return { secureBody, config };
}

/**
 * Sentinel-protected POST
 * @param {string} endpoint  — e.g. '/api/users/profile'
 * @param {object} body      — original request payload
 * @param {object} extraConfig — additional axios config (e.g. for file uploads)
 */
export async function securePost(endpoint, body = {}, extraConfig = {}) {
  const { secureBody, config } = buildSecureRequest(body);
  const mergedConfig = {
    ...extraConfig,
    headers: { ...config.headers, ...(extraConfig.headers || {}) },
  };
  const response = await api.post(endpoint, secureBody, mergedConfig);
  return response.data;
}

/**
 * Sentinel-protected PUT
 * @param {string} endpoint  — e.g. '/api/projects/:id'
 * @param {object} body      — original request payload
 * @param {object} extraConfig — additional axios config
 */
export async function securePut(endpoint, body = {}, extraConfig = {}) {
  const { secureBody, config } = buildSecureRequest(body);
  const mergedConfig = {
    ...extraConfig,
    headers: { ...config.headers, ...(extraConfig.headers || {}) },
  };
  const response = await api.put(endpoint, secureBody, mergedConfig);
  return response.data;
}
