import { LanguageProvider } from '@/lib/LanguageContext'
import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import Pillars from '@/components/Pillars'
import UseCases from '@/components/UseCases'
import RecommerceCallout from '@/components/RecommerceCallout'
import HowItWorks from '@/components/HowItWorks'
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
        <Pillars />
        <UseCases />
        <RecommerceCallout />
        <HowItWorks />
        <Calculator />
        <Testimonials />
        <ContactForm />
      </main>
      <Footer />
    </LanguageProvider>
  )
}
