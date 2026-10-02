import { expect, test, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import createFetchMock from "vitest-fetch-mock";
import { Provider } from "react-redux";
import { makeStore } from "../store";
import { usePizzaOfTheDay } from "../usePizzaOfTheDay";

const fetchMocker = createFetchMock(vi);
fetchMocker.enableMocks();

beforeEach(() => {
  fetchMocker.resetMocks();
});

const testPizza = {
  id: "calabrese",
  name: "The Calabrese Pizza",
  category: "Supreme",
  description:
    "Salami, Pancetta, Tomatoes, Red Onions, Friggitello Peppers, Garlic",
  image: "/public/pizzas/calabrese.webp",
  sizes: { S: 12.25, M: 16.25, L: 20.25 },
};

test("to be null on initial load", () => {
  fetchMocker.mockResponseOnce(JSON.stringify(testPizza));
  const { result } = renderHook(() => usePizzaOfTheDay(), {
    wrapper: ({ children }) => (
      <Provider store={makeStore()}>{children}</Provider>
    ),
  });
  expect(result.current).toBeNull();
});

test("to call the API and give back the pizza of the day", async () => {
  fetchMocker.mockResponseOnce(JSON.stringify(testPizza));
  const { result } = renderHook(() => usePizzaOfTheDay(), {
    wrapper: ({ children }) => (
      <Provider store={makeStore()}>{children}</Provider>
    ),
  });
  await waitFor(() => {
    expect(result.current).toEqual(testPizza);
  });
  expect(fetchMocker.requests().length).toBe(1);
  expect(fetchMocker.requests()[0].url).toBe("/api/pizza-of-the-day");
});