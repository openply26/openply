import Navbar from './components/Navbar'
import Hero from './components/Hero'
import TerminalDemo from './components/TerminalDemo'
import Features from './components/Features'
import HowItWorks from './components/HowItWorks'
import Models from './components/Models'
import Compare from './components/Compare'
import VSCodeInstall from './components/VSCodeInstall'
import CTA from './components/CTA'
import Footer from './components/Footer'

export default function App() {
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
        <CTA />
      </main>
      <Footer />
    </>
  )
}
