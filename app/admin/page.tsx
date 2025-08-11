"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { AdminDashboard } from "./ui/admin-dashboard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AdminPage() {
  const [authed, setAuthed] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    setAuthed(localStorage.getItem("admin_authed") === "true")
  }, [])

  const login = (e: React.FormEvent) => {
    e.preventDefault()
    if (email === "admin@dinartr.com" && password === "Admin@123") {
      localStorage.setItem("admin_authed", "true")
      setAuthed(true)
      setError("")
    } else {
      setError("Invalid credentials")
    }
  }

  const logout = () => {
    localStorage.removeItem("admin_authed")
    setAuthed(false)
  }

  if (!authed) {
    return (
      <div className="mx-auto max-w-md px-4 py-10">
        <Card>
          <CardHeader>
            <CardTitle>Admin Login</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="grid gap-3" onSubmit={login}>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@dinartr.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Admin@123"
                  required
                />
              </div>
              {error && <div className="text-sm text-destructive">{error}</div>}
              <Button type="submit">Login</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:px-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Admin</h1>
        <Button variant="outline" onClick={logout}>
          Logout
        </Button>
      </div>
      <AdminDashboard />
    </div>
  )
}
