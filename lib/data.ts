export type Producto = {
  id: string
  codigo: string
  nombre: string
  categoria: string
  precio: number
  stock: number
  stockMinimo: number
}

export type Proveedor = {
  id: string
  nombre: string
  contacto: string
  telefono: string
  categoria: string
}

export type Compra = {
  id: string
  proveedor: string
  fecha: string
  items: number
  total: number
  estado: "Recibida" | "Pendiente"
}

export type Usuario = {
  id: string
  nombre: string
  usuario: string
  password: string
  rol: "Administrador" | "Cajero"
  activo: boolean
}

export type LineItem = {
  productoId: string
  nombre: string
  precio: number
  cantidad: number
}

export type Venta = {
  id: string
  numero: string
  fecha: string
  items: LineItem[]
  subtotal: number
  iva: number
  total: number
  cajero: string
}

export const CATEGORIAS = [
  "Abarrotes",
  "Lácteos",
  "Bebidas",
  "Panadería",
  "Limpieza",
  "Enlatados",
  "Snacks",
] as const

export const productosIniciales: Producto[] = [
  { id: "p1", codigo: "7861001", nombre: "Arroz Flor 1kg", categoria: "Abarrotes", precio: 1.35, stock: 120, stockMinimo: 20 },
  { id: "p2", codigo: "7861002", nombre: "Aceite Girasol 1L", categoria: "Abarrotes", precio: 2.9, stock: 8, stockMinimo: 15 },
  { id: "p3", codigo: "7861003", nombre: "Azúcar Morena 2kg", categoria: "Abarrotes", precio: 2.15, stock: 64, stockMinimo: 20 },
  { id: "p4", codigo: "7861004", nombre: "Leche Entera 1L", categoria: "Lácteos", precio: 0.95, stock: 40, stockMinimo: 24 },
  { id: "p5", codigo: "7861005", nombre: "Queso Fresco 500g", categoria: "Lácteos", precio: 3.5, stock: 6, stockMinimo: 10 },
  { id: "p6", codigo: "7861006", nombre: "Coca-Cola 1.5L", categoria: "Bebidas", precio: 1.5, stock: 90, stockMinimo: 30 },
  { id: "p7", codigo: "7861007", nombre: "Agua Mineral 600ml", categoria: "Bebidas", precio: 0.6, stock: 200, stockMinimo: 50 },
  { id: "p8", codigo: "7861008", nombre: "Pan de Molde", categoria: "Panadería", precio: 1.8, stock: 18, stockMinimo: 12 },
  { id: "p9", codigo: "7861009", nombre: "Huevos x30", categoria: "Abarrotes", precio: 4.2, stock: 25, stockMinimo: 10 },
  { id: "p10", codigo: "7861010", nombre: "Detergente 2kg", categoria: "Limpieza", precio: 5.75, stock: 5, stockMinimo: 8 },
  { id: "p11", codigo: "7861011", nombre: "Papel Higiénico x12", categoria: "Limpieza", precio: 4.9, stock: 32, stockMinimo: 12 },
  { id: "p12", codigo: "7861012", nombre: "Atún en Lata", categoria: "Enlatados", precio: 1.25, stock: 78, stockMinimo: 20 },
  { id: "p13", codigo: "7861013", nombre: "Fideo Spaguetti 400g", categoria: "Abarrotes", precio: 0.85, stock: 110, stockMinimo: 25 },
  { id: "p14", codigo: "7861014", nombre: "Yogurt 1L", categoria: "Lácteos", precio: 2.1, stock: 9, stockMinimo: 12 },
  { id: "p15", codigo: "7861015", nombre: "Galletas Surtidas", categoria: "Snacks", precio: 1.1, stock: 140, stockMinimo: 30 },
  { id: "p16", codigo: "7861016", nombre: "Café Instantáneo 170g", categoria: "Abarrotes", precio: 6.4, stock: 22, stockMinimo: 8 },
]

export const proveedoresIniciales: Proveedor[] = [
  { id: "s1", nombre: "Distribuidora Andina", contacto: "María Torres", telefono: "099 812 4501", categoria: "Abarrotes" },
  { id: "s2", nombre: "Lácteos del Valle", contacto: "Jorge Pérez", telefono: "098 445 2210", categoria: "Lácteos" },
  { id: "s3", nombre: "Bebidas Nacionales S.A.", contacto: "Ana Salazar", telefono: "096 771 0098", categoria: "Bebidas" },
  { id: "s4", nombre: "Limpieza Total Cía.", contacto: "Luis Andrade", telefono: "097 334 8821", categoria: "Limpieza" },
  { id: "s5", nombre: "Panadería El Trigal", contacto: "Sofía Ruiz", telefono: "099 002 1145", categoria: "Panadería" },
]

export const comprasIniciales: Compra[] = [
  { id: "c1", proveedor: "Distribuidora Andina", fecha: "2026-07-22", items: 45, total: 512.4, estado: "Recibida" },
  { id: "c2", proveedor: "Lácteos del Valle", fecha: "2026-07-23", items: 30, total: 198.5, estado: "Recibida" },
  { id: "c3", proveedor: "Bebidas Nacionales S.A.", fecha: "2026-07-24", items: 60, total: 340.0, estado: "Pendiente" },
  { id: "c4", proveedor: "Limpieza Total Cía.", fecha: "2026-07-24", items: 18, total: 145.75, estado: "Pendiente" },
]

export const usuariosIniciales: Usuario[] = [
  { id: "u1", nombre: "Carlos Mendoza", usuario: "admin", password: "123456", rol: "Administrador", activo: true },
  { id: "u2", nombre: "Elena Vaca", usuario: "elena.v", password: "123456", rol: "Cajero", activo: true },
  { id: "u3", nombre: "Ricardo Suárez", usuario: "ricardo.s", password: "123456", rol: "Cajero", activo: true },
  { id: "u4", nombre: "Paula Jiménez", usuario: "paula.j", password: "123456", rol: "Cajero", activo: false },
]

export const IVA = 0.15

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("es-EC", {
    style: "currency",
    currency: "USD",
  }).format(value)
}

export function generarId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7)
}
