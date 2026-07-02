const BASE = "/api";

async function request(path, options = {}) {
  const { headers: extra, ...rest } = options;
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...extra },
    ...rest,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Something went wrong.");
  return data;
}

function authHeader(token) {
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const api = {
  // Volunteers
  submitVolunteerForm: (body) => request("/volunteers", { method: "POST", body: JSON.stringify(body) }),
  listVolunteers: (status) => request(`/volunteers${status ? `?status=${status}` : ""}`),
  updateVolunteer: (id, patch) => request(`/volunteers/${id}`, { method: "PATCH", body: JSON.stringify(patch) }),
  approveVolunteer: (id) => request(`/volunteers/${id}/approve`, { method: "POST" }),
  deleteVolunteer: (id) => request(`/volunteers/${id}`, { method: "DELETE" }),
  scheduleInterview: (id, body) => request(`/volunteers/${id}/schedule-interview`, { method: "POST", body: JSON.stringify(body) }),
  getVolunteerMeetings: (volunteerId) => request(`/meeting-requests/volunteer/${volunteerId}`),

  // Onboarding
  getOnboarding: (volunteerId) => request(`/onboarding/${volunteerId}`),
  completeChecklist: (volunteerId) => request(`/onboarding/${volunteerId}/checklist`, { method: "PATCH" }),

  // Mock session
  startMockSession: (body) => request("/mock-session/start", { method: "POST", body: JSON.stringify(body) }),
  sendMockMessage: (body) => request("/mock-session/message", { method: "POST", body: JSON.stringify(body) }),
  completeMockSession: (volunteerId, transcript) => request(`/mock-session/${volunteerId}/complete`, { method: "POST", body: JSON.stringify({ transcript }) }),

  // Volunteer auth
  volunteerRegister: (body) => request("/volunteer-auth/register", { method: "POST", body: JSON.stringify(body) }),
  volunteerLogin: (body) => request("/volunteer-auth/login", { method: "POST", body: JSON.stringify(body) }),
  volunteerMe: (token) => request("/volunteer-auth/me", { headers: authHeader(token) }),

  // Community
  listPosts: () => request("/community/posts"),
  listAllPosts: () => request("/community/posts/all"), // admin only — includes hidden posts
  createPost: (body, token) => request("/community/posts", { method: "POST", body: JSON.stringify(body), headers: authHeader(token) }),
  reply: (postId, body, token) => request(`/community/posts/${postId}/replies`, { method: "POST", body: JSON.stringify(body), headers: authHeader(token) }),
  flagPost: (postId, body = {}) => request(`/community/posts/${postId}/flag`, { method: "POST", body: JSON.stringify(body) }),
  moderatePost: (postId, patch) => request(`/community/posts/${postId}/moderate`, { method: "PATCH", body: JSON.stringify(patch) }),
  deletePost: (postId) => request(`/community/posts/${postId}`, { method: "DELETE" }),

  // Videos
  listVideos: (tag) => request(`/videos${tag ? `?tag=${tag}` : ""}`),
  addVideo: (body) => request("/videos", { method: "POST", body: JSON.stringify(body) }),
  updateVideo: (id, patch) => request(`/videos/${id}`, { method: "PATCH", body: JSON.stringify(patch) }),
  deleteVideo: (id) => request(`/videos/${id}`, { method: "DELETE" }),

  // Workshops
  listWorkshops: () => request("/workshops"),
  addWorkshop: (body) => request("/workshops", { method: "POST", body: JSON.stringify(body) }),
  updateWorkshop: (id, patch) => request(`/workshops/${id}`, { method: "PATCH", body: JSON.stringify(patch) }),
  deleteWorkshop: (id) => request(`/workshops/${id}`, { method: "DELETE" }),
  rsvpWorkshop: (id, body) => request(`/workshops/${id}/rsvp`, { method: "POST", body: JSON.stringify(body) }),
  getWorkshopRsvps: (id) => request(`/workshops/${id}/rsvps`),

  // Meeting requests
  submitMeetingRequest: (body) => request("/meeting-requests", { method: "POST", body: JSON.stringify(body) }),
  listMeetingRequests: (status) => request(`/meeting-requests${status ? `?status=${status}` : ""}`),
  getMatches: (id) => request(`/meeting-requests/${id}/matches`),
  confirmMatch: (id, volunteer_id) => request(`/meeting-requests/${id}/match`, { method: "POST", body: JSON.stringify({ volunteer_id }) }),
  updateMeetingRequest: (id, patch) => request(`/meeting-requests/${id}`, { method: "PATCH", body: JSON.stringify(patch) }),
  getChatLink: (id) => request(`/meeting-requests/${id}/chat`),

  // Chats — seeker (token in URL, no login)
  getSeekerChat: (token) => request(`/chats/seeker/${token}`),
  sendSeekerMessage: (token, content) => request(`/chats/seeker/${token}/messages`, { method: "POST", body: JSON.stringify({ content }) }),

  // Chats — volunteer (requires session token)
  getVolunteerChats: (volToken) => request("/chats/by-volunteer", { headers: authHeader(volToken) }),
  getVolunteerChatMessages: (chatId, volToken) => request(`/chats/volunteer/${chatId}`, { headers: authHeader(volToken) }),
  sendVolunteerMessage: (chatId, body, volToken) => request(`/chats/volunteer/${chatId}/messages`, { method: "POST", body: JSON.stringify(body), headers: authHeader(volToken) }),

  // Volunteer ↔ admin chat
  getMyAdminChat: (volToken) => request("/admin-chats/my", { headers: authHeader(volToken) }),
  sendAdminChatMessage: (content, volToken) => request("/admin-chats/my/messages", { method: "POST", body: JSON.stringify({ content }), headers: authHeader(volToken) }),
  listAdminChats: () => request("/admin-chats"),
  getAdminChat: (chatId) => request(`/admin-chats/${chatId}`),
  replyAdminChat: (chatId, content) => request(`/admin-chats/${chatId}/reply`, { method: "POST", body: JSON.stringify({ content }) }),

  // Admin
  login: (email, password) => request("/admin/login", { method: "POST", body: JSON.stringify({ email, password }) }),
  overview: () => request("/admin/overview"),

  // Site settings
  getSettings: () => request("/settings"),
  updateSettings: (patch) => request("/settings", { method: "PATCH", body: JSON.stringify(patch) }),
};
