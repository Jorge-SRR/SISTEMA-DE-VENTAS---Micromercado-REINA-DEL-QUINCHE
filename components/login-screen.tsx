"use client"

import { useState } from "react"
import { Store, User, Lock, LogIn, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useApp } from "@/lib/store"

export function LoginScreen() {
  const { login } = useApp()
  const [usuario, setUsuario] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!usuario.trim() || !password.trim()) {
      setError("Ingrese su usuario y contraseña.")
      return
    }
    setError("")
    setLoading(true)
    try {
      const result = await login(usuario.trim(), password)
      if (!result.ok) {
        setError(result.error || "Error al iniciar sesión.")
      }
    } catch (e) {
      setError("Error de conexión con el servidor.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen w-full flex-col md:flex-row">
      {/* Lado izquierdo: imagen */}
      <div className="relative hidden w-1/2 overflow-hidden md:block">
        <img
          src="/minimarket.png"
          alt="Interior de un micromercado moderno con estanterías organizadas"
          className="h-full w-full animate-[fadeIn_1.2s_ease-out] object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/70 via-primary/20 to-transparent" />
        <div className="absolute bottom-10 left-10 right-10 text-primary-foreground">
          <h2 className="font-display text-3xl font-bold text-balance">
            Gestión inteligente para tu micromercado
          </h2>
          <p className="mt-2 max-w-md text-pretty text-sm text-primary-foreground/90 leading-relaxed">
            Ventas rápidas, control de inventario y reportes claros. Todo en un
            solo lugar para atender mejor a tus clientes.
          </p>
        </div>
      </div>

      {/* Lado derecho: formulario */}
      <div className="flex w-full items-center justify-center p-6 md:w-1/2">
        <div className="w-full max-w-sm animate-[fadeIn_0.6s_ease-out]">
          <div className="mb-8 flex flex-col items-center text-center">
            <div className="relative mb-2 flex size-20 items-center justify-center overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-border">
              <img src="/logo.png" alt="Logo Reina del Quinche" className="size-full object-cover" />
            </div>
            <h1 className="mt-4 font-display text-2xl font-bold tracking-tight text-foreground">
              REINA DEL QUINCHE
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Sistema de gestión y punto de venta
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="usuario" className="text-sm font-medium text-foreground">
                Usuario
              </label>
              <div className="relative">
                <User className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="usuario"
                  type="text"
                  value={usuario}
                  onChange={(e) => setUsuario(e.target.value)}
                  autoComplete="username"
                  className="w-full rounded-lg border border-input bg-card py-2.5 pl-10 pr-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                  placeholder="Ingrese su usuario"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="text-sm font-medium text-foreground">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  className="w-full rounded-lg border border-input bg-card py-2.5 pl-10 pr-10 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                  placeholder="Ingrese su contraseña"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition hover:text-foreground"
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-sm text-destructive" role="alert">
                {error}
              </p>
            )}

            <Button type="submit" disabled={loading} className="group mt-2 h-11 w-full gap-2 text-sm font-semibold transition-all hover:bg-primary/90">
              <LogIn className="size-4 transition-transform group-hover:translate-x-1" />
              {loading ? "Ingresando..." : "Ingresar"}
            </Button>

            <p className="mt-2 text-center text-xs text-muted-foreground">
              Demo: usuario <span className="font-medium text-foreground">admin</span> · contraseña{" "}
              <span className="font-medium text-foreground">123456</span>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
