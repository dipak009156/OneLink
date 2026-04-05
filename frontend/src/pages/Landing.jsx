import { useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import Hero from '../components/landing/Hero'
import SearchBar from '../components/landing/SearchBar'
import FilterChips from '../components/landing/FilterChips'
import DevCard from '../components/landing/DevCard'
import { DEMO_DEVS, FILTER_CHIPS } from '../constants'

const Landing = () => {
  const [search, setSearch] = useState('')
  const [activeFilter, setActiveFilter] = useState('All')

  const filtered = DEMO_DEVS.filter(dev => {
    const matchesSearch = dev.name.toLowerCase().includes(search.toLowerCase()) ||
      dev.skills.some(s => s.toLowerCase().includes(search.toLowerCase()))
    const matchesFilter = activeFilter === 'All' ||
      dev.skills.some(s => s.toLowerCase() === activeFilter.toLowerCase())
    return matchesSearch && matchesFilter
  })

  return (
    <>
      <Navbar />
      <main className="px-6 md:px-12 lg:px-20">
        <Hero />
        <section className="py-12 md:py-16">
          <SearchBar value={search} onChange={setSearch} />
          <FilterChips active={activeFilter} onSelect={setActiveFilter} />
          <div className="grid gap-4 mt-12 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map(dev => (
              <DevCard key={dev.username} dev={dev} />
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link
              to="/explore"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-md hover:from-violet-700 hover:to-purple-700 transition-colors"
            >
              Explore All Developers
              <ArrowRight size={16} />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

export default Landing