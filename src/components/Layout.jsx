import React from 'react'

function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      <main className="w-full">
        {children}
      </main>
    </div>
  )
}

export default Layout

