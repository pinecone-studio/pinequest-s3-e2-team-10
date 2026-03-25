'use client'

import * as React from 'react'

type StudentSession = {
  studentId: string
  studentClass: string
  studentName: string
}

const EMPTY_SESSION: StudentSession = {
  studentId: '',
  studentClass: '',
  studentName: '',
}

function readStudentSession(): StudentSession {
  if (typeof window === 'undefined') {
    return EMPTY_SESSION
  }

  return {
    studentId: localStorage.getItem('studentId') || '',
    studentClass: localStorage.getItem('studentClass') || '',
    studentName: localStorage.getItem('studentName') || '',
  }
}

export function useStudentSession() {
  return React.useSyncExternalStore(
    () => () => undefined,
    readStudentSession,
    () => EMPTY_SESSION,
  )
}
