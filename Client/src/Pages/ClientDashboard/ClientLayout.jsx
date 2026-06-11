import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { useState } from "react";

const ClientLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
<div className="min-h-screen bg-[#070B14] p-8 md:p-6">
  <div
  className="
    min-h-full
    md:h-[calc(100vh-3rem)]
    bg-[#0B1020]
    md:rounded-3xl
    md:border
    md:border-white/10
    flex
    shadow-2xl
    overflow-hidden
  "
>
  <Sidebar
    mobileOpen={mobileOpen}
    setMobileOpen={setMobileOpen}
  />

  <div className="flex-1 flex flex-col min-w-0">
    <Topbar setMobileOpen={setMobileOpen} />

    <main className="flex-1 overflow-y-auto p-4 md:p-8">
      <Outlet />
    </main>
  </div>
</div>
</div>
  );
};

export default ClientLayout;