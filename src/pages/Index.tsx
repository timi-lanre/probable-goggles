import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from "@/components/ui/button"

export default function LandingPage() {
  const [mounted, setMounted] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleLogin = () => {
    navigate('/auth')
  }

  const handleAbout = () => {
    navigate('/learn-more')
  }

  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen bg-[#E5D3BC] overflow-hidden">
      {/* Floating geometric shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-white/5 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-white/10 rounded-full blur-lg animate-pulse delay-1000"></div>
        <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-white/5 rounded-full blur-2xl animate-pulse delay-2000"></div>
        <div className="absolute bottom-20 right-10 w-28 h-28 bg-white/8 rounded-full blur-xl animate-pulse delay-3000"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex justify-between items-center px-6 sm:px-8 lg:px-12 py-6">
        <div className="flex items-center">
          <img
            src="/lovable-uploads/107e453f-f4e6-4ee4-9c2f-36119293bb57.png"
            alt="Advisor Connect"
            className="h-16 w-auto object-contain"
          />
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10">
        {/* Hero Section */}
        <div className="flex flex-col items-center justify-center min-h-[80vh] px-6 sm:px-8 text-center">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight">
                Connect with Canada's
                <span className="block text-slate-700">Financial Advisors</span>
              </h1>
              <p className="text-lg sm:text-xl text-slate-700 max-w-2xl mx-auto leading-relaxed">
                Access over 14,000 verified contacts from over 28 leading wealth management firms across Canada
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
              <Button
                onClick={handleLogin}
                className="group relative px-8 py-4 bg-slate-900 text-white font-semibold rounded-full transition-all duration-300 hover:bg-slate-800 hover:transform hover:-translate-y-1 hover:shadow-2xl min-w-[200px]"
              >
                <span className="relative z-10">Sign In</span>
                <div className="absolute inset-0 bg-gradient-to-r from-slate-800 to-slate-900 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Button>
              
              <Button
                onClick={handleAbout}
                variant="outline"
                className="px-8 py-4 bg-white/20 text-slate-900 font-semibold rounded-full transition-all duration-300 hover:bg-white/30 hover:transform hover:-translate-y-1 backdrop-blur-sm border border-white/30 min-w-[200px]"
              >
                Learn More
              </Button>
            </div>

            {/* Features Preview */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-16 max-w-3xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 transition-all duration-300 hover:bg-white/15 hover:transform hover:-translate-y-1">
                <div className="w-12 h-12 bg-slate-900/10 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <svg className="w-6 h-6 text-slate-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">Advanced Search</h3>
                <p className="text-sm text-slate-700">Filter by firm, location, specialty, and more</p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 transition-all duration-300 hover:bg-white/15 hover:transform hover:-translate-y-1">
                <div className="w-12 h-12 bg-slate-900/10 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <svg className="w-6 h-6 text-slate-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">Verified Contacts</h3>
                <p className="text-sm text-slate-700">Reliable, up-to-date advisor information</p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 transition-all duration-300 hover:bg-white/15 hover:transform hover:-translate-y-1">
                <div className="w-12 h-12 bg-slate-900/10 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <svg className="w-6 h-6 text-slate-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">Instant Reports</h3>
                <p className="text-sm text-slate-700">Generate custom reports in seconds</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="py-16 px-6 sm:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 sm:p-12 border border-white/20">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-center">
                <div>
                  <div className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">14,000+</div>
                  <div className="text-slate-700 font-medium">Verified Contacts</div>
                </div>
                <div>
                  <div className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">28</div>
                  <div className="text-slate-700 font-medium">Leading Firms</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center py-8 px-6">
        <p className="text-slate-700/70 text-sm">
          © 2025 Advisor Connect. Canada's premier financial advisor directory.
        </p>
      </footer>
    </div>
  )
}
