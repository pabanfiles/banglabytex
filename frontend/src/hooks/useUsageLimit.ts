import { useState, useEffect } from 'react'

export function useUsageLimit(maxFreeUses = 3) {
  const [usageCount, setUsageCount] = useState(0)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    const count = parseInt(localStorage.getItem('bbx_usage_count') || '0')
    setUsageCount(count)
  }, [])

  const checkLimit = () => {
    if (usageCount >= maxFreeUses) {
      setShowModal(true)
      return false
    }
    return true
  }

  const incrementUsage = () => {
    const newCount = usageCount + 1
    setUsageCount(newCount)
    localStorage.setItem('bbx_usage_count', newCount.toString())
  }

  const unlockAccess = () => {
    localStorage.setItem('bbx_usage_count', '0')
    setUsageCount(0)
    setShowModal(false)
  }

  return { usageCount, showModal, setShowModal, checkLimit, incrementUsage, unlockAccess, maxFreeUses }
}