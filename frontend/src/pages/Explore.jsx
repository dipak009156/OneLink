import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { ArrowRight, Loader2, SearchX } from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import SearchBar from '../components/landing/SearchBar'
import FilterChips from '../components/landing/FilterChips'
import DevCard from '../components/landing/DevCard'
import api from '../utils/api'

const Explore = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  
  const queryParam = searchParams.get('q') || ''
  
  const [search, setSearch] = useState(queryParam)
  const [activeFilter, setActiveFilter] = useState('All')
  const [devs, setDevs] = useState([])
  const [loading, setLoading] = useState(true)

  // Determine effective filter (search box typed text, or chip clicked).
  // If user searched for something, we pass that as 'q' to backend.
  // We'll map 'activeFilter' to 'q' if a chip is clicked.
  
  useEffect(() => {
    // Sync local search state with URL if it changes externally
    setSearch(queryParam)
  }, [queryParam])

  useEffect(() => {
    const fetchDevs = async () => {
      try {
        setLoading(true)
        const q = queryParam
        const res = await api.get(`/api/users/explore`, { params: { q } })
        setDevs(res.data)
      } catch (err) {
        console.error('Failed to fetch devs:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchDevs()
  }, [queryParam])

  // Handle local SearchBar change (this is just state editing until user presses Enter)
  // Wait, SearchBar doesn't have an "onSearchSubmit" right now. Let's assume it updates immediately 
  // or we need to intercept its submission. We will just update the URL when search state changes.
  // Actually, on the landing page, `setSearch` seems to be immediate. Let's add a small debounce or require form submit.
  // To match Landing style we'll just useEffect debounce on search state.
  
  useEffect(() => {
    const handler = setTimeout(() => {
      // If user is searching manually (not through chips)
      if (search !== queryParam) {
        if (search) {
          setSearchParams({ q: search })
          setActiveFilter('All') // Reset chip if searching manually
        } else if (!queryParam) { // only clear if we are not already at no query
           setSearchParams({})
        }
      }
    }, 400) // 400ms debounce
    return () => clearTimeout(handler)
  }, [search, queryParam])

  const handleChipSelect = (filter) => {
    setActiveFilter(filter)
    setSearch('') // clear text search when chip clicked
    if (filter === 'All') {
      setSearchParams({})
    } else {
      setSearchParams({ q: filter })
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-[#0a0f1c]/60 dark:backdrop-blur-xl">
      <Navbar />
      
      <main className="relative flex-1 px-6 md:px-12 lg:px-20 py-12 md:py-16 overflow-hidden">
        
        {/* Background Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-violet-100/30 blur-[120px] -z-10 rounded-full" />
        
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
            Discover Developers
          </h1>
          <p className="text-[#737373] text-lg max-w-2xl mx-auto">
            Find top talent, explore stunning portfolios, and connect with the world's most creative developers.
          </p>
        </div>

        {/* Searching and Filters */}
        <div className="max-w-4xl mx-auto mb-16 space-y-6">
          <div className="relative group">
             <div className="absolute -inset-1 bg-gradient-to-r from-violet-400 to-indigo-400 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
             <SearchBar value={search} onChange={setSearch} />
          </div>
          <FilterChips active={activeFilter} onSelect={handleChipSelect} />
        </div>

        {/* Results Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="animate-spin text-violet-600 dark:text-violet-400" size={32} />
          </div>
        ) : devs.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
            {devs.map(dev => (
              <DevCard key={dev.username} dev={dev} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 px-6 text-center border border-black/[0.05] dark:border-white/5 rounded-3xl bg-white/50 backdrop-blur-sm shadow-sm dark:shadow-2xl dark:shadow-black/40 max-w-2xl mx-auto">
            <div className="p-4 bg-gray-50 dark:bg-slate-800/50 rounded-2xl mb-6">
              <SearchX size={48} className="text-gray-300" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-slate-50 mb-2">No developers found</h3>
            <p className="text-[#737373] max-w-sm mb-8">
              We couldn't find anyone matching your current search. Try a different skill, username, or clear your filters to see everyone.
            </p>
            <button 
              onClick={() => handleChipSelect('All')}
              className="px-8 py-3 font-semibold bg-violet-600 text-white rounded-xl hover:bg-violet-700 shadow-lg shadow-violet-200 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Clear all filters
            </button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}

export default Explore
