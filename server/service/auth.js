const sessionIdToUserIdMap = new Map();

const setUserIdForSession = (sessionId, userId) => {
  sessionIdToUserIdMap.set(sessionId, userId);
};

const getUserIdForSession = (sessionId) => {
  return sessionIdToUserIdMap.get(sessionId);
};

module.exports = {
  setUserIdForSession,
  getUserIdForSession,
};