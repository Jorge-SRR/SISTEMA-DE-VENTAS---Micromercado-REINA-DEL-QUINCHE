"use client"

import { Plus, UserCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { usuarios } from "@/lib/data"

const rolTone: Record<string, string> = {
  Administrador: "bg-primary/10 text-primary",
  Cajero: "bg-sky-500/10 text-sky-600",
  Bodeguero: "bg-amber-500/10 text-amber-600",
}

export function UsuariosView() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{usuarios.length} usuarios registrados</p>
        <Button className="gap-2">
          <Plus className="size-4" />
          Nuevo usuario
        </Button>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left text-xs text-muted-foreground">
              <tr>
                <th className="px-5 py-3 font-medium">Nombre</th>
                <th className="px-5 py-3 font-medium">Usuario</th>
                <th className="px-5 py-3 font-medium">Rol</th>
                <th className="px-5 py-3 text-center font-medium">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {usuarios.map((u) => (
                <tr key={u.id} className="transition hover:bg-accent/50">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <UserCircle className="size-8 text-muted-foreground" />
                      <span className="font-medium text-foreground">{u.nombre}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-muted-foreground">@{u.usuario}</td>
                  <td className="px-5 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${rolTone[u.rol]}`}>
                      {u.rol}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-center">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                        u.activo ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <span className={`size-1.5 rounded-full ${u.activo ? "bg-primary" : "bg-muted-foreground"}`} />
                      {u.activo ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
