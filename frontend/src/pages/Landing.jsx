import { useState, useEffect } from 'react'
import { ArrowRight, Loader2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import Hero from '../components/landing/Hero'
import SearchBar from '../components/landing/SearchBar'
import FilterChips from '../components/landing/FilterChips'
import DevCard from '../components/landing/DevCard'
import api from '../utils/api'

const DUMMY_DEVS = [
  {
    username: 'alexmercer',
    name: 'Alex Mercer',
    title: 'Senior AI Engineer',
    initials: 'AM',
    avatarColor: 'bg-violet-500',
    profilePicture: 'https://i.pravatar.cc/150?img=11',
    skills: ['Python', 'Rust', 'WebGPU', 'Go'],
    repos: 42,
    leetcode: 1250,
  },
  {
    username: 'sarahj',
    name: 'Sarah Jenkins',
    title: 'Frontend Architect',
    initials: 'SJ',
    avatarColor: 'bg-cyan-500',
    profilePicture: 'https://i.pravatar.cc/150?img=5',
    skills: ['React', 'TypeScript', 'Tailwind', 'Next.js'],
    repos: 38,
    leetcode: 420,
  },
  {
    username: 'davidchen',
    name: 'David Chen',
    title: 'Distributed Systems',
    initials: 'DC',
    avatarColor: 'bg-emerald-500',
    profilePicture: 'https://i.pravatar.cc/150?img=33',
    skills: ['Go', 'Docker', 'Kubernetes', 'AWS'],
    repos: 55,
    leetcode: 890,
  },
  {
    username: 'emilyw',
    name: 'Emily Wong',
    title: 'UI/UX Engineer',
    initials: 'EW',
    avatarColor: 'bg-rose-500',
    profilePicture: 'https://i.pravatar.cc/150?img=44',
    skills: ['Figma', 'React', 'Framer', 'Three.js'],
    repos: 24,
    leetcode: 150,
  },
  {
    username: 'marcus_t',
    name: 'Marcus Taylor',
    title: 'Backend Developer',
    initials: 'MT',
    avatarColor: 'bg-blue-500',
    profilePicture: 'https://i.pravatar.cc/150?img=55',
    skills: ['Node.js', 'PostgreSQL', 'Redis', 'GraphQL'],
    repos: 64,
    leetcode: 560,
  },
  {
    username: 'nina.k',
    name: 'Nina Kravitz',
    title: 'Blockchain Engineer',
    initials: 'NK',
    avatarColor: 'bg-orange-500',
    profilePicture: 'https://i.pravatar.cc/150?img=49',
    skills: ['Solidity', 'Rust', 'Ethers.js', 'Typescript'],
    repos: 19,
    leetcode: 320,
  }
]

const Landing = () => {
  const [search, setSearch] = useState('')
  const [activeFilter, setActiveFilter] = useState('All')
  const [devs, setDevs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch top 6 devs on landing
    const fetchDevs = async () => {
      try {
        setLoading(true)
        const res = await api.get('/api/users/explore?limit=6')
        const realDevs = res.data || []
        // Fill the rest with dummy devs so it always looks full (up to 6)
        const combined = [...realDevs]
        for (let i = 0; combined.length < 6 && i < DUMMY_DEVS.length; i++) {
          if (!combined.find(d => d.username === DUMMY_DEVS[i].username)) {
            combined.push(DUMMY_DEVS[i])
          }
        }
        setDevs(combined)
      } catch (err) {
        console.error('Failed to fetch devs:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchDevs()
  }, [])

  // Restore the original local filtering behavior
  const filtered = devs.filter(dev => {
    const matchesSearch = dev.name.toLowerCase().includes(search.toLowerCase()) ||
      dev.username.toLowerCase().includes(search.toLowerCase()) ||
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

          <div className="mt-12">
            {loading ? (
              <div className="flex justify-center items-center py-10">
                <Loader2 className="animate-spin text-violet-600 dark:text-violet-400" size={32} />
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map(dev => (
                  <DevCard key={dev.username} dev={dev} />
                ))}
              </div>
            )}
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