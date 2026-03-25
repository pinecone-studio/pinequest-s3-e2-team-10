"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { students } from "@/lib/mock-data"

export default function StudentLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    
    const student = students.find(s => s.email === email && s.password === password)
    
    if (student) {
      // Store student info in localStorage for demo purposes
      localStorage.setItem('studentId', student.id)
      localStorage.setItem('studentName', student.name)
      localStorage.setItem('studentClass', student.classId)
      router.push('/student/dashboard')
    } else {
      setError("Invalid email or password")
    }
  }

  return (
    <main className="skywash-background relative min-h-screen overflow-hidden p-4">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-[34%] h-[32rem] w-[32rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/65 blur-3xl" />
        <div className="absolute left-1/2 top-[76%] h-64 w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-200/30 blur-3xl" />
      </div>

      <div className="relative flex min-h-[calc(100vh-2rem)] items-center justify-center">
        <div className="w-full max-w-md">
          <div className="text-center mb-6">
            <Link href="/" className="text-sm text-[#1E3A5F]/70 hover:underline">
              &larr; Back to Home
            </Link>
            <h1 className="mt-4 text-2xl font-bold text-[#1E3A5F]">Student Login</h1>
            <p className="text-[#1E3A5F]/72">Sign in to access your exams</p>
          </div>

          <div className="relative">
            <div className="ocean-wave pointer-events-none absolute inset-x-4 -top-8 h-24 opacity-75" />
            <Card className="relative border-white/70 bg-white/80 shadow-xl shadow-sky-200/25 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-[#1E3A5F]">Login</CardTitle>
              <CardDescription>Enter your credentials to continue</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
              
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <Button type="submit" className="ocean-cta w-full border-0 font-semibold">
                  Login
                </Button>
              </form>
            </CardContent>
            </Card>
          </div>

          <Card className="mt-4 border-white/65 bg-white/72 shadow-lg shadow-sky-200/20 backdrop-blur-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-[#1E3A5F]">Demo Credentials</CardTitle>
              <CardDescription className="text-xs">Use any of these to login</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-xs space-y-1 font-mono">
                {students.slice(0, 5).map(s => (
                  <div key={s.id} className="flex justify-between">
                    <span>{s.email}</span>
                    <span className="text-muted-foreground">{s.password}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
