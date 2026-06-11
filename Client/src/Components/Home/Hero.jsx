// import React from "react";
import Strategy from '../Public/strategy.jfif' 
import { Link } from 'react-router-dom';
import {motion} from 'framer-motion'

const Hero = () => {
  return (
    <section className="relative w-full min-h-[90vh] overflow-hidden">

      {/* 🌌 Background Aurora
      <div className="absolute inset-0 -z-10">
        <SoftAurora
          speed={0.6}
          scale={1.5}
          brightness={1.0}
          color1="#f7f7f7"
          color2="#e100ff"
          noiseFrequency={2.5}
          noiseAmplitude={1.0}
          bandHeight={0.5}
          bandSpread={1.0}
          octaveDecay={0.1}
          layerOffset={0}
          colorSpeed={1.0}
          enableMouseInteraction={true}
          mouseInfluence={0.25}
        />
      </div> */}

      {/* 🖤 Overlay for readability */}
      <div className="absolute inset-0 bg-white/60 backdrop-blur-sm" />

      {/* 📦 Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 flex items-center min-h-[90vh]">

        <div className="grid lg:grid-cols-2 gap-12 items-center w-full">

          {/* LEFT SIDE */}
          <div>
            
              <p className="text-sm tracking-widest text-slate-600 font-semibold">
                STRATEGY • VISION • INNOVATION
              </p>

            <motion.h1 
              className="mt-4 text-4xl md:text-6xl font-bold text-slate-900 leading-tight" 
              initial={{ opacity: 0, y: 200 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 2.0 }}
            >

               
                  Transform Strategy Into Measurable Growth
                            
            </motion.h1>
  
            <motion.p
              className="mt-6 text-lg text-slate-600 max-w-xl"
              initial={{ opacity: 0, y: 200 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 4.0 }}
            >
              We help organizations execute strategy effectively through leadership development,
              performance systems, and operational excellence.
            </motion.p >
      

            {/* Buttons */}
            <div className="mt-8 flex flex-wrap gap-4">
              <a to='/consultation' className="px-6 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition">
                Book Consultation
              </a>

              <Link to='/services' className="px-6 py-3 border border-slate-300 rounded-lg hover:border-slate-900 transition">
                Explore Services
              </Link>
            </div>
          </div>

          {/* RIGHT SIDE (Optional visual space) */}
          <div className="hidden lg:block">
            <div className="h-[400px] rounded-2xl border border-slate-200 bg-white/40 backdrop-blur-md shadow-xl shadow-gray-400">
              <img src={Strategy}alt="" className='object-cover w-full h-full rounded-2xl' />
            </div>
          </div>

        </div>
      </div>

    </section>
  );
};

export default Hero;