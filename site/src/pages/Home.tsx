import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import TerminalDemo from '../components/TerminalDemo'
import Features from '../components/Features'
import HowItWorks from '../components/HowItWorks'
import Models from '../components/Models'
import Compare from '../components/Compare'
import VSCodeInstall from '../components/VSCodeInstall'
import Contact from '../components/Contact'
import CTA from '../components/CTA'
import Footer from '../components/Footer'

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="pt-[72px]">
        <Hero />
        <TerminalDemo />
        <Features />
        <HowItWorks />
        <Models />
        <Compare />
        <VSCodeInstall />
        <Contact />
        <CTA />
      </main>
      <Footer />
    </>
  )
}
