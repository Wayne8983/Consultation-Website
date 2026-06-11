import Hero from '../Components/Home/Hero'
import TrustSection from '../Components/Home/TrustSection'
import ServicesPreview from '../Components/Home/ServicesPreview'
import WhyChooseUs from '../Components/Home/WhyChooseUs'
import Testimonials from '../Components/Home/Testimonials'
import CTA from '../Components/Home/CTA'

const Home = () => {
  return (
    <div className='overflow-hidden-' >
      <Hero />
      <TrustSection />
      <ServicesPreview />
      <WhyChooseUs />
      <Testimonials />
      <CTA />
    </div>
  )
}

export default Home
