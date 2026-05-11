"use client"
import { useEffect, useState } from "react"

export function useUserId(): string {
  const [id, setId] = useState("")
  useEffect(() => {
    let stored = localStorage.getItem("jt_user_id")
    if (!stored) {
      stored = crypto.randomUUID()
      localStorage.setItem("jt_user_id", stored)
    }
    setId(stored)
  }, [])
  return id
}
