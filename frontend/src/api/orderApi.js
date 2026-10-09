import axiosClient from "./axiosClient";

/* =========================================
   GET PAID ORDERS
========================================= */

export const getOrdersApi = () => {
  return axiosClient.get(
    "/orders"
  );
};


export const downloadOrdersPdfApi = async (orderIds) => {
  return axiosClient.post(
    "/orders/download-pdf",
    { orderIds },
    {
      responseType: "blob",
    }
  );
};