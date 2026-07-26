"use client"

import { Plus, Phone, User, Truck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { proveedores } from "@/lib/data"

export function ProveedoresView() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{proveedores.length} proveedores activos</p>
        <Button className="gap-2">
          <Plus className="size-4" />
          Nuevo proveedor
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {proveedores.map((p) => (
          <div key={p.id} className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-start justify-between">
              <span className="flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Truck className="size-5" />
              </span>
              <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground">
                {p.categoria}
              </span>
            </div>
            <h3 className="mt-4 font-display text-base font-semibold text-foreground">{p.nombre}</h3>
            <div className="mt-3 flex flex-col gap-1.5 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <User className="size-4" />
                {p.contacto}
              </span>
              <span className="flex items-center gap-2">
                <Phone className="size-4" />
                {p.telefono}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
