"use client"

import { LoginScreen } from "@/components/login-screen"
import { Dashboard } from "@/components/dashboard"
import { AppProvider, useApp } from "@/lib/store"

function AppContent() {
  const { currentUser, logout } = useApp()

  if (!currentUser) {
    return <LoginScreen />
  }

  return <Dashboard onLogout={logout} />
}

export default function Page() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  )
}
