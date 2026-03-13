import { Outlet } from 'react-router-dom'
import Navbar from '@/components/Navbar'
import PageTransition from '@/components/PageTransition'

export default function App() {
  return (
    <div className="min-h-screen bg-surface-black text-text-primary font-sans">
      <Navbar />
      <PageTransition>
        <main>
          <Outlet />
        </main>
      </PageTransition>
    </div>
  )
}
