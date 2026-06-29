// import React from "react";
import Strategy from '../Public/strategy.jfif' 
import { Link } from 'react-router-dom';
// import {motion} from 'framer-motion'
import "aos/dist/aos.css";
import { useEffect } from "react";
import AOS from "aos";

const Hero = () => {
         useEffect(() => {
            AOS.init({
              duration: 2000,
              once: false,
              offset: 120,
            });
      
            AOS.refresh();
          }, []);
  return (
    <section className="relative w-full min-h-[90vh] overflow-hidden">


      {/* 🖤 Overlay for readability */}
      <div className="absolute inset-0 bg-white/60 backdrop-blur-sm" />

      {/* 📦 Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 flex items-center min-h-[90vh]">

        <div className="grid lg:grid-cols-2 gap-12 items-center w-full">

          {/* LEFT SIDE */}
          <div>
            
              <p className="text-sm tracking-widest text-slate-600 font-semibold"
                  data-aos="fade-right"
                  data-aos-delay="60"
              >
                STRATEGY • VISION • INNOVATION
              </p>

            <h1 
              className="mt-4 text-4xl md:text-6xl font-bold text-slate-900 leading-tight" 
              data-aos="fade-right"
              data-aos-delay="200"
            >
              Transform Strategy Into Measurable Growth
                            
            </h1>
  
    
              <p className="mt-6 text-lg text-slate-600 max-w-xl"
                  data-aos="fade-right"
                  data-aos-delay="100"
              >
                We help organizations execute strategy effectively through leadership development,
                performance systems, and operational excellence.                
              </p>

      
      

            {/* Buttons */}
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to='/consultation' className="px-6 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition"
              >
                Book Consultation
              </Link>

              <Link to='/services' className="px-6 py-3 border border-slate-300 rounded-lg hover:border-slate-900 transition"
                  data-aos="fade-right"
                  data-aos-delay="100"
              >
                Explore Services
              </Link>
            </div>
          </div>

          {/* RIGHT SIDE (Optional visual space) */}
          <div className="hidden lg:block">
            <div className="h-[400px] rounded-2xl border border-slate-200 bg-white/40 backdrop-blur-md shadow-xl shadow-gray-400"
                  data-aos="fade-left"
                  data-aos-delay="100"
            >
              <img src={Strategy}alt="" className='object-cover w-full h-full rounded-2xl' />
            </div>
          </div>

        </div>
      </div>

    </section>
  );
};

export default Hero;