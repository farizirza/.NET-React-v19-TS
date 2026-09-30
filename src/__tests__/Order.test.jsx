import { render } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import createFetchMock from "vitest-fetch-mock";
import { CartContext } from "../contexts";
import { Route } from "../routes/order.lazy";

const fetchMocker = createFetchMock(vi);
fetchMocker.enableMocks();

test("loads pizzas, adds a pizza to cart, and checks out", async () => {
  const mockPizzas = [
    {
      id: "pepperoni",
      name: "The Pepperoni Pizza",
      category: "Classic",
      description: "Mozzarella, Pepperoni",
      image: "/public/pizzas/pepperoni.webp",
      sizes: { S: 9.75, M: 12.5, L: 15.25 },
    },
  ];

  fetchMocker.mockResponses(
    [JSON.stringify(mockPizzas), { status: 200 }],
    [JSON.stringify({ status: "success" }), { status: 200 }],
  );

  let cartState = [];
  const setCartState = (newCart) => {
    cartState = typeof newCart === "function" ? newCart(cartState) : newCart;
  };

  const screen = render(
    <CartContext.Provider value={[cartState, setCartState]}>
      <Route.options.component />
    </CartContext.Provider>,
  );

  const pizzaSelect = await screen.findByRole("combobox");
  expect(pizzaSelect).toBeDefined();

  const addToCartBtn = screen.getByRole("button", { name: /Add to Cart/i });
  addToCartBtn.click();

  const checkoutBtn = await screen.findByRole("button", { name: /Checkout/i });
  expect(checkoutBtn).toBeDefined();

  checkoutBtn.click();

  const requests = fetchMocker.requests();
  expect(requests.length).toBe(2);
  expect(requests[1].url).toBe("/api/order");
  expect(requests[1].method).toBe("POST");
});
