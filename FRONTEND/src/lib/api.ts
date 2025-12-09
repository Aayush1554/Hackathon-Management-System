import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only redirect on 401 if user was logged in (has token) and it's not a login request
    const isLoginRequest = error.config?.url?.includes('/auth/login');
    const hasToken = sessionStorage.getItem('token');
    
    if (error.response?.status === 401 && hasToken && !isLoginRequest) {
      // Token expired or invalid - only for authenticated requests
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
      
      // Redirect to appropriate login page based on stored user type
      const storedUser = sessionStorage.getItem('user');
      let redirectPath = '/login/admin';
      
      if (storedUser) {
        try {
          const user = JSON.parse(storedUser);
          redirectPath = user.user_type === 'mentor' 
            ? '/login/mentor' 
            : user.user_type === 'team_member'
            ? '/login/team'
            : '/login/admin';
        } catch (e) {
          // If parsing fails, use default
        }
      }
      
      window.location.href = redirectPath;
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (email: string, password: string, user_type: string) =>
    api.post('/auth/login', { email, password, user_type }),
  
  register: (data: any) =>
    api.post('/auth/register', data),
  
  getProfile: () =>
    api.get('/auth/profile'),
  
  verifyAccountStatus: () =>
    api.get('/auth/verify-status'),
  
  updateProfile: (data: any) =>
    api.put('/auth/profile', data),
  
  changePassword: (data: { current_password: string; new_password: string }) =>
    api.put('/auth/change-password', data),
  
  deleteAccount: (data: { password: string }) =>
    api.delete('/auth/account', { data }),
};

// Hackathon API
export const hackathonAPI = {
  getAll: (params?: any) =>
    api.get('/hackathons', { params }),
  
  getById: (id: number) =>
    api.get(`/hackathons/${id}`),
  
  create: (data: any) =>
    api.post('/hackathons', data),
  
  update: (id: number, data: any) =>
    api.put(`/hackathons/${id}`, data),
  
  delete: (id: number) =>
    api.delete(`/hackathons/${id}`),
  
  getLeaderboard: (id: number) =>
    api.get(`/hackathons/${id}/leaderboard`),
  
  updateTeamScore: (teamId: number, score: number) =>
    api.put(`/hackathons/teams/${teamId}/score`, { score }),
  
  finalizeLeaderboard: (id: number) =>
    api.post(`/hackathons/${id}/finalize-leaderboard`),
};

// Team API
export const teamAPI = {
  getAll: () =>
    api.get('/teams/all'),
    
  create: (data: any) =>
    api.post('/teams', data),
  
  getMyTeams: () =>
    api.get('/teams/my-teams'),
  
  getByHackathon: (hackathonId: number) =>
    api.get(`/teams/hackathon/${hackathonId}`),
  
  getById: (teamId: number) =>
    api.get(`/teams/${teamId}`),
  
  update: (teamId: number, data: any) =>
    api.put(`/teams/${teamId}`, data),
  
  delete: (teamId: number) =>
    api.delete(`/teams/${teamId}`),
  
  getTeamDetails: (teamId: number) =>
    api.get(`/teams/${teamId}/details`),
  
  submitProject: (data: FormData) =>
    api.post('/teams/submit-project', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
  
  // Mentor-related team endpoints
  getMentor: (teamId: number) =>
    api.get(`/teams/${teamId}/mentor`),
  
  getMeetings: (teamId: number) =>
    api.get(`/teams/${teamId}/meetings`),
  
  sendCommunicationToMentor: (teamId: number, data: FormData) =>
    api.post(`/teams/${teamId}/communications/send`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
  
  getCommunicationsWithMentor: (teamId: number, mentorId: number) =>
    api.get(`/teams/${teamId}/communications/${mentorId}`),
  
  addReaction: (communicationId: number, emoji: string) =>
    api.post(`/teams/communications/${communicationId}/react`, { emoji }),
  
  editMessage: (communicationId: number, message_text: string) =>
    api.put(`/teams/communications/${communicationId}/edit`, { message_text }),
  
  markMessagesAsRead: (teamId: number, mentorId: number) =>
    api.post(`/teams/${teamId}/communications/${mentorId}/mark-read`),
  
  deleteMessageForMe: (communicationId: number) =>
    api.delete(`/teams/communications/${communicationId}/delete-for-me`),
  
  deleteMessageForEveryone: (communicationId: number) =>
    api.delete(`/teams/communications/${communicationId}/delete-for-everyone`),
};

// Mentor API
export const mentorAPI = {
  // Admin endpoints
  getAll: () =>
    api.get('/mentors'),
  
  getById: (id: number) =>
    api.get(`/mentors/${id}`),
  
  create: (data: any) =>
    api.post('/mentors', data),
  
  update: (id: number, data: any) =>
    api.put(`/mentors/${id}`, data),
  
  delete: (id: number) =>
    api.delete(`/mentors/${id}`),
  
  assignToTeam: (data: { mentorId: number; teamId: number }) =>
    api.post('/mentors/assign', data),
  
  removeFromTeam: (data: { mentorId: number; teamId: number }) =>
    api.post('/mentors/remove', data),
  
  // Mentor endpoints
  getMyTeams: () =>
    api.get('/mentors/my/teams'),
  
  getMyHackathons: () =>
    api.get('/mentors/my/hackathons'),
  
  scheduleMeeting: (data: any) =>
    api.post('/mentors/meetings/schedule', data),
  
  sendCommunication: (data: FormData) =>
    api.post('/mentors/communications/send', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
  
  getCommunications: (teamId: number) =>
    api.get(`/mentors/communications/${teamId}`),
  
  addReaction: (communicationId: number, emoji: string) =>
    api.post(`/mentors/communications/${communicationId}/react`, { emoji }),
  
  editMessage: (communicationId: number, message_text: string) =>
    api.put(`/mentors/communications/${communicationId}/edit`, { message_text }),
  
  markMessagesAsRead: (teamId: number, mentorId: number) =>
    api.post(`/mentors/communications/${teamId}/${mentorId}/mark-read`),
  
  deleteMessageForMe: (communicationId: number) =>
    api.delete(`/mentors/communications/${communicationId}/delete-for-me`),
  
  deleteMessageForEveryone: (communicationId: number) =>
    api.delete(`/mentors/communications/${communicationId}/delete-for-everyone`),
};

export default api;

