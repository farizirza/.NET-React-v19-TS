import { useState } from "react";
import { createLazyFileRoute } from "@tanstack/react-router";
import Cart from "../Cart";
import Pizza from "../Pizza";
import type { Pizza as PizzaType, PizzaSize } from "../APIResponsesTypes";
import { useAppDispatch, useAppSelector } from "../hooks";
import { addToCart, clearCart, selectCartItems } from "../cartSlice";
import {
  setPizzaType,
  setPizzaSize,
  selectPizzaType,
  selectPizzaSize,
} from "../orderSlice";
import { useGetPizzasQuery, usePlaceOrderMutation } from "../api/pizzaApi";

// feel free to change en-US / USD to your locale
const intl = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export const Route = createLazyFileRoute("/order")({
  component: Order,
});

function Order() {
  const pizzaType = useAppSelector(selectPizzaType);
  const pizzaSize = useAppSelector(selectPizzaSize);
  const { data: pizzaTypes = [], isLoading: isLoadingPizzas } =useGetPizzasQuery();
  const [placeOrder, { isLoading: isPlacingOrder }] = usePlaceOrderMutation();
  const loading = isLoadingPizzas || isPlacingOrder;
  const cart = useAppSelector(selectCartItems);
  const dispatch = useAppDispatch();

  async function checkout() {
    await placeOrder(cart);
    dispatch(clearCart());
}

  let price: string | undefined;
  let selectedPizza: PizzaType | undefined;
  if (!loading) {
    selectedPizza = pizzaTypes.find((pizza) => pizzaType === pizza.id);
    price = selectedPizza
      ? intl.format(selectedPizza.sizes[pizzaSize])
      : undefined;
  }

  const sizeLabelClass =
    "mx-3.75 mb-2.5 inline-flex h-20 w-20 cursor-pointer items-center justify-center rounded-[5px] border border-[#999] bg-border text-[#999] peer-checked:bg-white peer-checked:text-[#333] peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-primary";

  return (
    <div className="mx-auto grid max-w-325 grid-cols-1 gap-12.5 lg:grid-cols-[2fr_1fr]">
      <div className="w-full lg:ml-[5%]">
        <h2>Create Order</h2>
        <form
          className="flex flex-col md:flex-row md:justify-between"
          onSubmit={(e) => {
            e.preventDefault();
            if (!selectedPizza || !price) {
              return;
            }
            dispatch(
              addToCart({ pizza: selectedPizza, size: pizzaSize, price }),
            );
          }}
        >
          <div className="my-2.5 w-full border-b border-border p-3.75 text-center md:border-r md:border-b-0">
            <div className="my-2.5 text-center">
              <label
                htmlFor="pizza-type"
                className="mb-2.5 block text-[20px] text-secondary"
              >
                Pizza Type
              </label>
              <select
                className="form-select mb-7.5 block w-full py-1.25 pl-1.25 text-[16px]"
                onChange={(e) => dispatch(setPizzaType(e.target.value))}
                name="pizza-type"
                value={pizzaType}
              >
                {pizzaTypes.map((pizza) => (
                  <option key={pizza.id} value={pizza.id}>
                    {pizza.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="my-2.5 text-center">
              <label
                htmlFor="pizza-size"
                className="mb-2.5 block text-[20px] text-secondary"
              >
                Pizza Size
              </label>
              <div className="my-2.5 text-center">
                <span>
                  <input
                    onChange={(e) =>
                      dispatch(setPizzaSize(e.target.value as PizzaSize))
                    }
                    checked={pizzaSize === "S"}
                    className="peer sr-only"
                    type="radio"
                    name="pizza-size"
                    value="S"
                    id="pizza-s"
                  />
                  <label htmlFor="pizza-s" className={sizeLabelClass}>
                    Small
                  </label>
                </span>
                <span>
                  <input
                    onChange={(e) =>
                      dispatch(setPizzaSize(e.target.value as PizzaSize))
                    }
                    checked={pizzaSize === "M"}
                    className="peer sr-only"
                    type="radio"
                    name="pizza-size"
                    value="M"
                    id="pizza-m"
                  />
                  <label htmlFor="pizza-m" className={sizeLabelClass}>
                    Medium
                  </label>
                </span>
                <span>
                  <input
                    onChange={(e) =>
                      dispatch(setPizzaSize(e.target.value as PizzaSize))
                    }
                    checked={pizzaSize === "L"}
                    className="peer sr-only"
                    type="radio"
                    name="pizza-size"
                    value="L"
                    id="pizza-l"
                  />
                  <label htmlFor="pizza-l" className={sizeLabelClass}>
                    Large
                  </label>
                </span>
              </div>
            </div>
            <button type="submit" className="btn">
              Add to Cart
            </button>
          </div>
          {loading || !selectedPizza ? (
            <h3 className="text-[1.17em] font-bold">LOADING …</h3>
          ) : (
            <div className="my-2.5 w-full p-3.75 text-center md:ml-6.25">
              <Pizza
                name={selectedPizza.name}
                description={selectedPizza.description}
                image={selectedPizza.image}
              />
              <p>{price}</p>
            </div>
          )}
        </form>
      </div>
      {loading ? <h2>LOADING …</h2> : <Cart checkout={() => void checkout()} cart={cart} />}
    </div>
  );
}
