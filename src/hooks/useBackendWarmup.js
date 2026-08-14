import { useEffect } from 'react'
import apiBaseUrl from '../config/apiConfig'

function useBackendWarmup() {
  useEffect(() => {
    const controller = new AbortController()
    fetch(`${apiBaseUrl}/api/health`, { signal: controller.signal }).catch(() => {})
    return () => controller.abort()
  }, [])
}

export default useBackendWarmup