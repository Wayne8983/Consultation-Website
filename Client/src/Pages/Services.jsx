import CTA from "../Components/Home/CTA";
import FeaturedServices from "../Services/FeaturedServices";
import Process from "../Services/Process";
import ServiceGrid from "../Services/ServiceGrid";
import ServicesHero from "../Services/ServicesHero";


const Services = () => {
  return (
    <main className="bg-[#0b0b10] overflow-hidden">
      <ServicesHero />
      <ServiceGrid />
      <Process />
      <FeaturedServices />
      <CTA />
    </main>
  );
};

export default Services;