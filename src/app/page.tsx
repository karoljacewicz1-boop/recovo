import { LanguageProvider } from '@/lib/LanguageContext'
import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import TrustBar from '@/components/TrustBar'
import WhoWeServe from '@/components/WhoWeServe'
import HowItWorks from '@/components/HowItWorks'
import Services from '@/components/Services'
import Calculator from '@/components/Calculator'
import Testimonials from '@/components/Testimonials'
import ContactForm from '@/components/ContactForm'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <LanguageProvider>
      <Navbar />
      <main>
        <Hero />
        <TrustBar />
        <WhoWeServe />
        <HowItWorks />
        <Services />
        <Calculator />
        <Testimonials />
        <ContactForm />
      </main>
      <Footer />
    </LanguageProvider>
  )
}
