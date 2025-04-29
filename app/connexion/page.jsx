"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/providers"
import { translations } from "@/lib/translations"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { login } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    if (!email || !password) {
      setError(translations.common.required)
      return
    }

    setLoading(true)

    try {
      await login(email, password)
      router.push("/notes")
    } catch (error) {
      setError(error.message || translations.auth.invalidCredentials)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">{translations.auth.loginTitle}</h1>
          <p className="mt-2 text-gray-600">
            {translations.auth.dontHaveAccount}{" "}
            <Link href="/inscription" className="text-primary hover:underline">
              {translations.common.register}
            </Link>
          </p>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">{translations.common.email}</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">{translations.common.password}</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="text-right">
            <Link href="/mot-de-passe-oublie" className="text-sm text-primary hover:underline">
              {translations.auth.forgotPassword}
            </Link>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? translations.common.loading : translations.common.login}
          </Button>
        </form>
      </div>
    </div>
  )
}
