import { Link } from 'react-router-dom'
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/clerk-react'

const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 md:px-12 lg:px-20 bg-white/80 backdrop-blur border-b border-black/[0.04]">
      
      <Link to="/" className="text-xl font-bold">
        oneLink
      </Link>

      <div className="flex items-center gap-3">
        <Link to="/explore" className="px-4 py-2 text-sm font-medium hover:bg-gray-50 rounded-md transition-colors">
          Explore
        </Link>

        <SignedOut>
          <SignInButton mode="modal" forceRedirectUrl="/dashboard">
            <button className="px-4 py-2 text-sm font-medium hover:bg-gray-50 rounded-md transition-colors">
              Sign In
            </button>
          </SignInButton>
          <SignUpButton mode="modal" forceRedirectUrl="/dashboard">
            <button className="px-4 py-2 text-sm font-medium bg-[#0a0a0a] text-white rounded-md hover:bg-gray-800 transition-colors">
              Get Started
            </button>
          </SignUpButton>
        </SignedOut>

        <SignedIn>
          <Link to="/dashboard" className="px-4 py-2 text-sm font-medium hover:bg-gray-50 rounded-md transition-colors">
            Dashboard
          </Link>
          <UserButton afterSignOutUrl="/" />
        </SignedIn>
      </div>

    </header>
  )
}

export default Navbar