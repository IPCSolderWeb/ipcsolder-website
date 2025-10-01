import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Hook personalizado para hacer scroll al top cuando cambia la ruta
 * @param {boolean} smooth - Si usar scroll suave o instantáneo
 */
export const useScrollToTop = (smooth = false) => {
  const location = useLocation()

  useEffect(() => {
    if (smooth) {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      })
    } else {
      window.scrollTo(0, 0)
    }
  }, [location.pathname, smooth])
}

export default useScrollToTop