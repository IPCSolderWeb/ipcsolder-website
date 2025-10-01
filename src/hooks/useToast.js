import { useState, useCallback } from 'react'

export const useToast = () => {
  const [toasts, setToasts] = useState([])

  const showToast = useCallback((message, type = 'success', title = null, duration = 4000) => {
    const id = Date.now() + Math.random()
    const newToast = {
      id,
      message,
      type,
      title,
      duration,
      isVisible: true
    }

    setToasts(prev => [...prev, newToast])

    // Auto remove after duration
    setTimeout(() => {
      removeToast(id)
    }, duration)

    return id
  }, [])

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }, [])

  const showSuccess = useCallback((message, title = null) => {
    return showToast(message, 'success', title)
  }, [showToast])

  const showError = useCallback((message, title = null) => {
    return showToast(message, 'error', title)
  }, [showToast])

  const showWarning = useCallback((message, title = null) => {
    return showToast(message, 'warning', title)
  }, [showToast])

  const showInfo = useCallback((message, title = null) => {
    return showToast(message, 'info', title)
  }, [showToast])

  return {
    toasts,
    showToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    removeToast
  }
}

export default useToast