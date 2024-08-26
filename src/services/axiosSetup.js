import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://192.168.86.53:5000/api/customers', // Remplacez par votre URL de base
  timeout: 10000, // Temps d'attente maximal de 10 secondes
  headers: {
    'Content-Type': 'application/json',
    // Vous pouvez ajouter d'autres en-têtes par défaut ici si nécessaire
  }
});

// Intercepteur pour ajouter le token d'authentification si nécessaire
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Supposons que le token est stocké dans localStorage
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs de réponse
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Rediriger vers la page de connexion si non autorisé
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;