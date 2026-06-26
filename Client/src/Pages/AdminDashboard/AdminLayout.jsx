import { Outlet } from "react-router-dom";
import { useState } from "react";
import AdminSidebar from "./AdminSidebar";
import AdminTopbar from "./AdminTopbar";


const AdminLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="relative h-screen bg-[#050505] overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute -top-60 -left-60 w-[700px] h-[700px] rounded-full bg-red-700/10 blur-[180px]" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] rounded-full bg-red-900/10 blur-[180px]" />
      </div>

      <div className="h-full p-0 md:p-6">
        <div
          className="
            h-full
            flex
            overflow-hidden
            bg-white/[0.03]
            backdrop-blur-2xl
            border border-red-900/20
            rounded-none
            md:rounded-[30px]
            shadow-[0_0_60px_rgba(220,38,38,.08)]
          "
        >
          <AdminSidebar
            mobileOpen={mobileOpen}
            setMobileOpen={setMobileOpen}
          />

          <div className="flex-1 flex flex-col min-w-0 h-full">
            <AdminTopbar setMobileOpen={setMobileOpen} />

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

export default AdminLayout;