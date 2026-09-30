// import { render, cleanup } from "@testing-library/react";
// import { afterEach, expect, test } from "vitest";
// import Cart from "../Cart";
// import {
//   createRootRoute,
//   createRouter,
//   RouterProvider,
// } from "@tanstack/react-router";
// import Header from "../Header";
// import { CartContext } from "../contexts";

// afterEach(cleanup);

// test("renders cart items and calculates total price", () => {
//   const checkoutMock = () => {};
//   const mockCart = [
//     {
//       pizza: {
//         id: "pepperoni",
//         name: "The Pepperoni Pizza",
//         sizes: { S: 10, M: 14, L: 18 },
//       },
//       size: "M",
//       price: "$14.00",
//     },
//     {
//       pizza: {
//         id: "bbq_ckn",
//         name: "The Barbecue Chicken Pizza",
//         sizes: { S: 12, M: 16, L: 20 },
//       },
//       size: "L",
//       price: "$20.00",
//     },
//   ];

//   const screen = render(<Cart cart={mockCart} checkout={checkoutMock} />);

//   const items = screen.getAllByRole("listitem");
//   expect(items.length).toBe(2);

//   expect(screen.getByText(/The Pepperoni Pizza/i)).toBeDefined();
//   expect(screen.getByText(/The Barbecue Chicken Pizza/i)).toBeDefined();
//   expect(screen.getByText(/Total: \$34\.00/i)).toBeDefined();
// });

// test("displays correct number of items in the cart badge", async () => {
//   const mockCart = [
//     { pizza: { name: "Pepperoni" }, size: "M" },
//     { pizza: { name: "Hawaiian" }, size: "S" },
//     { pizza: { name: "Veggie" }, size: "L" },
//   ];

//   const rootRoute = createRootRoute({
//     component: () => <Header />,
//   });

//   const router = createRouter({ routeTree: rootRoute });

//   const screen = render(
//     <CartContext.Provider value={[mockCart, () => {}]}>
//       <RouterProvider router={router} />
//     </CartContext.Provider>,
//   );

//   const cartBadge = await screen.findByText("3");
//   expect(cartBadge).toBeDefined();
//   expect(cartBadge.className).toBe("nav-cart-number");
// });