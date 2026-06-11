import Linkedin from '../../assets/linkedin.png';
import FaceBook from '../../assets/facebook.png';
import Instagram from '../../assets/instagram.png';
import "aos/dist/aos.css";
import { useEffect } from "react";
import AOS from "aos";

import {
  ArrowUpRight,
} from "lucide-react";

const Footer = () =>{ 
    //<----------------------Company details fall here------------------> 
          useEffect(() => {
            AOS.init({
              duration: 1000,
              once: false,
              offset: 120,
            });
      
            AOS.refresh();
          }, []);

        const email ="hello@strategycenter.co.ke";
        const location = "KP Offices Suite 26,Milimani Road";
        const Phone = "+254 718 500 370";


  return (
    <footer className="bg-[#050507] text-white border-t border-white/10 overflow-hidden ">
      <div className="max-w-7xl mx-auto px-6">

        {/* Top CTA */}
        <div className="py-24 text-center border-b border-white/10">

          <h2 className="text-4xl md:text-6xl font-bold leading-tight"
              data-aos="fade-up"
              data-aos-delay="140"
          >
            Ready to transform
            <br />
            your organization?
          </h2>

          <a
              data-aos="fade-up"
              data-aos-delay="150"
            href={'/contact'}
            className="inline-flex items-center gap-2 mt-8 text-fuchsia-400 text-xl hover:text-fuchsia-300 transition"
          >
            hello@company.com
            <ArrowUpRight size={22} />
          </a>

        </div>

        {/* Main Footer */}
        <div className="py-16 grid md:grid-cols-4 gap-12">

          {/* Brand */}
          <div>
            <h3 className="text-2xl font-bold"
              data-aos="fade-right"
              data-aos-delay="100"
            >
              STRATEGY<span className="text-fuchsia-400">.</span>
            </h3>

            <p className="mt-4 text-slate-400 leading-relaxed"
              data-aos="fade-right"
              data-aos-delay="100"
            >
              Helping organizations achieve measurable growth through
              strategy, leadership, and performance excellence.
            </p>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-5 text-white"
              data-aos="fade-right"
              data-aos-delay="200"
            >
              Company
            </h4>

            <ul className="space-y-3 text-slate-400">
              <li>
                <a href="/about" className="hover:text-white transition"
                  data-aos="fade-right"
                  data-aos-delay="250"
                >
                  About
                </a>
              </li>

              <li>
                <a href="/services" className="hover:text-white transition"
                  data-aos="fade-right"
                  data-aos-delay="300"
                >
                  Services
                </a>
              </li>

              <li>
                <a href="/contact" className="hover:text-white transition"
                  data-aos="fade-right"
                  data-aos-delay="350"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold mb-5 text-white"
                  data-aos="fade-left"
                  data-aos-delay="200"
            >
              Services
            </h4>

            <ul className="space-y-3 text-slate-400">
              <li data-aos="fade-left" data-aos-delay="200">Strategy Consulting</li>
              <li data-aos="fade-left" data-aos-delay="250" >Leadership Development</li>
              <li data-aos="fade-left" data-aos-delay="300" >Performance Management</li>
              <li data-aos="fade-left" data-aos-delay="350" >Training & Capacity Building</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-5 text-white" data-aos="fade-left" data-aos-delay="200" >
              Contact
            </h4>

            <ul className="space-y-3 text-slate-400">
              <li data-aos="fade-left" data-aos-delay="250" >{location}</li>
              <li data-aos="fade-left" data-aos-delay="300" >{Phone}</li>
              <li data-aos="fade-left" data-aos-delay="350" >{email}</li>
            </ul>
          </div>

        </div>

        {/* Bottom */}
        <div className="py-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">

          <p className="text-slate-500 text-sm text-center md:text-left">
            © 2026 Strategy Center. All rights reserved.
          </p>

          <div className="flex items-center gap-5">

            <a
              
              href="#"
              className="text-slate-400 hover:text-fuchsia-400 transition"
            >
              <img src={Linkedin} alt="LinkedIn"  className="w-6 h-6 opacity-70 hover:opacity-100 hover:scale-110 transition-all duration-300" />
            </a>

            <a
              
              href="#"
              className="text-slate-400 hover:text-fuchsia-400 transition"
            >
              <img src={Instagram} alt="Instagram"  className="w-6 h-6 opacity-70 hover:opacity-100 hover:scale-110 transition-all duration-300" />
            </a>

            <a
              
              href="#"
              className="text-slate-400 hover:text-fuchsia-400 transition"
            >
              <img src={FaceBook} alt="FaceBook"  className="w-6 h-6 opacity-70 hover:opacity-100 hover:scale-110 transition-all duration-300" />
            </a>

          </div>

        </div>

      </div>
    </footer>
  );
};

export default Footer;