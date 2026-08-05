import apiBaseUrl from './apiConfig'

const getToken = () => {
  const storedUser = localStorage.getItem('user')
  if (!storedUser) {
    return null
  }
  return JSON.parse(storedUser).token
}

const clearSessionAndRedirect = () => {
  localStorage.removeItem('user')
  window.location.href = '/'
}

const apiClient = async (path, options = {}) => {
  const token = getToken()
  const headers = { ...options.headers }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(`${apiBaseUrl}${path}`, { ...options, headers })

  if (response.status === 401 || response.status === 403) {
    clearSessionAndRedirect()
    throw new Error('Session expired')
  }

  return response
}

export default apiClient