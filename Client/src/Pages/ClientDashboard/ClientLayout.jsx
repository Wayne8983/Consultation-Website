import { Outlet } from "react-router-dom";
import { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

const ClientLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="relative h-screen overflow-hidden bg-[#050505]">
      <div className="absolute inset-0 -z-10">
        <div className="absolute -top-60 -left-60 h-[700px] w-[700px] rounded-full bg-red-700/10 blur-[180px]" />
        <div className="absolute bottom-0 right-0 h-[620px] w-[620px] rounded-full bg-red-900/10 blur-[180px]" />
        <div className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/[0.025] blur-[120px]" />
      </div>

      <div className="h-full p-0 md:p-6">
        <div
          className="
            h-full
            overflow-hidden
            rounded-none
            border
            border-red-900/20
            bg-white/[0.03]
            shadow-[0_0_60px_rgba(220,38,38,.08)]
            backdrop-blur-2xl
            md:rounded-[30px]
            flex
          "
        >
          <Sidebar
            mobileOpen={mobileOpen}
            setMobileOpen={setMobileOpen}
          />

          <div className="flex min-w-0 flex-1 flex-col">
            <Topbar setMobileOpen={setMobileOpen} />

            <main
              className="
                flex-1
                overflow-y-auto
                px-5
                py-6
                md:px-10
                md:py-8
              "
            >
              <Outlet />
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientLayout;