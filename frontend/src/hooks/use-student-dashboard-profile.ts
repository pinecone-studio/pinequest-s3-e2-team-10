"use client"

import { type ChangeEvent, useCallback, useEffect, useState } from "react"
import { notifyStudentSessionChange } from "@/hooks/use-student-session"
import { deleteUpload, listUploads, uploadFile } from "@/lib/uploads-api"

const STORAGE_KEYS = {
  bio: "studentProfileBio",
} as const

const defaultBio = "Би ирээдүйд Дизайнер болно."

export type StudentProfileState = {
  name: string
  bio: string
  image: string
  imageUploadId: string
}

function getAvatarStorageKey(studentId: string) {
  return `studentProfileImageUploadId:${studentId || "anonymous"}`
}

function buildAvatarContentUrl(uploadId: string) {
  return `/api/backend/uploads/${uploadId}/content`
}

function getStoredProfile(studentId: string, studentName: string): StudentProfileState {
  if (typeof window === "undefined") {
    return { name: studentName, bio: defaultBio, image: "", imageUploadId: "" }
  }

  const imageUploadId = studentId ? localStorage.getItem(getAvatarStorageKey(studentId)) || "" : ""

  return {
    name: localStorage.getItem("studentName") || studentName,
    bio: localStorage.getItem(STORAGE_KEYS.bio) || defaultBio,
    image: imageUploadId ? buildAvatarContentUrl(imageUploadId) : "",
    imageUploadId,
  }
}

export function useStudentDashboardProfile(studentId: string, studentName: string) {
  const [profile, setProfile] = useState<StudentProfileState>(() => getStoredProfile(studentId, studentName))
  const [draft, setDraft] = useState<StudentProfileState>(() => getStoredProfile(studentId, studentName))
  const [isUploadingImage, setIsUploadingImage] = useState(false)

  const persistProfile = useCallback((nextProfile: StudentProfileState) => {
    localStorage.setItem("studentName", nextProfile.name)
    localStorage.setItem(STORAGE_KEYS.bio, nextProfile.bio)

    if (studentId && nextProfile.imageUploadId) {
      localStorage.setItem(getAvatarStorageKey(studentId), nextProfile.imageUploadId)
    } else if (studentId) {
      localStorage.removeItem(getAvatarStorageKey(studentId))
    }

    notifyStudentSessionChange()
    setProfile(nextProfile)
  }, [studentId])

  useEffect(() => {
    const nextProfile = getStoredProfile(studentId, studentName)
    setProfile(nextProfile)
    setDraft(nextProfile)
  }, [studentId, studentName])

  useEffect(() => {
    if (!studentId) return

    let isMounted = true

    const loadAvatar = async () => {
      try {
        const uploads = await listUploads(`student-avatars/${studentId}`)
        const latestAvatar = uploads[0]
        if (!isMounted || !latestAvatar) return

        const nextProfile = {
          ...getStoredProfile(studentId, studentName),
          image: buildAvatarContentUrl(latestAvatar.id),
          imageUploadId: latestAvatar.id,
        }

        persistProfile(nextProfile)
        setDraft(nextProfile)
      } catch (error) {
        console.warn("Failed to load student avatar from R2.", error)
      }
    }

    void loadAvatar()
    return () => {
      isMounted = false
    }
  }, [persistProfile, studentId, studentName])

  const handleImageChange = async (event: ChangeEvent<HTMLInputElement>, saveImmediately = false) => {
    const file = event.target.files?.[0]
    event.target.value = ""
    if (!file || !studentId) return

    setIsUploadingImage(true)
    try {
      const nextUpload = await uploadFile({ file, fileName: file.name, folder: `student-avatars/${studentId}` })
      const nextProfile = { ...draft, image: buildAvatarContentUrl(nextUpload.id), imageUploadId: nextUpload.id }

      setDraft(nextProfile)

      if (profile.imageUploadId && profile.imageUploadId !== nextUpload.id) {
        try {
          await deleteUpload(profile.imageUploadId)
        } catch (error) {
          console.warn("Failed to delete previous student avatar from R2.", error)
        }
      }

      if (saveImmediately) persistProfile(nextProfile)
    } catch (error) {
      console.warn("Failed to upload student avatar to R2.", error)
    } finally {
      setIsUploadingImage(false)
    }
  }

  return { defaultBio, draft, isUploadingImage, persistProfile, profile, setDraft, handleImageChange }
}
