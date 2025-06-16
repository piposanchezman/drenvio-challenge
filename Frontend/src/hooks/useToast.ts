"use client"

import { useState, useCallback } from "react"

interface Toast {
  id: string
  message: string
  type: "success" | "error"
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const showToast = useCallback((message: string, type: "success" | "error") => {
    const id = Math.random().toString(36).substr(2, 9)
    const newToast = { id, message, type }
    setToasts((prev) => [...prev, newToast])
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  const showSuccess = useCallback(
    (message: string) => {
      showToast(message, "success")
    },
    [showToast],
  )

  const showError = useCallback(
    (message: string) => {
      showToast(message, "error")
    },
    [showToast],
  )

  return {
    toasts,
    showSuccess,
    showError,
    removeToast,
  }
}