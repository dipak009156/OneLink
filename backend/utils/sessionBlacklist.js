const blacklist = new Set()

module.exports = {
  add: (sessionId) => blacklist.add(sessionId),
  has: (sessionId) => blacklist.has(sessionId),
  remove: (sessionId) => blacklist.delete(sessionId),
}
