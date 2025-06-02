import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'

// Tab Components
const Overview = () => (
  <div className="animate-fadeIn">
    <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
      <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-[#E5D3BC]/20 flex items-center justify-center">
        <svg className="w-3 h-3 sm:w-5 sm:h-5 text-[#E5D3BC]" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
      </div>
      <h2 className="text-xl sm:text-2xl font-semibold text-slate-900">Overview</h2>
    </div>
    
    <div className="space-y-3 sm:space-y-4 text-sm sm:text-base text-slate-700 leading-relaxed">
      <p>
        Advisor Connect is a revolutionary, all-in-one platform that transforms how professionals
        identify and connect with Wealth Advisors across Canada's Private Wealth Management industry.
        This unique database delivers unparalleled access to over 14,000 meticulously curated contacts
        from 27 leading firms—both bank-owned and independent firms.
      </p>
      
      <p>
        Built by a seasoned industry veteran, Advisor Connect was designed with a deep understanding
        of the power of a robust CRM. More than just a contact list, it provides accurate, streamlined
        access to key decision-makers—all within a single, powerful platform. The result? Enhanced
        opportunity identification, stronger business relationships, and seamless client servicing.
      </p>
      
      <p>
        Covering over 95% of the Canadian Private Wealth market, Advisor Connect is the most comprehensive
        and accurate database resource available in Canada. Whether you're building strategic partnerships,
        expanding your client base, optimizing social media campaigns, or conducting in-depth market research,
        Advisor Connect delivers the data, time savings, and competitive edge you need to succeed.
      </p>
    </div>
  </div>
)

const KeyBenefits = () => {
  const benefits = [
    "Centralized Access: 14,000+ contacts across 27 leading Canadian Private Wealth firms.",
    "Verified, Targeted Contacts: Reach key decision-makers with precise titles.",
    "Strategic Team Navigation: Efficient targeting via clear team names.",
    "In-Depth Team Research: Direct links to team websites.",
    "LinkedIn Integration: Direct access to 85%+ of Advisor LinkedIn profiles.",
    "Customizable Favorite Lists: Create and save favorite contact lists.",
    "Dynamic, Auto-Updating Reports: Generate and save reports.",
    "Consistent Accuracy & Time Savings: Regularly updated database with annual firm reviews.",
    "Reliable Email Addresses: All emails validated by a trusted third-party."
  ]

  return (
    <div className="animate-fadeIn">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-full bg-[#E5D3BC]/20 flex items-center justify-center">
          <svg className="w-5 h-5 text-[#E5D3BC]" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>
        <h2 className="text-2xl font-semibold text-slate-900">Key Benefits of Advisor Connect</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {benefits.map((benefit, index) => (
          <div 
            key={index}
            className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100 transition-all duration-200 hover:bg-slate-100 hover:transform hover:-translate-y-1 hover:shadow-md"
          >
            <svg className="w-5 h-5 text-[#E5D3BC] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <p className="text-slate-700 leading-relaxed">{benefit}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

const ContactSources = () => (
  <div className="animate-fadeIn">
    <div className="flex items-center gap-3 mb-6">
      <div className="w-8 h-8 rounded-full bg-[#E5D3BC]/20 flex items-center justify-center">
        <svg className="w-5 h-5 text-[#E5D3BC]" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      </div>
      <h2 className="text-2xl font-semibold text-slate-900">Advisor Contact Sources</h2>
    </div>
    
    <p className="mb-6 text-slate-700">Database built from rigorously verified sources:</p>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="p-6 bg-slate-50 rounded-xl border border-slate-100">
        <h3 className="font-semibold text-slate-900 mb-3">Official Websites</h3>
        <ul className="space-y-1 text-slate-700">
          <li>• Company Corporate Websites</li>
          <li>• Advisor Websites</li>
        </ul>
      </div>
      
      <div className="p-6 bg-slate-50 rounded-xl border border-slate-100">
        <h3 className="font-semibold text-slate-900 mb-3">Professional Networking</h3>
        <ul className="space-y-1 text-slate-700">
          <li>• LinkedIn Corporate Profiles</li>
          <li>• LinkedIn Advisor Profiles</li>
        </ul>
      </div>
      
      <div className="p-6 bg-slate-50 rounded-xl border border-slate-100">
        <h3 className="font-semibold text-slate-900 mb-3">Regulatory Bodies & Associations</h3>
        <ul className="space-y-1 text-slate-700">
          <li>• CIRO</li>
          <li>• CSA</li>
          <li>• CAASA</li>
          <li>• PMAC</li>
        </ul>
      </div>
      
      <div className="p-6 bg-slate-50 rounded-xl border border-slate-100">
        <h3 className="font-semibold text-slate-900 mb-3">Industry Publications & News</h3>
        <ul className="space-y-1 text-slate-700">
          <li>• Advisor.ca</li>
          <li>• Investment Executive</li>
          <li>• Canadian Family Offices</li>
          <li>• Investissement & Finance</li>
          <li>• Various Newspaper Feeds</li>
        </ul>
      </div>
    </div>
  </div>
)

const IncludedFirms = () => {
  const firms = [
    "Acumen Capital Partners", "Aligned Capital Partners", "Assante Wealth Management",
    "Bellwether Investment Management", "BMO Nesbitt Burns", "CG Wealth Management",
    "CIBC Wood Gundy", "Desjardins Securities", "Edward Jones",
    "Harbour Front Wealth Management", "Hayward Capital Markets", "IA Private Wealth",
    "IG Securities", "IG Private Wealth", "Leede Financial",
    "Mandeville Private Client", "Manulife Wealth", "National Bank Financial",
    "Odlum Brown", "Q Wealth", "Raymond James Wealth Management",
    "RBC Dominion Securities", "Research Capital Corporate", "Richardson Wealth",
    "ScotiaMcLeod", "TD", "Ventum Financial", "Wellington-Altus Financial"
  ]

  return (
    <div className="animate-fadeIn">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-full bg-[#E5D3BC]/20 flex items-center justify-center">
          <svg className="w-5 h-5 text-[#E5D3BC]" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm3 5a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1zm0 3a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1z" clipRule="evenodd" />
          </svg>
        </div>
        <h2 className="text-2xl font-semibold text-slate-900">Firms Included in Advisor Connect</h2>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {firms.map((firm, index) => (
          <div 
            key={index}
            className="p-4 bg-slate-50 rounded-lg border border-slate-100 text-center text-slate-700 transition-all duration-200 hover:bg-[#E5D3BC] hover:text-slate-900 hover:transform hover:-translate-y-1"
          >
            {firm}
          </div>
        ))}
      </div>
    </div>
  )
}

export default function About() {
  const [activeTab, setActiveTab] = useState(0)
  const [mounted, setMounted] = useState(false)
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { user } = useAuth()

  useEffect(() => {
    setMounted(true)
    const section = searchParams.get('section')
    if (section) {
      const tabIndex = parseInt(section)
      if (!isNaN(tabIndex) && tabIndex >= 0 && tabIndex <= 3) {
        setActiveTab(tabIndex)
      }
    }
  }, [searchParams])

  const handleTabChange = (newValue: number) => {
    setActiveTab(newValue)
    navigate(`/about?section=${newValue}`, { replace: true })
  }

  const handleHome = () => {
    if (user) {
      navigate('/dashboard')
    } else {
      navigate('/')
    }
  }

  const tabs = [
    { name: 'Overview', icon: '📖' },
    { name: 'Key Benefits', icon: '✅' },
    { name: 'Contact Sources', icon: '🔗' },
    { name: 'Firms Included', icon: '🏢' }
  ]

  const renderContent = () => {
    switch (activeTab) {
      case 0: return <Overview />
      case 1: return <KeyBenefits />
      case 2: return <ContactSources />
      case 3: return <IncludedFirms />
      default: return <Overview />
    }
  }

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-slate-50">
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fadeIn {
            animation: fadeIn 0.8s ease-out;
          }
          @media print {
            body { display: none !important; }
          }
        `
      }} />

      {/* Header */}
      <header className="bg-gradient-to-r from-[#E5D3BC] to-[#e9d9c6] border-b border-slate-200 shadow-sm">
        <div className="px-4 sm:px-6 lg:px-12 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center">
              <img
                src="/lovable-uploads/107e453f-f4e6-4ee4-9c2f-36119293bb57.png"
                alt="Advisor Connect"
                className="h-16 w-auto object-contain cursor-pointer transition-transform duration-200 hover:scale-105"
                onClick={handleHome}
              />
            </div>
            
            <button
              onClick={handleHome}
              className="text-slate-800 font-semibold px-4 sm:px-6 py-2 rounded-lg transition-all duration-300 hover:bg-white/20 hover:transform hover:-translate-y-0.5 text-sm sm:text-base"
            >
              {user ? 'Dashboard' : 'Home'}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 sm:px-6 lg:px-12 py-6 sm:py-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-white to-slate-50 rounded-xl lg:rounded-2xl p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8 border border-slate-200 shadow-sm">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-2 sm:mb-3">About Advisor Connect</h1>
          <p className="text-base sm:text-lg text-slate-600 border-l-4 border-[#E5D3BC] pl-3 sm:pl-4 py-2 bg-[#E5D3BC]/5 rounded-r-lg">
            Your comprehensive platform for connecting with wealth advisors across Canada
          </p>
        </div>

        {/* Content Section */}
        <div className="bg-white rounded-xl lg:rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Navigation */}
          <div className="p-4 sm:p-6 border-b border-slate-200">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 mb-4 sm:mb-6 text-xs sm:text-sm">
              <button 
                onClick={handleHome}
                className="flex items-center gap-1 text-slate-600 hover:text-blue-600 transition-colors"
              >
                <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
                <span className="hidden sm:inline">{user ? 'Dashboard' : 'Home'}</span>
              </button>
              <span className="text-slate-400">&gt;</span>
              <span className="text-slate-900 font-medium">About</span>
              <span className="text-slate-400 hidden sm:inline">&gt;</span>
              <span className="text-slate-900 font-medium hidden sm:inline">{tabs[activeTab].name}</span>
            </div>
            
            {/* Tabs - Mobile Scrollable */}
            <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 sm:flex-wrap">
              {tabs.map((tab, index) => (
                <button
                  key={index}
                  onClick={() => handleTabChange(index)}
                  className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg font-medium transition-all duration-200 whitespace-nowrap text-sm sm:text-base ${
                    activeTab === index
                      ? 'bg-[#E5D3BC] text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <span className="text-sm">{tab.icon}</span>
                  <span className="hidden sm:inline">{tab.name}</span>
                </button>
              ))}
            </div>
          </div>
          
          {/* Content */}
          <div className="p-4 sm:p-6 lg:p-8">
            {renderContent()}
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center text-slate-500 text-sm py-8 mt-12 border-t border-slate-200">
          Advisor Connect | Confidential
        </footer>
      </main>
    </div>
  )
}
