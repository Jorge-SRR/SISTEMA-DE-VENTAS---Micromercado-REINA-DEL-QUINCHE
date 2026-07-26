"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import { supabase } from "@/lib/supabase"
import type { Producto, Proveedor, Compra, Usuario, Venta, LineItem } from "@/lib/data"
import { IVA } from "@/lib/data"

type AppState = {
  productos: Producto[]
  proveedores: Proveedor[]
  compras: Compra[]
  usuarios: Usuario[]
  ventas: Venta[]
  currentUser: Usuario | null
  loading: boolean

  // Auth
  login: (usuario: string, password: string) => Promise<{ ok: boolean; error?: string }>
  logout: () => void

  // Productos
  addProducto: (p: Omit<Producto, "id">) => Promise<void>
  updateProducto: (id: string, p: Partial<Producto>) => Promise<void>
  deleteProducto: (id: string) => Promise<void>

  // Usuarios
  addUsuario: (u: Omit<Usuario, "id">) => Promise<void>
  updateUsuario: (id: string, u: Partial<Usuario>) => Promise<void>
  deleteUsuario: (id: string) => Promise<void>
  toggleUsuarioActivo: (id: string) => Promise<void>

  // Proveedores
  addProveedor: (p: Omit<Proveedor, "id">) => Promise<void>
  updateProveedor: (id: string, p: Partial<Proveedor>) => Promise<void>
  deleteProveedor: (id: string) => Promise<void>

  // Compras
  addCompra: (c: Omit<Compra, "id">) => Promise<void>
  recibirCompra: (id: string, productosActualizar: { productoId: string; cantidad: number }[]) => Promise<void>

  // Ventas
  registrarVenta: (items: LineItem[], cajero: string) => Promise<Venta | null>

  // Inventario
  ajustarStock: (productoId: string, nuevoStock: number) => Promise<void>
}

