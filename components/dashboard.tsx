"use client"

import { useState } from "react"
import {
  Home,
  ShoppingCart,
  Package,
  Boxes,
  Truck,
  ClipboardList,
  BarChart3,
  Users,
  Store,
  LogOut,
  Menu,
  X,
} from "lucide-react"
import { InicioView } from "@/components/views/inicio-view"
import { PosView } from "@/components/views/pos-view"
import { ProductosView } from "@/components/views/productos-view"
import { InventarioView } from "@/components/views/inventario-view"
import { ProveedoresView } from "@/components/views/proveedores-view"
import { ComprasView } from "@/components/views/compras-view"
import { ReportesView } from "@/components/views/reportes-view"
import { UsuariosView } from "@/components/views/usuarios-view"

type NavKey =
  | "inicio"
  | "venta"
  | "productos"
  | "inventario"
  | "proveedores"
  | "compras"
  | "reportes"
  | "usuarios"

const nav: { key: NavKey; label: string; icon: typeof Home }[] = [
  { key: "inicio", label: "Inicio", icon: Home },
  { key: "venta", label: "Nueva Venta", icon: ShoppingCart },
  { key: "productos", label: "Productos", icon: Package },
  { key: "inventario", label: "Inventario", icon: Boxes },
  { key: "proveedores", label: "Proveedores", icon: Truck },
  { key: "compras", label: "Compras", icon: ClipboardList },
  { key: "reportes", label: "Reportes", icon: BarChart3 },
  { key: "usuarios", label: "Usuarios", icon: Users },
]

const titles: Record<NavKey, { title: string; subtitle: string }> = {
  inicio: { title: "Panel de control", subtitle: "Resumen general de tu micromercado" },
  venta: { title: "Nueva Venta", subtitle: "Punto de venta rápido" },
  productos: { title: "Productos", subtitle: "Catálogo de productos" },
  inventario: { title: "Inventario", subtitle: "Control de existencias" },
  proveedores: { title: "Proveedores", subtitle: "Directorio de proveedores" },
  compras: { title: "Compras", subtitle: "Órdenes y abastecimiento" },
  reportes: { title: "Reportes", subtitle: "Métricas y desempeño" },
  usuarios: { title: "Usuarios", subtitle: "Gestión de accesos" },
}

export function Dashboard({ onLogout }: { onLogout: () => void }) {
  const [active, setActive] = useState<NavKey>("inicio")
  const [mobileOpen, setMobileOpen] = useState(false)

  function go(key: NavKey) {
    setActive(key)
    setMobileOpen(false)
  }

  const SidebarContent = (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 px-5 py-5">
        <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <Store className="size-5" />
        </span>
        <div className="min-w-0">
          <p className="truncate font-display text-sm font-bold leading-tight text-sidebar-foreground">
            REINA DEL QUINCHE
          </p>
          <p className="text-xs text-muted-foreground">Micromercado</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-2">
        {nav.map((item) => {
          const isActive = active === item.key
          return (
            <button
              key={item.key}
              onClick={() => go(item.key)}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              }`}
            >
              <item.icon className="size-5 shrink-0" />
              {item.label}
            </button>
          )
        })}
      </nav>

      <div className="border-t border-sidebar-border p-3">
        <button
          onClick={onLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground transition hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        >
          <LogOut className="size-5" />
          Cerrar sesión
        </button>
      </div>
    </div>
  )

  const current = titles[active]

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar desktop */}
      <aside className="hidden w-64 shrink-0 border-r border-sidebar-border bg-sidebar md:block">
        {SidebarContent}
      </aside>

      {/* Sidebar móvil */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-foreground/40"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
          <aside className="absolute left-0 top-0 h-full w-64 border-r border-sidebar-border bg-sidebar">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute right-3 top-4 text-muted-foreground"
              aria-label="Cerrar menú"
            >
              <X className="size-5" />
            </button>
            {SidebarContent}
          </aside>
        </div>
      )}

      {/* Contenido */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-background/80 px-4 py-3.5 backdrop-blur md:px-8">
          <button
            onClick={() => setMobileOpen(true)}
            className="text-foreground md:hidden"
            aria-label="Abrir menú"
          >
            <Menu className="size-5" />
          </button>
          <div className="min-w-0">
            <h1 className="truncate font-display text-lg font-bold text-foreground">{current.title}</h1>
            <p className="truncate text-xs text-muted-foreground">{current.subtitle}</p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <span className="hidden text-right sm:block">
              <span className="block text-sm font-medium text-foreground">Carlos Mendoza</span>
              <span className="block text-xs text-muted-foreground">Administrador</span>
            </span>
            <span className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
              CM
            </span>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8">
          {active === "inicio" && <InicioView onNuevaVenta={() => setActive("venta")} />}
          {active === "venta" && <PosView />}
          {active === "productos" && <ProductosView />}
          {active === "inventario" && <InventarioView />}
          {active === "proveedores" && <ProveedoresView />}
          {active === "compras" && <ComprasView />}
          {active === "reportes" && <ReportesView />}
          {active === "usuarios" && <UsuariosView />}
        </main>
      </div>
    </div>
  )
}
