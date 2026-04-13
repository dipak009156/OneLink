import { Link } from 'react-router-dom'
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/clerk-react'
import { useTheme } from '../../context/ThemeContext'

const Navbar = () => {
  const { theme, toggleTheme } = useTheme()

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 md:px-12 lg:px-20 bg-white/80 dark:bg-[#030712]/80 backdrop-blur border-b border-black/[0.04] dark:border-white/5 text-gray-900 dark:text-slate-50 transition-colors duration-300">
      
      <Link to="/" className="text-xl font-bold">
        oneLink
      </Link>

      <div className="flex items-center gap-3">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
          aria-label="Toggle Dark Mode"
        >
          {theme === 'dark' ? (
            <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4.22 4.22a1 1 0 011.415 0l.708.708a1 1 0 01-1.414 1.414l-.708-.708a1 1 0 010-1.414zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zm-4.22 4.22a1 1 0 010 1.415l-.708.708a1 1 0 01-1.414-1.414l.708-.708a1 1 0 011.415 0zM10 16a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zm-4.22-4.22a1 1 0 01-1.415 0l-.708-.708a1 1 0 011.414-1.414l.708.708a1 1 0 010 1.415zM4 10a1 1 0 01-1 1H2a1 1 0 110-2h1a1 1 0 011 1zM5.78 5.78a1 1 0 010-1.415l.708-.708a1 1 0 111.414 1.414l-.708.708a1 1 0 01-1.415 0zM10 5a5 5 0 100 10 5 5 0 000-10z" clipRule="evenodd" /></svg>
          ) : (
            <svg className="w-5 h-5 text-slate-700" fill="currentColor" viewBox="0 0 20 20"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" /></svg>
          )}
        </button>

        <Link to="/explore" className="px-4 py-2 text-sm font-medium hover:bg-gray-50 dark:hover:bg-white/10 rounded-md transition-colors">
          Explore
        </Link>

        <SignedOut>
          <SignInButton mode="modal" forceRedirectUrl="/dashboard">
            <button className="px-4 py-2 text-sm font-medium hover:bg-gray-50 dark:hover:bg-white/10 rounded-md transition-colors">
              Sign In
            </button>
          </SignInButton>
          <SignUpButton mode="modal" forceRedirectUrl="/dashboard">
            <button className="px-4 py-2 text-sm font-medium bg-[#0a0a0a] dark:bg-white text-white dark:text-[#0a0a0a] rounded-md hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors">
              Get Started
            </button>
          </SignUpButton>
        </SignedOut>

        <SignedIn>
          <Link to="/dashboard" className="px-4 py-2 text-sm font-medium hover:bg-gray-50 dark:hover:bg-white/10 rounded-md transition-colors">
            Dashboard
          </Link>
          <UserButton afterSignOutUrl="/" />
        </SignedIn>
      </div>

    </header>
  )
}

export default Navbar