const AppContext = createContext<AppState | null>(null)

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error("useApp debe usarse dentro de AppProvider")
  return ctx
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [productos, setProductos] = useState<Producto[]>([])
  const [proveedores, setProveedores] = useState<Proveedor[]>([])
  const [compras, setCompras] = useState<Compra[]>([])
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [ventas, setVentas] = useState<Venta[]>([])
  const [currentUser, setCurrentUser] = useState<Usuario | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchData = useCallback(async () => {
    setLoading(true)
    const [resProd, resProv, resComp, resUsu, resVent] = await Promise.all([
      supabase.from("productos").select("*").order("created_at", { ascending: true }),
      supabase.from("proveedores").select("*").order("created_at", { ascending: true }),
      supabase.from("compras").select("*").order("created_at", { ascending: false }),
      supabase.from("usuarios").select("*").order("created_at", { ascending: true }),
      supabase.from("ventas").select(`*, venta_items(*)`).order("created_at", { ascending: false }),
    ])

    if (resProd.data) setProductos(resProd.data.map(p => ({ ...p, stockMinimo: p.stock_minimo })))
    if (resProv.data) setProveedores(resProv.data)
    if (resComp.data) setCompras(resComp.data)
    if (resUsu.data) setUsuarios(resUsu.data)
    if (resVent.data) {
      setVentas(resVent.data.map(v => ({
        id: v.id,
        numero: v.numero,
        fecha: v.fecha,
        subtotal: v.subtotal,
        iva: v.iva,
        total: v.total,
        cajero: v.cajero,
        items: v.venta_items.map((i: any) => ({
          productoId: i.producto_id,
          nombre: i.nombre,
          precio: i.precio,
          cantidad: i.cantidad
        }))
      })))
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Auth
  const login = async (usuario: string, password: string) => {
    const { data, error } = await supabase
      .from("usuarios")
      .select("*")
      .eq("usuario", usuario)
      .eq("password", password)
      .single()

    if (error || !data) return { ok: false, error: "Usuario o contraseña incorrectos." }
    if (!data.activo) return { ok: false, error: "Este usuario se encuentra inactivo." }
    
    setCurrentUser(data)
    return { ok: true }
  }

  const logout = () => setCurrentUser(null)

  // Productos
  const addProducto = async (p: Omit<Producto, "id">) => {
    const { data } = await supabase.from("productos").insert({
      codigo: p.codigo,
      nombre: p.nombre,
      categoria: p.categoria,
      precio: p.precio,
      stock: p.stock,
      stock_minimo: p.stockMinimo
    }).select().single()
    if (data) setProductos(prev => [...prev, { ...data, stockMinimo: data.stock_minimo }])
  }

  const updateProducto = async (id: string, p: Partial<Producto>) => {
    const updateData: any = { ...p }
    if (p.stockMinimo !== undefined) {
      updateData.stock_minimo = p.stockMinimo
      delete updateData.stockMinimo
    }
    const { data } = await supabase.from("productos").update(updateData).eq("id", id).select().single()
    if (data) setProductos(prev => prev.map(x => x.id === id ? { ...data, stockMinimo: data.stock_minimo } : x))
  }

  const deleteProducto = async (id: string) => {
    await supabase.from("productos").delete().eq("id", id)
    setProductos(prev => prev.filter(x => x.id !== id))
  }

  // Usuarios
  const addUsuario = async (u: Omit<Usuario, "id">) => {
    const { data } = await supabase.from("usuarios").insert(u).select().single()
    if (data) setUsuarios(prev => [...prev, data])
  }

  const updateUsuario = async (id: string, u: Partial<Usuario>) => {
    const { data } = await supabase.from("usuarios").update(u).eq("id", id).select().single()
    if (data) setUsuarios(prev => prev.map(x => x.id === id ? data : x))
  }

  const deleteUsuario = async (id: string) => {
    await supabase.from("usuarios").delete().eq("id", id)
    setUsuarios(prev => prev.filter(x => x.id !== id))
  }

  const toggleUsuarioActivo = async (id: string) => {
    const user = usuarios.find(u => u.id === id)
    if (!user) return
    const { data } = await supabase.from("usuarios").update({ activo: !user.activo }).eq("id", id).select().single()
    if (data) setUsuarios(prev => prev.map(x => x.id === id ? data : x))
  }

  // Proveedores
  const addProveedor = async (p: Omit<Proveedor, "id">) => {
    const { data } = await supabase.from("proveedores").insert(p).select().single()
    if (data) setProveedores(prev => [...prev, data])
  }

  const updateProveedor = async (id: string, p: Partial<Proveedor>) => {
    const { data } = await supabase.from("proveedores").update(p).eq("id", id).select().single()
    if (data) setProveedores(prev => prev.map(x => x.id === id ? data : x))
  }

  const deleteProveedor = async (id: string) => {
    await supabase.from("proveedores").delete().eq("id", id)
    setProveedores(prev => prev.filter(x => x.id !== id))
  }

  // Compras
  const addCompra = async (c: Omit<Compra, "id">) => {
    const { data } = await supabase.from("compras").insert(c).select().single()
    if (data) setCompras(prev => [data, ...prev])
  }

  const recibirCompra = async (id: string, productosActualizar: { productoId: string; cantidad: number }[]) => {
    await supabase.from("compras").update({ estado: "Recibida" }).eq("id", id)
    
    // Actualizar stock de los productos
    for (const pa of productosActualizar) {
      const prod = productos.find(p => p.id === pa.productoId)
      if (prod) {
        await supabase.from("productos").update({ stock: prod.stock + pa.cantidad }).eq("id", pa.productoId)
      }
    }
    
    await fetchData() // Refrescar para obtener los datos sincronizados
  }

  // Ventas
  const registrarVenta = async (items: LineItem[], cajero: string) => {
    const subtotal = items.reduce((acc, i) => acc + i.precio * i.cantidad, 0)
    const iva = subtotal * IVA
    const total = subtotal + iva
    const numero = `V-${Date.now().toString().slice(-6)}`

    const { data: ventaData, error: ventaError } = await supabase.from("ventas").insert({
      numero,
      subtotal,
      iva,
      total,
      cajero
    }).select().single()

    if (ventaError || !ventaData) return null

    const ventaItemsData = items.map(i => ({
      venta_id: ventaData.id,
      producto_id: i.productoId,
      nombre: i.nombre,
      precio: i.precio,
      cantidad: i.cantidad
    }))

    await supabase.from("venta_items").insert(ventaItemsData)

    // Descontar stock
    for (const item of items) {
      const prod = productos.find(p => p.id === item.productoId)
      if (prod) {
        await supabase.from("productos").update({ stock: Math.max(0, prod.stock - item.cantidad) }).eq("id", item.productoId)
      }
    }

    await fetchData() // Refrescar

    return {
      id: ventaData.id,
      numero: ventaData.numero,
      fecha: ventaData.fecha,
      subtotal: ventaData.subtotal,
      iva: ventaData.iva,
      total: ventaData.total,
      cajero: ventaData.cajero,
      items
    }
  }

  // Inventario
  const ajustarStock = async (productoId: string, nuevoStock: number) => {
    const { data } = await supabase.from("productos").update({ stock: nuevoStock }).eq("id", productoId).select().single()
    if (data) setProductos(prev => prev.map(x => x.id === productoId ? { ...data, stockMinimo: data.stock_minimo } : x))
  }

  return (
    <AppContext.Provider value={{
      productos, proveedores, compras, usuarios, ventas, currentUser, loading,
      login, logout, addProducto, updateProducto, deleteProducto,
      addUsuario, updateUsuario, deleteUsuario, toggleUsuarioActivo,
      addProveedor, updateProveedor, deleteProveedor,
      addCompra, recibirCompra, registrarVenta, ajustarStock
    }}>
      {children}
    </AppContext.Provider>
  )
}
