import { useState } from "react";
import { skipToken, useQuery } from "@tanstack/react-query";
import { createLazyFileRoute } from "@tanstack/react-router";
import getPastOrders from "../api/getPastOrders";
import getPastOrder from "../api/getPastOrder";
import Modal from "../Modal";
import ErrorBoundary from "../ErrorBoundary";
import type { PastOrderDetail } from "../APIResponsesTypes";

export const Route = createLazyFileRoute("/past")({
  component: ErrorBoundaryWrappedPastOrderRoutes,
});

const intl = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

// Reusable styling class constants
const tableClass =
  "w-full border-collapse my-6.25 text-[0.9em] font-sans border border-[#ddd] sm:min-w-100";
const headRowClass = "bg-secondary text-white text-left";
const bodyRowClass =
  "border-b border-[#ddd] even:bg-[#f6fef0] last:border-b-2 last:border-secondary";
const cellClass = "px-[15px] py-3 text-center";

function ErrorBoundaryWrappedPastOrderRoutes() {
  return (
    <ErrorBoundary>
      <PastOrdersRoute />
    </ErrorBoundary>
  );
}

function PastOrdersRoute() {
  const [page, setPage] = useState(1);
  const [focusedOrder, setFocusedOrder] = useState<number>();
  const { isLoading, data } = useQuery({
    queryKey: ["past-orders", page],
    queryFn: () => getPastOrders(page),
    staleTime: 30000,
  });

  const { data: pastOrderData } = useQuery<PastOrderDetail>({
    queryKey: ["past-order", focusedOrder],
    queryFn: focusedOrder ? () => getPastOrder(focusedOrder) : skipToken,
  });

  if (isLoading) {
    return (
      <div className="mx-auto min-h-162.5 w-[90%] max-w-225">
        <h2>LOADING …</h2>
      </div>
    );
  }

  if (!data) {
    throw new Error("Past orders could not be loaded");
  }

  return (
    <div className="mx-auto min-h-162.5 w-[90%] max-w-225">
      <table className={tableClass}>
        <thead>
          <tr className={headRowClass}>
            <th className={cellClass}>ID</th>
            <th className={cellClass}>Date</th>
            <th className={cellClass}>Time</th>
          </tr>
        </thead>
        <tbody>
          {data.map((order) => (
            <tr key={order.order_id} className={bodyRowClass}>
              <td className={cellClass}>
                <button
                  className="btn"
                  onClick={() => setFocusedOrder(order.order_id)}
                >
                  {order.order_id}
                </button>
              </td>
              <td className={cellClass}>{order.date}</td>
              <td className={cellClass}>{order.time}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex items-center justify-evenly">
        <button
          className="btn"
          disabled={page <= 1}
          onClick={() => setPage(page - 1)}
        >
          Previous
        </button>
        <div className="font-serif text-[20px] text-primary">{page}</div>
        <button
          className="btn"
          disabled={data.length < 10}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>
      {focusedOrder ? (
        <Modal>
          <h2>Order #{focusedOrder}</h2>
          {pastOrderData ? (
            <table className={tableClass}>
              <thead>
                <tr className={headRowClass}>
                  <th className={cellClass}>Image</th>
                  <th className={cellClass}>Name</th>
                  <th className={cellClass}>Size</th>
                  <th className={cellClass}>Quantity</th>
                  <th className={cellClass}>Price</th>
                  <th className={cellClass}>Total</th>
                </tr>
              </thead>
              <tbody>
                {pastOrderData.orderItems.map((pizza) => (
                  <tr
                    key={`${pizza.pizzaTypeId}_${pizza.size}`}
                    className={bodyRowClass}
                  >
                    <td className={cellClass}>
                      <img
                        className="mx-auto w-[50px]"
                        src={pizza.image}
                        alt={pizza.name}
                      />
                    </td>
                    <td className={cellClass}>{pizza.name}</td>
                    <td className={cellClass}>{pizza.size}</td>
                    <td className={cellClass}>{pizza.quantity}</td>
                    <td className={cellClass}>{intl.format(pizza.price)}</td>
                    <td className={cellClass}>{intl.format(pizza.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>Loading …</p>
          )}
          <button className="btn" onClick={() => setFocusedOrder(undefined)}>
            Close
          </button>
        </Modal>
      ) : null}
    </div>
  );
}