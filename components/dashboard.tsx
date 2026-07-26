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
import { useApp } from "@/lib/store"
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

const allNav: { key: NavKey; label: string; icon: typeof Home; adminOnly?: boolean }[] = [
  { key: "inicio", label: "Inicio", icon: Home },
  { key: "venta", label: "Nueva Venta", icon: ShoppingCart },
  { key: "productos", label: "Productos", icon: Package, adminOnly: true },
  { key: "inventario", label: "Inventario", icon: Boxes, adminOnly: true },
  { key: "proveedores", label: "Proveedores", icon: Truck, adminOnly: true },
  { key: "compras", label: "Compras", icon: ClipboardList, adminOnly: true },
  { key: "reportes", label: "Reportes", icon: BarChart3, adminOnly: true },
  { key: "usuarios", label: "Usuarios", icon: Users, adminOnly: true },
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
  const { currentUser } = useApp()
  const [active, setActive] = useState<NavKey>("inicio")
  const [mobileOpen, setMobileOpen] = useState(false)

  const isAdmin = currentUser?.rol === "Administrador"

  // Filtrar navegación según rol
  const nav = allNav.filter((item) => !item.adminOnly || isAdmin)

  function go(key: NavKey) {
    setActive(key)
    setMobileOpen(false)
  }

  // Iniciales del usuario para el avatar
  const initials = currentUser
    ? currentUser.nombre
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "??"

  const SidebarContent = (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 px-5 py-5">
        <div className="relative flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-border">
          <img src="/logo.png" alt="Logo Reina del Quinche" className="size-full object-cover" />
        </div>
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
              className={`group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              }`}
            >
              <item.icon className={`size-5 shrink-0 transition-transform ${isActive ? '' : 'group-hover:scale-110 group-hover:text-primary'}`} />
              {item.label}
            </button>
          )
        })}
      </nav>

      <div className="border-t border-sidebar-border p-3">
        <button
          onClick={onLogout}
          className="group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground transition-all hover:bg-destructive/10 hover:text-destructive"
        >
          <LogOut className="size-5 transition-transform group-hover:-translate-x-1" />
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
              <span className="block text-sm font-medium text-foreground">{currentUser?.nombre ?? "Usuario"}</span>
              <span className="block text-xs text-muted-foreground">{currentUser?.rol ?? "Sin rol"}</span>
            </span>
            <span className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
              {initials}
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
