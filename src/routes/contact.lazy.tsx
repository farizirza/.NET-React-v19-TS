import { createLazyFileRoute } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import postContact from "../api/postContact";
import type { SubmitEvent } from "react";

export const Route = createLazyFileRoute("/contact")({
  component: ContactRoute,
});

function getString(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function ContactRoute() {
  const mutation = useMutation({
    mutationFn: function (e: SubmitEvent<HTMLFormElement>) {
      e.preventDefault();
      const formData = new FormData(e.target);
      return postContact(
        getString(formData, "name"),
        getString(formData, "email"),
        getString(formData, "message"),
      );
    },
  });

  const fieldClass =
    "my-3.75 w-full max-w-125 rounded-[5px] border-2 border-border p-2 outline-none focus:border-primary bg-white";

  return (
    <div>
      <h2>Contact</h2>
      {mutation.isSuccess ? (
        <h3 className="m-12.5 text-center font-pacifico text-[30px] font-normal text-secondary">
          Submitted!
        </h3>
      ) : (
        <form
          className="flex flex-col items-center"
          onSubmit={mutation.mutate}
        >
          <input
            name="name"
            placeholder="Name"
            className={`${fieldClass} disabled:bg-[#999]`}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            className={`${fieldClass} disabled:bg-[#999]`}
          />
          <textarea
            placeholder="Message"
            name="message"
            className={`${fieldClass} min-h-50`}
          ></textarea>
          <button className="btn">Submit</button>
        </form>
      )}
    </div>
  );
}