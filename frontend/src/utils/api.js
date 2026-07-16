const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

let clientAccessToken = '';

export const setAccessToken = (token) => {
  clientAccessToken = token;
};

export const getAccessToken = () => {
  return clientAccessToken;
};

/**
 * Custom fetch wrapper with automatic JWT token refresh retry interceptor
 */
export async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  if (clientAccessToken) {
    headers['Authorization'] = `Bearer ${clientAccessToken}`;
  }
  
  const fetchOptions = {
    ...options,
    headers,
    credentials: 'include', // Ensures HTTP-Only cookies are transmitted
  };
  
  try {
    let response = await fetch(url, fetchOptions);
    
    // Intercept 401 Unauthorized errors to automatically refresh access token
    if (
      response.status === 401 && 
      !options._retry && 
      endpoint !== '/auth/login' && 
      endpoint !== '/auth/register' &&
      endpoint !== '/auth/refresh' &&
      endpoint !== '/auth/me'
    ) {
      options._retry = true;
      
      console.log('[API Client]: Access token expired. Attempting refresh...');
      
      try {
        const refreshResponse = await fetch(`${API_BASE_URL}/auth/refresh`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
        });
        
        if (refreshResponse.ok) {
          const refreshData = await refreshResponse.json();
          const newAccessToken = refreshData.data.accessToken;
          
          // Store new token in memory
          setAccessToken(newAccessToken);
          
          // Re-update headers and retry original request
          headers['Authorization'] = `Bearer ${newAccessToken}`;
          const retryResponse = await fetch(url, { ...fetchOptions, headers });
          return retryResponse;
        } else {
          // Refresh token is invalid/expired -> force logout
          setAccessToken('');
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new Event('auth-logout'));
          }
        }
      } catch (refreshErr) {
        console.error('[API Client]: Refresh token request failed', refreshErr);
      }
    }
    
    return response;
  } catch (error) {
    console.error('[API Client]: Network connection error', error);
    throw error;
  }
}
