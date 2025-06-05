// src/services/api.js
import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:5000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const spotifyService = {
  getLoginUrl: async () => {
    const response = await api.get('/login');
    return response.data;
  },
  
  exchangeToken: async (code) => {
    const response = await api.get(`/callback?code=${code}`);
    return response.data;
  },
  
  fetchUserTracks: async (token) => {
    const response = await api.get(`/fetch-user-tracks?token=${token}`);
    return response.data;
  },
  
  performClustering: async (tracks, n_clusters, features) => {
    const response = await api.post('/cluster', {
      tracks,
      n_clusters,
      features
    });
    return response.data;
  },
  
  getRecommendations: async (seedTracks, token, limit = 10) => {
    const response = await api.post('/recommendations', {
      seed_tracks: seedTracks,
      token,
      limit
    });
    return response.data;
  }
};