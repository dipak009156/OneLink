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
      if (search !== queryParam && activeFilter === 'All') {
        if (search) {
          setSearchParams({ q: search })
        } else {
          setSearchParams({})
        }
      }
    }, 400) // 400ms debounce
    return () => clearTimeout(handler)
  }, [search])

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
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      
      <main className="flex-1 px-6 md:px-12 lg:px-20 py-12 md:py-16">
        
        {/* Header */}
        <div className="text-center mb-12">

          <p className="text-[#737373] text-lg max-w-2xl mx-auto">
            Discover top talent, explore stunning portfolios, and connect with fellow developers.
          </p>
        </div>

        {/* Searching and Filters */}
        <div className="max-w-4xl mx-auto mb-12">
          <SearchBar value={search} onChange={setSearch} />
          <FilterChips active={activeFilter} onSelect={handleChipSelect} />
        </div>

        {/* Results Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="animate-spin text-violet-600" size={32} />
          </div>
        ) : devs.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
            {devs.map(dev => (
              <DevCard key={dev.username} dev={dev} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center border border-black/[0.05] rounded-2xl bg-gray-50/50">
            <SearchX size={48} className="text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No developers found</h3>
            <p className="text-gray-500 max-w-sm">
              We couldn't find any developers matching your search criteria. Try a different skill or username.
            </p>
            <button 
              onClick={() => handleChipSelect('All')}
              className="mt-6 px-4 py-2 text-sm font-medium bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}

export default Explore
