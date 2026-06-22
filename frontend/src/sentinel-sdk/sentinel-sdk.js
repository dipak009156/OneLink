/**
 * Sentinel Security SDK
 * Client-side telemetry tracking for behavioral analysis.
 */
class SentinelSDK {
  constructor(config = {}) {
    this.endpoint  = config.endpoint || 'https://api.sentinellayer.in/evaluate'
    this.apiKey    = config.apiKey   || null
    this.userId    = config.userId   || 'anonymous'
    this.sessionId = config.sessionId || this._generateSessionId()

    this.keystrokes      = 0
    this.typingStartTime = null
    this.mouseDistance   = 0
    this.lastMousePos    = null
    this.pageLoadTime    = Date.now()

    this.deviceFingerprint = this._generateCanvasFingerprint()
    this.browser           = this._parseBrowser()
    this.os                = this._parseOS()

    this._initListeners()
  }

  setUserId(userId)     { this.userId    = userId    }
  setSessionId(session) { this.sessionId = session   }

  getTelemetry() {
    const timeOnPage = Math.round((Date.now() - this.pageLoadTime) / 1000)
    let avgTypingSpeed = 0
    if (this.keystrokes > 1 && this.typingStartTime) {
      const mins = (Date.now() - this.typingStartTime) / 60000
      if (mins > 0) avgTypingSpeed = Math.round(this.keystrokes / mins)
    }
    let avgMouseVelocity = 0
    if (timeOnPage > 0) {
      avgMouseVelocity = Math.round(this.mouseDistance / timeOnPage)
    }

    return {
      user_id:    this.userId,
      session_id: this.sessionId,
      action:     { type: 'page_view' },
      network:    { user_agent: navigator.userAgent },
      device: {
        fingerprint:       this.deviceFingerprint,
        browser:           this.browser,
        os:                this.os,
        screen_resolution: `${window.screen.width}x${window.screen.height}`,
        language:          navigator.language,
        timezone:          Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      behavioral: {
        typing_speed:   avgTypingSpeed,
        mouse_velocity: avgMouseVelocity,
        time_on_page:   timeOnPage,
      }
    }
  }

  _generateSessionId() {
    return 'sess_' + Math.random().toString(36).substring(2, 15) +
                     Math.random().toString(36).substring(2, 15)
  }

  _generateCanvasFingerprint() {
    if (typeof document === 'undefined') return 'fp_node_env'
    try {
      const canvas = document.createElement('canvas')
      const ctx    = canvas.getContext('2d')
      if (!ctx) return 'fp_no_ctx'
      ctx.textBaseline = 'top'
      ctx.font         = '14px Arial'
      ctx.fillStyle    = '#f60'
      ctx.fillRect(125, 1, 62, 20)
      ctx.fillStyle    = '#069'
      ctx.fillText('SentinelSecureDeviceToken', 2, 15)
      ctx.fillStyle    = 'rgba(102, 204, 0, 0.7)'   // second layer — richer hash
      ctx.fillText('SentinelSecureDeviceToken', 4, 17)
      const dataUrl = canvas.toDataURL()
      let hash = 0
      for (let i = 0; i < dataUrl.length; i++) {
        hash = (hash << 5) - hash + dataUrl.charCodeAt(i)
        hash |= 0
      }
      return 'fp_' + Math.abs(hash).toString(16)
    } catch {
      return 'fp_fallback'
    }
  }


  _parseBrowser() {
    const ua = navigator.userAgent
    if (ua.includes('Firefox')) return 'Firefox'
    if (ua.includes('Edg/') || ua.includes('Edge/')) return 'Edge'
    if (ua.includes('Chrome')) return 'Chrome'
    if (ua.includes('Safari')) return 'Safari'
    return 'Other'
  }

  _parseOS() {
    const p = navigator.platform || ''
    if (p.includes('Win')) return 'Windows'
    if (p.includes('Mac')) return 'MacOS'
    if (p.includes('Linux')) return 'Linux'
    if (p.includes('iPhone') || p.includes('iPad')) return 'iOS'
    if (p.includes('Android')) return 'Android'
    return 'Other'
  }

  _initListeners() {
    document.addEventListener('mousemove', (e) => {
      const cur = { x: e.clientX, y: e.clientY }
      if (this.lastMousePos) {
        const dx = cur.x - this.lastMousePos.x
        const dy = cur.y - this.lastMousePos.y
        this.mouseDistance += Math.sqrt(dx * dx + dy * dy)
      }
      this.lastMousePos = cur
    })
    document.addEventListener('keydown', () => {
      if (!this.typingStartTime) this.typingStartTime = Date.now()
      this.keystrokes += 1
    })
  }
}

export default SentinelSDK
