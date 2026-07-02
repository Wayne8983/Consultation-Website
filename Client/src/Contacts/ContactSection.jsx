import "aos/dist/aos.css";
import { useEffect } from "react";
import AOS from "aos";
import { useState } from "react";
import axios from 'axios'
const BackendURL = import.meta.env.VITE_BackendURL;


const ContactSection = () => {
  const [name,setName]=useState("");
  const [message,setMessage]=useState("");
  const [email,setEmail]=useState("");
  const [error,setError]=useState("");
  const [color,setColor] =useState("");
  const [loading,setLoading]=useState(false);


        useEffect(() => {
          AOS.init({
            duration: 2000,
            once: false,
            offset: 120,
          });
    
          AOS.refresh();
        }, []);

        //the handle submit 
        const handleSubmit = async(e)=>{
          try{
            e.preventDefault();
            setLoading(true);

            const response = await axios.post(BackendURL+'/api/contactMessage',{name,message,email});
            if(response.data.success){
            setColor("text-green-500");
            setError(response.data.message);


              //this is a function to clear the fields in a span provided
              setTimeout(()=>{
                setError("");
                setName("");
                setEmail("");
                setMessage("");
              },[3000]);
            }
          



          }catch(err){
            console.log(err);
            setColor("text-red-600");
            setLoading(false);
            setError(err.response.data.message || "Something went wrong please try again later" );

            setTimeout(()=>{
              setError("");
            },[4000])
            
          }finally{
            setTimeout(()=>{
              setLoading(false);
            },[2000])
        }
      }


  return (
    <section className="bg-[#0b0b10] py-24">
      <div className="max-w-7xl mx-auto px-6">

        <div className="grid lg:grid-cols-2 gap-16">

          {/* Form */}

          <div
            data-aos="fade-up"
            data-aos-delay="100"
            className="
              rounded-3xl
              bg-white/5
              border border-white/10
              p-8
            "
          >
            <h2 className="text-3xl font-bold text-white"
          data-aos="fade-up"
          data-aos-delay="200"
            >
              Send Us A Message
            </h2>

            <form 
                  onSubmit={handleSubmit}
                  className="mt-8 space-y-6"
                  data-aos="fade-up"
                  data-aos-delay="100"
            >

              <input
                type="text"
                placeholder="Your Name"
                value={name}
                onChange={(e)=>setName(e.target.value)}
                className="
                  w-full
                  bg-white/5
                  border border-white/10
                  rounded-xl
                  px-4 py-4
                  text-white
                  outline-none
                  focus:border-fuchsia-500
                "
              />

              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
                className="
                  w-full
                  bg-white/5
                  border border-white/10
                  rounded-xl
                  px-4 py-4
                  text-white
                  outline-none
                  focus:border-fuchsia-500
                "
              />

              <textarea
                rows="6"
                placeholder="Your Message"
                value={message}
                onChange={(e)=>setMessage(e.target.value)}
                className="
                  w-full
                  bg-white/5
                  border border-white/10
                  rounded-xl
                  px-4 py-4
                  text-white
                  outline-none
                  focus:border-fuchsia-500
                "
              />
              <p className={color} >{error}</p>

              <button
                // onClick={()=>setLoading(true)}
                type="submit"
                data-aos="fade-up"
                data-aos-delay="100"
                className="
                  px-8 py-4
                  bg-fuchsia-600
                  rounded-xl
                  text-white
                  hover:bg-fuchsia-500
                  transition
                "
              >
                {loading?'Sending...':'Send Message'}
              </button>

            </form>
          </div>

          {/* Info */}

          <div>

            <h2 className="text-3xl font-bold text-white"
                data-aos="fade-up"
                data-aos-delay="100"
            >
              Get In Touch
            </h2>

            <div className="mt-8 space-y-8"
                data-aos="fade-up"
                data-aos-delay="100"
            >

              <div>
                <h3 className="text-fuchsia-400 font-semibold">
                  Email
                </h3>

                <p className="mt-2 text-slate-400"
                    data-aos="fade-up"
                    data-aos-delay="100"
                >
                  hello@strategycenter.co.ke
                </p>
              </div>

              <div>
                <h3 className="text-fuchsia-400 font-semibold"
                    data-aos="fade-up"
                    data-aos-delay="100"
                >
                  Phone
                </h3>

                <p className="mt-2 text-slate-400"
                    data-aos="fade-up"
                    data-aos-delay="100"
                >
                  +254 718 500 370
                </p>
              </div>

              <div>
                <h3 className="text-fuchsia-400 font-semibold"
                    data-aos="fade-up"
                    data-aos-delay="100"
                >
                  Location
                </h3>

                <p className="mt-2 text-slate-400 flex flex-col"
                    data-aos="fade-up"
                    data-aos-delay="100"
                >
                  Nairobi, Kenya 
                  <p> KP Offices Suite 26,Milimani Road</p>
                </p>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

export default ContactSection;

