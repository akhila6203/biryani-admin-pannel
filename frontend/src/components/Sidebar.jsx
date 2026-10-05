import {
  ClipboardList,
  Menu as MenuIcon,
  X,
} from "lucide-react";

export default function Sidebar({
  activePage,
  setActivePage,
  sidebarOpen,
  setSidebarOpen,
}) {
  const openPage = (page) => {
    setActivePage(page);
    setSidebarOpen(false);
  };

  return (
    <>

      {/* MOBILE OVERLAY */}

      {sidebarOpen && (
        <div
          onClick={() =>
            setSidebarOpen(false)
          }
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
        />
      )}

      {/* SIDEBAR */}

      <aside
        className={`
          fixed left-0 top-0 z-50
          h-screen w-[240px]
          border-r border-slate-200
          bg-white
          transition-transform duration-300

          lg:translate-x-0

          ${
            sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >

        {/* ==========================================
            LOGO AREA
        ========================================== */}

        <div className="flex h-[72px] items-center justify-between border-b border-slate-200 px-5">

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-3">

  <img
    src="/vaibhavi.png"
    alt="Vaibhavi"
    className="h-[68px] w-auto max-w-[230px] object-contain"
  />

</div>
            {/* <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f97316] text-white">
              <UtensilsCrossed size={20} />
            </div>

            <div>

              <h2 className="text-[16px] font-extrabold leading-tight text-slate-900">
                Biryani House
              </h2>

              <p className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.15em] text-slate-400">
                Admin
              </p>

            </div> */}

          </div>

          {/* MOBILE CLOSE */}

          <button
            type="button"
            onClick={() =>
              setSidebarOpen(false)
            }
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 lg:hidden"
          >
            <X size={19} />
          </button>

        </div>

        {/* ==========================================
            SIDEBAR MENU
        ========================================== */}

        <nav className="p-4">

          {/* MENU */}

          <button
            type="button"
            onClick={() =>
              openPage("menu")
            }
            className={`mb-2 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold transition ${
              // activePage === "menu"
              //   ? "bg-orange-50 text-orange-600"
              //   : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              activePage === "menu"
  ? "bg-[#bf0000]/10 text-[#bf0000]"
  : "text-slate-600 hover:bg-[#bf0000]/5 hover:text-[#bf0000]"
            }`}
          >

            <MenuIcon size={19} />

            Menu

          </button>

          {/* ORDERS */}

          <button
            type="button"
            onClick={() =>
              openPage("orders")
            }
            className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold transition ${
              activePage === "orders"
                // ? "bg-orange-50 text-orange-600"
                // : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
  ? "bg-[#bf0000]/10 text-[#bf0000]"
  : "text-slate-600 hover:bg-[#bf0000]/5 hover:text-[#bf0000]"
            }`}
          >

            <ClipboardList size={19} />

            Orders

          </button>

        </nav>

      </aside>

    </>
  );
}