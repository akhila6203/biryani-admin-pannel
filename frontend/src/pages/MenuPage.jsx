import {
  ChevronLeft,
  ChevronRight,
  Pencil,
  Plus,
  Trash2,
  X,
} from "lucide-react";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  addMenuApi,
  deleteMenuApi,
  getAdminMenuApi,
  // getPortionsApi,
  updateMenuApi,
} from "../api/menuApi";


/* =========================================
   CONFIG
========================================= */

const ROWS_PER_PAGE = 10;

// const DEFAULT_PORTIONS = [
//   "Single",
//   "Double",
//   "Full",
// ];

const INITIAL_FORM = {
  name: "",
  // portion: "Single",
  amount: "",
};


/* =========================================
   MENU PAGE
========================================= */

export default function MenuPage() {

  /* =========================================
     STATES
  ========================================= */

  const [
    menuItems,
    setMenuItems,
  ] = useState([]);


  // const [
  //   portions,
  //   setPortions,
  // ] = useState(
  //   DEFAULT_PORTIONS
  // );


  const [
    drawerOpen,
    setDrawerOpen,
  ] = useState(false);


  const [
    currentPage,
    setCurrentPage,
  ] = useState(1);


  const [
    form,
    setForm,
  ] = useState(
    INITIAL_FORM
  );


  // const [
  //   customPortion,
  //   setCustomPortion,
  // ] = useState("");


  const [
    editingId,
    setEditingId,
  ] = useState(null);


  const [
    loading,
    setLoading,
  ] = useState(true);


  const [
    saving,
    setSaving,
  ] = useState(false);


  const [
    deletingId,
    setDeletingId,
  ] = useState(null);


  const [
    error,
    setError,
  ] = useState("");


  /* =========================================
     LOAD MENU + PORTIONS

     Both APIs run parallel for optimization.
  ========================================= */

  // const loadMenu =
  //   useCallback(
  //     async () => {

  //       try {

  //         setLoading(true);

  //         setError("");


  //         const [
  //           menuResponse,
  //           portionResponse,
  //         ] = await Promise.all([
  //           getAdminMenuApi(),
  //           getPortionsApi(),
  //         ]);


  //         /* =================================
  //            MENU DATA
  //         ================================= */

  //         const menuData =
  //           menuResponse?.data?.data;


  //         setMenuItems(
  //           Array.isArray(menuData)
  //             ? menuData
  //             : []
  //         );


  //         /* =================================
  //            PORTION DATA
  //         ================================= */

  //         const portionData =
  //           portionResponse
  //             ?.data
  //             ?.data;


  //         if (
  //           Array.isArray(
  //             portionData
  //           )
  //         ) {

  //           const cleanPortions =
  //             portionData
  //               .map(
  //                 (portion) =>
  //                   String(
  //                     portion
  //                   ).trim()
  //               )
  //               .filter(Boolean);


  //           /*
  //            * Default portions + DB portions.
  //            * Duplicate portions remove.
  //            */

  //           const allPortions = [
  //             ...new Set([
  //               ...DEFAULT_PORTIONS,
  //               ...cleanPortions,
  //             ]),
  //           ];


  //           setPortions(
  //             allPortions
  //           );

  //         } else {

  //           setPortions(
  //             DEFAULT_PORTIONS
  //           );

  //         }
  /* =========================================
   LOAD MENU
========================================= */

const loadMenu =
  useCallback(
    async () => {

      try {

        setLoading(true);

        setError("");


        const menuResponse =
          await getAdminMenuApi();


        const menuData =
          menuResponse?.data?.data;


        setMenuItems(
          Array.isArray(menuData)
            ? menuData
            : []
        );


        } catch (err) {

          console.error(
            "Menu fetch error:",
            err
          );


          setError(
            err?.response
              ?.data
              ?.message ||
              "Unable to load menu."
          );


        } finally {

          setLoading(false);

        }

      },
      []
    );


  /* =========================================
     LOAD DATA ON PAGE OPEN
  ========================================= */

  useEffect(() => {

    loadMenu();

  }, [loadMenu]);


  /* =========================================
     TOTAL PAGES
  ========================================= */

  const totalPages =
    Math.max(
      1,
      Math.ceil(
        menuItems.length /
          ROWS_PER_PAGE
      )
    );


  /* =========================================
     FIX CURRENT PAGE AFTER DELETE
  ========================================= */

  useEffect(() => {

    if (
      currentPage >
      totalPages
    ) {

      setCurrentPage(
        totalPages
      );

    }

  }, [
    currentPage,
    totalPages,
  ]);


  /* =========================================
     PAGINATED MENU ITEMS
  ========================================= */

  const paginatedItems =
    useMemo(() => {

      const startIndex =
        (currentPage - 1) *
        ROWS_PER_PAGE;


      const endIndex =
        startIndex +
        ROWS_PER_PAGE;


      return menuItems.slice(
        startIndex,
        endIndex
      );

    }, [
      menuItems,
      currentPage,
    ]);


  /* =========================================
     OPEN ADD MENU DRAWER
  ========================================= */

  const openAddDrawer = () => {

    setEditingId(null);


    setForm({
      ...INITIAL_FORM,
    });


    // setCustomPortion("");


    setError("");


    setDrawerOpen(true);

  };


  /* =========================================
     OPEN EDIT MENU DRAWER
  ========================================= */
/* =========================================
   OPEN EDIT MENU DRAWER
========================================= */

const openEditDrawer =
  (item) => {

    setEditingId(
      item.id
    );


    setForm({

      name:
        item.name || "",

      amount:
        item.amount ?? "",

    });


    setError("");


    setDrawerOpen(true);

  };
  // const openEditDrawer =
  //   (item) => {

  //     setEditingId(
  //       item.id
  //     );

  //     const portionExists =
  //       portions.includes(
  //         item.portion
  //       );


  //     setForm({

  //       name:
  //         item.name || "",

  //       portion:
  //         portionExists
  //           ? item.portion
  //           : "Other",

  //       amount:
  //         item.amount ?? "",

  //     });


  //     setCustomPortion(
  //       portionExists
  //         ? ""
  //         : item.portion || ""
  //     );


  //     setError("");


  //     setDrawerOpen(true);

  //   };


  /* =========================================
     CLOSE DRAWER
  ========================================= */
const closeDrawer = () => {

  if (saving) {
    return;
  }

  setDrawerOpen(false);

  setEditingId(null);

  setForm({
    ...INITIAL_FORM,
  });

  setError("");

};
  // const closeDrawer = () => {

  //   if (saving) {
  //     return;
  //   }


  //   setDrawerOpen(false);


  //   setEditingId(null);


  //   setForm({
  //     ...INITIAL_FORM,
  //   });


  //   setCustomPortion("");


  //   setError("");

  // };


  /* =========================================
     NORMAL INPUT CHANGE
  ========================================= */

  const handleChange =
    (event) => {

      const {
        name,
        value,
      } = event.target;


      setForm(
        (previous) => ({
          ...previous,

          [name]:
            value,
        })
      );

    };


  /* =========================================
     PORTION CHANGE
  ========================================= */

  // const handlePortionChange =
  //   (event) => {

  //     const value =
  //       event.target.value;


  //     setForm(
  //       (previous) => ({
  //         ...previous,

  //         portion:
  //           value,
  //       })
  //     );

  //     if (
  //       value !== "Other"
  //     ) {

  //       setCustomPortion("");

  //     }

  //   };


  // const addPortionToList =
  //   (portionName) => {

  //     const cleanName =
  //       String(
  //         portionName || ""
  //       ).trim();


  //     if (!cleanName) {
  //       return;
  //     }


  //     setPortions(
  //       (previous) => {

  //         const alreadyExists =
  //           previous.some(
  //             (portion) =>
  //               portion.toLowerCase() ===
  //               cleanName.toLowerCase()
  //           );


  //         if (alreadyExists) {

  //           return previous;

  //         }


  //         return [
  //           ...previous,
  //           cleanName,
  //         ];

  //       }
  //     );

  //   };


  /* =========================================
     SAVE / UPDATE MENU
  ========================================= */

  const handleSubmit =
    async (event) => {

      event.preventDefault();


      /* =====================================
         MENU NAME
      ===================================== */

      const menuName =
        form.name.trim();


      if (!menuName) {

        setError(
          "Please enter menu name."
        );

        return;

      }


      /* =====================================
         PORTION
      ===================================== */

      // const finalPortion =
      //   form.portion ===
      //   "Other"
      //     ? customPortion.trim()
      //     : form.portion;


      // if (!finalPortion) {

      //   setError(
      //     "Please enter portion name."
      //   );

      //   return;

      // }


      // if (
      //   finalPortion.length >
      //   50
      // ) {

      //   setError(
      //     "Portion name must be 50 characters or less."
      //   );

      //   return;

      // }


      /* =====================================
         AMOUNT
      ===================================== */

      const amount =
        Number(
          form.amount
        );


      if (
        !Number.isFinite(
          amount
        ) ||
        amount <= 0
      ) {

        setError(
          "Please enter valid amount."
        );

        return;

      }


      /* =====================================
         API PAYLOAD
      ===================================== */

      const payload = {

        name:
          menuName,

        // portion:
        //   finalPortion,

        amount,

      };


      try {

        setSaving(true);

        setError("");


        /* =================================
           EDIT / UPDATE
        ================================= */

        if (editingId) {

          const response =
            await updateMenuApi(
              editingId,
              payload
            );


          const updatedItem =
            response?.data?.data;


          if (updatedItem) {

            setMenuItems(
              (previous) =>
                previous.map(
                  (item) =>

                    Number(
                      item.id
                    ) ===
                    Number(
                      editingId
                    )

                      ? updatedItem

                      : item

                )
            );

            // addPortionToList(
            //   updatedItem.portion
            // );

          } else {
            await loadMenu();

          }

        }


        /* =================================
           ADD NEW MENU
        ================================= */

        else {

          const response =
            await addMenuApi(
              payload
            );


          const newItem =
            response?.data?.data;


          if (newItem) {

            /*
             * New item first row lo
             * display chestham.
             */

            setMenuItems(
              (previous) => [
                newItem,
                ...previous,
              ]
            );

            // addPortionToList(
            //   newItem.portion
            // );

          } else {

            await loadMenu();

          }

          /*
           * New item top lo add avuthundi.
           */

          setCurrentPage(1);

        }


        /* =================================
           SUCCESS - CLOSE DRAWER
        ================================= */

        setDrawerOpen(false);


        setEditingId(null);


        setForm({
          ...INITIAL_FORM,
        });


        // setCustomPortion("");


        setError("");


      } catch (err) {

        console.error(
          "Menu save error:",
          err
        );


        setError(
          err?.response
            ?.data
            ?.message ||
              (
                editingId
                  ? "Unable to update menu."
                  : "Unable to add menu."
              )
        );


      } finally {

        setSaving(false);

      }

    };


  /* =========================================
     DELETE MENU
  ========================================= */

  const handleDelete =
    async (item) => {

      // const confirmed =
      //   window.confirm(
      //     `Delete "${item.name}" - ${item.portion}?`
      //   );
      const confirmed =
        window.confirm(
          `Delete "${item.name}"?`
        );


      if (!confirmed) {
        return;
      }


      try {

        setDeletingId(
          item.id
        );


        setError("");


        /* =================================
           DELETE API
        ================================= */

        await deleteMenuApi(
          item.id
        );


        /* =================================
           REMOVE FROM UI

           No extra GET API required.
        ================================= */

        setMenuItems(
          (previous) =>
            previous.filter(
              (menuItem) =>

                Number(
                  menuItem.id
                ) !==
                Number(
                  item.id
                )

            )
        );


      } catch (err) {

        console.error(
          "Menu delete error:",
          err
        );


        setError(
          err?.response
            ?.data
            ?.message ||
            "Unable to delete menu."
        );


      } finally {

        setDeletingId(null);

      }

    };


  /* =========================================
     PREVIOUS PAGE
  ========================================= */

  const previousPage = () => {

    setCurrentPage(
      (page) =>
        Math.max(
          1,
          page - 1
        )
    );

  };


  /* =========================================
     NEXT PAGE
  ========================================= */

  const nextPage = () => {

    setCurrentPage(
      (page) =>
        Math.min(
          totalPages,
          page + 1
        )
    );

  };


  /* =========================================
     PAGINATION TEXT
  ========================================= */

  const startRow =
    menuItems.length === 0
      ? 0
      : (
          currentPage - 1
        ) *
          ROWS_PER_PAGE +
        1;


  const endRow =
    Math.min(
      currentPage *
        ROWS_PER_PAGE,
      menuItems.length
    );


  /* =========================================
     RENDER
  ========================================= */

  return (

    <div className="w-full min-w-0">

      {/* =====================================
          PAGE HEADER
      ===================================== */}

      <div className="mb-5 flex items-center justify-between gap-3 sm:mb-6">

        <div>

          <h2 className="text-xl font-black text-slate-900 sm:text-2xl">
            Menu
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Manage your restaurant menu.
          </p>

        </div>


        {/* ADD MENU BUTTON */}

        <button
          type="button"
          onClick={
            openAddDrawer
          }
          className="flex shrink-0 items-center gap-2 rounded-xl bg-[#bf0000] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#a50000] sm:px-5"
          // className="flex shrink-0 items-center gap-2 rounded-xl bg-orange-500 px-4 py-3 text-sm font-bold text-white transition hover:bg-orange-600 sm:px-5"
        >

          <Plus size={18} />

          <span>
            Add Menu
          </span>

        </button>

      </div>


      {/* =====================================
          PAGE ERROR
      ===================================== */}

      {error &&
        !drawerOpen && (

          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">

            {error}

          </div>

        )}


      {/* =====================================
          MENU TABLE
      ===================================== */}

      <div className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white">

        {/* =================================
            MOBILE / TABLET SCROLL
        ================================= */}

        <div className="w-full overflow-x-auto">

          <table className="w-full min-w-[850px] border-collapse">

            {/* ===============================
                TABLE HEADER
            =============================== */}

            <thead>

              <tr className="bg-slate-50">

                <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                  S.No
                </th>

                <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                  Menu Name
                </th>

                {/* <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                  Portion
                </th> */}

                <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                  Amount
                </th>

                <th className="px-5 py-4 text-center text-xs font-bold uppercase tracking-wide text-slate-500">
                  Action
                </th>

              </tr>

            </thead>


            {/* ===============================
                TABLE BODY
            =============================== */}

            <tbody>

              {/* LOADING */}

              {loading ? (

                <tr>

                  <td
                   colSpan="4"
                    // colSpan="5"
                    className="px-5 py-16 text-center text-sm font-semibold text-slate-500"
                  >
                    Loading menu...
                  </td>

                </tr>

              ) : paginatedItems.length >
                0 ? (

                /* =============================
                   MENU ROWS
                ============================= */

                paginatedItems.map(
                  (
                    item,
                    index
                  ) => (

                    <tr
                      key={
                        item.id
                      }
                      className="border-t border-slate-100 transition hover:bg-slate-50"
                    >

                      {/* S.NO */}

                      <td className="px-5 py-4 text-sm font-medium text-slate-600">

                        {(currentPage -
                          1) *
                          ROWS_PER_PAGE +
                          index +
                          1}

                      </td>


                      {/* MENU NAME */}

                      <td className="px-5 py-4">

                        <span className="text-sm font-semibold text-slate-800">

                          {item.name}

                        </span>

                      </td>


                      {/* PORTION */}
{/* 
                      <td className="px-5 py-4">

                        <span 
                        // className="inline-flex whitespace-nowrap rounded-full bg-orange-50 px-3 py-1 text-xs font-bold text-orange-600">
                        className="inline-flex whitespace-nowrap rounded-full bg-[#bf0000]/10 px-3 py-1 text-xs font-bold text-[#bf0000]">
                          {item.portion}

                        </span>

                      </td> */}


                      {/* AMOUNT */}

                      <td className="px-5 py-4">

                        <span className="whitespace-nowrap text-sm font-black text-slate-900">

                          ₹
                          {Number(
                            item.amount
                          ).toLocaleString(
                            "en-IN"
                          )}

                        </span>

                      </td>


                      {/* ACTION */}

                      <td className="px-5 py-4">

                        <div className="flex items-center justify-center gap-2">

                          {/* EDIT */}

                          <button
                            type="button"
                            onClick={() =>
                              openEditDrawer(
                                item
                              )
                            }
                            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:border-[#bf0000]/30 hover:bg-[#bf0000]/10 hover:text-[#bf0000]"
                            // className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:border-orange-200 hover:bg-orange-50 hover:text-orange-600"
                            title="Edit"
                          >

                            <Pencil
                              size={16}
                            />

                          </button>


                          {/* DELETE */}

                          <button
                            type="button"
                            disabled={
                              deletingId ===
                              item.id
                            }
                            onClick={() =>
                              handleDelete(
                                item
                              )
                            }
                            className="flex h-9 w-9 items-center justify-center rounded-lg border border-red-100 bg-white text-red-500 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                            title="Delete"
                          >

                            <Trash2
                              size={16}
                            />

                          </button>

                        </div>

                      </td>

                    </tr>

                  )
                )

              ) : (

                /* =============================
                   EMPTY STATE
                ============================= */

                <tr>

                  <td
                    // colSpan="5"
                    colSpan="4"
                    className="px-5 py-16 text-center"
                  >

                    <p className="text-sm font-bold text-slate-800">

                      No menu items found

                    </p>


                    <p className="mt-1 text-xs text-slate-400">

                      Click Add Menu to create your first item.

                    </p>

                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>


        {/* =================================
            PAGINATION
        ================================= */}

        <div className="flex flex-col gap-3 border-t border-slate-200 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">

          {/* SHOWING TEXT */}

          <p className="text-xs font-medium text-slate-500">

            Showing{" "}

            {startRow}

            {" - "}

            {endRow}

            {" of "}

            {menuItems.length}

          </p>


          {/* PAGINATION BUTTONS */}

          <div className="flex items-center gap-3">

            {/* PREVIOUS */}

            <button
              type="button"
              disabled={
                currentPage === 1
              }
              onClick={
                previousPage
              }
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >

              <ChevronLeft
                size={17}
              />

            </button>


            {/* PAGE NUMBER */}

            <span className="min-w-[55px] text-center text-sm font-bold text-slate-700">

              {currentPage}

              {" / "}

              {totalPages}

            </span>


            {/* NEXT */}

            <button
              type="button"
              disabled={
                currentPage ===
                totalPages
              }
              onClick={
                nextPage
              }
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >

              <ChevronRight
                size={17}
              />

            </button>

          </div>

        </div>

      </div>


      {/* =====================================
          ADD / EDIT DRAWER
      ===================================== */}

      {drawerOpen && (

        <div className="fixed inset-0 z-[60]">

          {/* OVERLAY */}

          <div
            onClick={
              closeDrawer
            }
            className="absolute inset-0 bg-black/40"
          />


          {/* =================================
              DRAWER
          ================================= */}

          <div className="absolute right-0 top-0 h-full w-full overflow-y-auto bg-white shadow-2xl sm:max-w-[400px]">

            {/* ===============================
                DRAWER HEADER
            =============================== */}

            <div className="flex items-start justify-between border-b border-slate-200 px-5 py-4">

              <div>

                <h3 className="text-lg font-black text-slate-900">

                  {editingId
                    ? "Edit Menu"
                    : "Add Menu"}

                </h3>


                <p className="mt-0.5 text-xs text-slate-500">

                  {editingId
                    ? "Update menu item details"
                    : "Add a new menu item"}

                </p>

              </div>


              {/* CLOSE */}

              <button
                type="button"
                disabled={saving}
                onClick={
                  closeDrawer
                }
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-500 transition hover:bg-slate-200 disabled:opacity-50"
              >

                <X size={18} />

              </button>

            </div>


            {/* ===============================
                FORM
            =============================== */}

            <form
              onSubmit={
                handleSubmit
              }
              className="p-5"
            >

              {/* =============================
                  MENU NAME
              ============================= */}

              <div className="mb-5">

                <label className="mb-2 block text-sm font-bold text-slate-700">

                  Menu Name

                </label>


                <input
                  type="text"
                  name="name"
                  value={
                    form.name
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Enter menu name"
                  className="h-12 w-full rounded-xl border border-slate-300 px-4 text-sm text-slate-800 outline-none transition focus:border-[#bf0000] focus:ring-2 focus:ring-[#bf0000]/10"
                  // className="h-12 w-full rounded-xl border border-slate-300 px-4 text-sm text-slate-800 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                />

              </div>


              {/* =============================
                  PORTION
              ============================= */}
{/* 
              <div className="mb-5">

                <label className="mb-2 block text-sm font-bold text-slate-700">

                  Portion

                </label>


                <select
                  name="portion"
                  value={
                    form.portion
                  }
                  onChange={
                    handlePortionChange
                  }
                  className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-800 outline-none transition focus:border-[#bf0000] focus:ring-2 focus:ring-[#bf0000]/10"
                  // className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-800 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                >

                  {portions.map(
                    (portion) => (

                      <option
                        key={
                          portion
                        }
                        value={
                          portion
                        }
                      >

                        {portion}

                      </option>

                    )
                  )}


                  <option value="Other">

                    Other

                  </option>

                </select>


                {form.portion ===
                  "Other" && (

                  <input
                    type="text"
                    value={
                      customPortion
                    }
                    onChange={(
                      event
                    ) =>
                      setCustomPortion(
                        event.target
                          .value
                      )
                    }
                    maxLength={50}
                    placeholder="Enter portion name"
                    className="mt-3 h-12 w-full rounded-xl border border-slate-300 px-4 text-sm text-slate-800 outline-none transition focus:border-[#bf0000] focus:ring-2 focus:ring-[#bf0000]/10"
                    // className="mt-3 h-12 w-full rounded-xl border border-slate-300 px-4 text-sm text-slate-800 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                  />

                )}

              </div> */}


              {/* =============================
                  AMOUNT
              ============================= */}

              <div className="mb-5">

                <label className="mb-2 block text-sm font-bold text-slate-700">

                  Amount

                </label>


                <input
                  type="number"
                  name="amount"
                  min="1"
                  step="0.01"
                  value={
                    form.amount
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Enter amount"
                  className="h-12 w-full rounded-xl border border-slate-300 px-4 text-sm text-slate-800 outline-none transition focus:border-[#bf0000] focus:ring-2 focus:ring-[#bf0000]/10"
                  // className="h-12 w-full rounded-xl border border-slate-300 px-4 text-sm text-slate-800 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                />

              </div>


              {/* =============================
                  FORM ERROR
              ============================= */}

              {error && (

                <div className="mb-5 rounded-lg bg-red-50 px-3 py-3 text-sm font-medium leading-5 text-red-600">

                  {error}

                </div>

              )}


              {/* =============================
                  SAVE / UPDATE BUTTON
              ============================= */}

              <button
                type="submit"
                disabled={saving}
                className="flex h-12 w-full items-center justify-center rounded-xl bg-[#bf0000] text-sm font-bold text-white transition hover:bg-[#a50000] disabled:cursor-not-allowed disabled:opacity-60"
                // className="flex h-12 w-full items-center justify-center rounded-xl bg-orange-500 text-sm font-bold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
              >

                {saving
                  ? (
                    editingId
                      ? "Updating..."
                      : "Saving..."
                  )
                  : (
                    editingId
                      ? "Update Menu"
                      : "Save Menu"
                  )}

              </button>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}

