import { useState, useEffect, useContext } from "react";
import { createLazyFileRoute } from "@tanstack/react-router";
import { CartContext } from "../contexts";
import Cart from "../Cart";
import Pizza from "../Pizza";
import type { Pizza as PizzaType, PizzaSize } from "../APIResponsesTypes";

// feel free to change en-US / USD to your locale
const intl = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export const Route = createLazyFileRoute("/order")({
  component: Order,
});

function Order() {
  const [pizzaType, setPizzaType] = useState("pepperoni");
  const [pizzaSize, setPizzaSize] = useState<PizzaSize>("M");
  const [pizzaTypes, setPizzaTypes] = useState<PizzaType[]>([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useContext(CartContext);

  async function checkout() {
    setLoading(true);

    await fetch("/api/order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cart,
      }),
    });

    setCart([]);
    setLoading(false);
  }

  let price: string | undefined;
  let selectedPizza: PizzaType | undefined;
  if (!loading) {
    selectedPizza = pizzaTypes.find((pizza) => pizzaType === pizza.id);
    price = selectedPizza
      ? intl.format(selectedPizza.sizes[pizzaSize])
      : undefined;
  }

  useEffect(() => {
    void fetchPizzaTypes();
  }, []);

  async function fetchPizzaTypes() {
    const pizzasRes = await fetch("/api/pizzas");
    const pizzasJson = (await pizzasRes.json()) as PizzaType[];
    setPizzaTypes(pizzasJson);
    setLoading(false);
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
            setCart([
              ...cart,
              { pizza: selectedPizza, size: pizzaSize, price },
            ]);
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
                onChange={(e) => setPizzaType(e.target.value)}
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
                    onChange={(e) => setPizzaSize(e.target.value as PizzaSize)}
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
                    onChange={(e) => setPizzaSize(e.target.value as PizzaSize)}
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
                    onChange={(e) => setPizzaSize(e.target.value as PizzaSize)}
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
            <h3>LOADING …</h3>
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
