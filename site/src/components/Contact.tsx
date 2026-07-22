export default function Contact() {
  return (
    <section id="contact" className="py-20 bg-[#0f0f24]">
      <div className="mx-auto max-w-[1100px] px-6 text-center">
        <h2 className="text-4xl font-extrabold tracking-[-1px]">Contact us</h2>
        <p className="mx-auto mt-4 mb-8 max-w-[500px] text-lg text-[#94a3b8]">
          Have a question, feedback, or want to sponsor? We'd love to hear from you.
        </p>
        <a
          href="mailto:openply26@gmail.com"
          className="inline-flex h-[52px] items-center gap-3 rounded-xl border border-[#1e293b] bg-[#0a0a1a] px-8 text-base font-semibold text-[#e2e8f0] transition-all duration-200 hover:border-[#22D3EE] hover:text-[#22D3EE] hover:-translate-y-0.5"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          openply26@gmail.com
        </a>
        <p className="mt-4 text-sm text-[#64748b]">
          Response time: usually within 24 hours
        </p>
      </div>
    </section>
  )
}
