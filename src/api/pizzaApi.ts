import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { PastOrder, PastOrderDetail, Pizza } from "../APIResponsesTypes";
import type { CartItem } from "../cartSlice";

export const pizzaApi = createApi({
  reducerPath: "pizzaApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["PastOrders"],
  endpoints: (build) => ({
    getPizzas: build.query<Pizza[], void>({
      query: () => "pizzas",
    }),
    getPizzaOfTheDay: build.query<Pizza, void>({
      query: () => "pizza-of-the-day",
    }),
    getPastOrders: build.query<PastOrder[], number>({
      query: (page) => `past-orders?page=${page}`,
      providesTags: ["PastOrders"],
    }),
    getPastOrder: build.query<PastOrderDetail, number>({
      query: (order) => `past-order/${order}`,
      keepUnusedDataFor: 24 * 60 * 60, // one day, in seconds
    }),
    placeOrder: build.mutation<unknown, CartItem[]>({
      query: (cart) => ({
        url: "order",
        method: "POST",
        body: { cart },
      }),
      // a new order changes the past-orders list
      invalidatesTags: ["PastOrders"],
    }),
  }),
});

export const {
  useGetPizzasQuery,
  useGetPizzaOfTheDayQuery,
  useGetPastOrdersQuery,
  useGetPastOrderQuery,
  usePlaceOrderMutation,
} = pizzaApi;