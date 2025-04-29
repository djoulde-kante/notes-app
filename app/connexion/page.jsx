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
    <>
      <div className="bg-circles">
        <div className="circle circle1" />
        <div className="circle circle2" />
      </div>
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="auth-card">
          <h1 className="auth-title">NoteFlex</h1>
          <div className="auth-subtitle">Organisez vos idées en toute liberté</div>
          <div className="auth-tabs">
            <Link href="/connexion" className="auth-tab active">Connexion</Link>
            <Link href="/inscription" className="auth-tab">Inscription</Link>
          </div>
          {error && (
            <Alert variant="destructive" style={{marginBottom: '1em'}}>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSubmit}>
            <input
              className="auth-input"
              id="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              className="auth-input"
              id="password"
              type="password"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'0.7em'}}>
              <span />
              <Link href="/mot-de-passe-oublie" className="auth-link" style={{fontSize:'0.98em'}}>
                Mot de passe oublié ?
              </Link>
            </div>
            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? translations.common.loading : "Se connecter"}
            </button>
          </form>
        </div>
      </div>
    </>
  )
}
