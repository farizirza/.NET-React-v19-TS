import { usePizzaOfTheDay } from "./usePizzaOfTheDay";

// feel free to change en-US / USD to your locale
const intl = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const PizzaOfTheDay = () => {
  const pizzaOfTheDay = usePizzaOfTheDay();

  if (!pizzaOfTheDay) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full border-t border-border mt-12.5">
      <h2 className="text-center">Pizza of the Day</h2>
      <div className="flex items-center justify-center">
        <div className="mr-7.5 leading-loose text-center">
          <h3>{pizzaOfTheDay.name}</h3>
          <p>{pizzaOfTheDay.description}</p>
          <p>
            From: <span>{intl.format(pizzaOfTheDay.sizes.S)}</span>
          </p>
        </div>
        <img
          className="max-w-50 rounded-[5px] border border-border"
          src={pizzaOfTheDay.image}
          alt={pizzaOfTheDay.name}
        />
      </div>
    </div>
  );
};

export default PizzaOfTheDay;