import { useDebugValue } from "react";
import { useGetPizzaOfTheDayQuery } from "./api/pizzaApi";

export const usePizzaOfTheDay = () => {
  const { data } = useGetPizzaOfTheDayQuery();
  useDebugValue(data ? `${data.name}` : "Loading...");

  return data ?? null;
};