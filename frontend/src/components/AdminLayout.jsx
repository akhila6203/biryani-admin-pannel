import {
  lazy,
  Suspense,
  useEffect,
  useState,
} from "react";

import Sidebar from "./Sidebar";
import Header from "./Header";


/* =========================================
   LAZY LOAD ADMIN PAGES

   Initial login/app load lo Menu + Orders
   page JS immediate ga load avvakunda untundi.
========================================= */

const MenuPage = lazy(
  () => import("../pages/MenuPage")
);

const OrdersPage = lazy(
  () => import("../pages/OrdersPage")
);


/* =========================================
   GET CURRENT PAGE FROM URL
========================================= */

const getPageFromUrl = () => {
  const params =
    new URLSearchParams(
      window.location.search
    );

  const page =
    params.get("page");

  if (
    page === "menu" ||
    page === "orders"
  ) {
    return page;
  }

  return "menu";
};


export default function AdminLayout({
  onLogout,
}) {
  /* =========================================
     CURRENT PAGE
  ========================================= */

  const [
    activePage,
    setActivePageState,
  ] = useState(getPageFromUrl);


  const [
    sidebarOpen,
    setSidebarOpen,
  ] = useState(false);


  /* =========================================
     CHANGE PAGE
  ========================================= */

  const setActivePage = (page) => {
    if (
      page !== "menu" &&
      page !== "orders"
    ) {
      return;
    }

    setActivePageState(page);

    const url =
      new URL(
        window.location.href
      );

    url.searchParams.set(
      "page",
      page
    );

    window.history.pushState(
      { page },
      "",
      url
    );
  };


  /* =========================================
     BROWSER BACK / FORWARD
  ========================================= */

  useEffect(() => {
    const handlePopState = () => {
      setActivePageState(
        getPageFromUrl()
      );
    };

    window.addEventListener(
      "popstate",
      handlePopState
    );

    return () => {
      window.removeEventListener(
        "popstate",
        handlePopState
      );
    };
  }, []);


  return (
    <div className="min-h-screen bg-[#f8fafc]">

      {/* SIDEBAR */}

      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />


      {/* HEADER */}

      <Header
        onLogout={onLogout}
        setSidebarOpen={
          setSidebarOpen
        }
      />


      {/* PAGE CONTENT */}

      <main className="min-h-screen pt-[72px] lg:ml-[240px]">

        <div className="p-4 sm:p-6 lg:p-8">

          <Suspense
            fallback={
              <div className="flex min-h-[300px] items-center justify-center">
                <p className="text-sm font-semibold text-slate-500">
                  Loading...
                </p>
              </div>
            }
          >

            {activePage ===
              "menu" && (
              <MenuPage />
            )}

            {activePage ===
              "orders" && (
              <OrdersPage />
            )}

          </Suspense>

        </div>

      </main>

    </div>
  );
}


// import { useState } from "react";

// import Sidebar from "./Sidebar";
// import Header from "./Header";

// import MenuPage from "../pages/MenuPage";
// import OrdersPage from "../pages/OrdersPage";

// export default function AdminLayout({
//   onLogout,
// }) {
//   /* =========================================
//      DEFAULT PAGE = MENU
//   ========================================= */

//   const [activePage, setActivePage] =
//     useState("menu");

//   const [
//     sidebarOpen,
//     setSidebarOpen,
//   ] = useState(false);

//   return (
//     <div className="min-h-screen w-full overflow-x-hidden bg-[#f8fafc]">

//       {/* =====================================
//           SIDEBAR
//       ===================================== */}

//       <Sidebar
//         activePage={activePage}
//         setActivePage={setActivePage}
//         sidebarOpen={sidebarOpen}
//         setSidebarOpen={setSidebarOpen}
//       />

//       {/* =====================================
//           HEADER
//       ===================================== */}

//       <Header
//         onLogout={onLogout}
//         setSidebarOpen={
//           setSidebarOpen
//         }
//       />

//       {/* =====================================
//           PAGE CONTENT

//           Desktop:
//           Sidebar width = 240px
//           Header height = 72px

//           min-w-0 is important for
//           responsive table scrolling.
//       ===================================== */}

//       <main className="min-h-screen min-w-0 pt-[72px] lg:ml-[240px]">

//         <div className="min-w-0 p-4 sm:p-6 lg:p-8">

//           {/* MENU PAGE */}

//           {activePage === "menu" && (
//             <MenuPage />
//           )}

//           {/* ORDERS PAGE */}

//           {activePage === "orders" && (
//             <OrdersPage />
//           )}

//         </div>

//       </main>

//     </div>
//   );
// }