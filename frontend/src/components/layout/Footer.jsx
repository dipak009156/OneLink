import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="border-t border-black/[0.04] px-6 py-12 md:px-12 lg:px-20 mt-20">
      <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
        <div className="flex flex-col items-center gap-2 md:items-start">
          <Link to="/" className="text-lg font-bold">oneLink</Link>
          <p className="text-sm text-[#737373]">Your developer identity, unified.</p>
        </div>
      </div>
      <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-black/[0.04] pt-8 md:flex-row">
        <p className="text-xs text-[#737373] opacity-60">© 2026 oneLink. All rights reserved.</p>
        <div className="flex gap-6">
          <a href="#" className="text-xs text-[#737373] hover:text-[#0a0a0a]">Privacy</a>
          <a href="#" className="text-xs text-[#737373] hover:text-[#0a0a0a]">Terms</a>
        </div>
      </div>
    </footer>
  )
}

export default Footer