import { createLazyFileRoute, Link } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className="mx-auto my-30 grid max-w-175 grid-cols-1 gap-7.5 sm:grid-cols-2">
      <div className="flex flex-col">
        <h1 className="font-serif font-normal text-primary">Padre Gino's</h1>
        <p className="max-w-78.75 text-[40px] font-bold uppercase text-secondary">
          Pizza & Art at a location near you
        </p>
      </div>
      <ul className="flex flex-col items-center justify-center">
        <li className="w-full max-w-62.5">
          <Link to="/order" className="btn mb-2.5 w-full max-w-62.5 text-center">
            Order
          </Link>
        </li>
        <li className="w-full max-w-62.5">
          <Link to="/past" className="btn mb-2.5 w-full max-w-62.5 text-center">
            Past Orders
          </Link>
        </li>
        <li className="w-full max-w-62.5">
          <Link to="/contact" className="btn mb-2.5 w-full max-w-62.5 text-center">
            Contact
          </Link>
        </li>
      </ul>
    </div>
  );
}