const BASE = "/api";

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Something went wrong.");
  return data;
}

export const api = {
  // Volunteers
  submitVolunteerForm: (body) => request("/volunteers", { method: "POST", body: JSON.stringify(body) }),
  listVolunteers: (status) => request(`/volunteers${status ? `?status=${status}` : ""}`),
  updateVolunteer: (id, patch) => request(`/volunteers/${id}`, { method: "PATCH", body: JSON.stringify(patch) }),

  // Onboarding
  getOnboarding: (volunteerId) => request(`/onboarding/${volunteerId}`),
  completeChecklist: (volunteerId) => request(`/onboarding/${volunteerId}/checklist`, { method: "PATCH" }),

  // Mock session
  startMockSession: (body) => request("/mock-session/start", { method: "POST", body: JSON.stringify(body) }),
  sendMockMessage: (body) => request("/mock-session/message", { method: "POST", body: JSON.stringify(body) }),
  completeMockSession: (volunteerId, transcript) => request(`/mock-session/${volunteerId}/complete`, { method: "POST", body: JSON.stringify({ transcript }) }),

  // Community
  listPosts: () => request("/community/posts"),
  createPost: (body) => request("/community/posts", { method: "POST", body: JSON.stringify(body) }),
  reply: (postId, body) => request(`/community/posts/${postId}/replies`, { method: "POST", body: JSON.stringify(body) }),
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

  // Meeting requests
  submitMeetingRequest: (body) => request("/meeting-requests", { method: "POST", body: JSON.stringify(body) }),
  listMeetingRequests: (status) => request(`/meeting-requests${status ? `?status=${status}` : ""}`),
  getMatches: (id) => request(`/meeting-requests/${id}/matches`),
  confirmMatch: (id, volunteer_id) => request(`/meeting-requests/${id}/match`, { method: "POST", body: JSON.stringify({ volunteer_id }) }),
  updateMeetingRequest: (id, patch) => request(`/meeting-requests/${id}`, { method: "PATCH", body: JSON.stringify(patch) }),

  // Admin
  login: (email, password) => request("/admin/login", { method: "POST", body: JSON.stringify({ email, password }) }),
  overview: () => request("/admin/overview"),
};
