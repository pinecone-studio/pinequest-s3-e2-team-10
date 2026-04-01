"use client"

import { useSyncExternalStore } from "react"

let currentTimestamp = 0
let intervalId: number | null = null
const listeners = new Set<() => void>()

function emitChange() {
  currentTimestamp = Date.now()
  listeners.forEach((listener) => listener())
}

function subscribe(listener: () => void) {
  listeners.add(listener)

  if (typeof window !== "undefined" && intervalId === null) {
    currentTimestamp = Date.now()
    intervalId = window.setInterval(emitChange, 60_000)
  }

  return () => {
    listeners.delete(listener)

    if (listeners.size === 0 && intervalId !== null) {
      window.clearInterval(intervalId)
      intervalId = null
    }
  }
}

function getSnapshot() {
  return currentTimestamp
}

function getServerSnapshot() {
  return 0
}

export function useCurrentTime() {
  const timestamp = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  return timestamp === 0 ? null : new Date(timestamp)
}
