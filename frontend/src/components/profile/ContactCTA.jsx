const ContactCTA = ({ name, email }) => {
  return (
    <section className="bg-white dark:bg-[#0a0f1c]/60 dark:backdrop-blur-xl rounded-xl border border-black/[0.05] dark:border-white/5 p-8 text-center">
      <p className="text-sm text-gray-600 dark:text-slate-300 mb-4">Interested in working with {name}?</p>
      <a
        href={`mailto:${email}?subject=Hello ${name}`}
        className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-violet-500 to-purple-500 rounded-lg hover:from-violet-600 hover:to-purple-600 transition-all shadow-sm dark:shadow-2xl dark:shadow-black/40"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"/></svg>
        Contact Me
      </a>
    </section>
  )
}

export default ContactCTA