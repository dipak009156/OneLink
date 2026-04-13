import { Link } from 'react-router-dom'
import { SignUpButton } from '@clerk/clerk-react'

const Hero = () => {
  return (
    <section className="flex flex-col items-center justify-center py-16 text-center md:py-24">
      <h1 className="max-w-4xl text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
        Your entire developer identity.
        <br />
        <span className="text-[#737373]">One link.</span>
      </h1>
      <p className="mt-6 max-w-2xl text-lg text-[#737373]">
        Unify your GitHub, LeetCode, and work experience into a single, beautiful profile.
      </p>
      <div className="mt-10 flex flex-col gap-4 sm:flex-row">
        <SignUpButton mode="modal" forceRedirectUrl="/dashboard">
          <button className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-md">
            Create Your oneLink
          </button>
        </SignUpButton>
        <Link
          to="/demo"
          className="px-6 py-3 text-sm font-medium border border-violet-100 dark:border-violet-500/20 text-violet-700 rounded-md hover:bg-violet-50 dark:bg-violet-500/10 transition-colors"
        >
          View Demo
        </Link>
      </div>
    </section>
  )
}

export default Hero