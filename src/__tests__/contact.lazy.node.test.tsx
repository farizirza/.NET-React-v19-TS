import { render } from "@testing-library/react";
import { expect, test, vi, beforeEach } from "vitest";
import createFetchMock from "vitest-fetch-mock";
import { Provider } from "react-redux";
import { makeStore } from "../store";
import { Route } from "../routes/contact.lazy";

const fetchMocker = createFetchMock(vi);
fetchMocker.enableMocks();

beforeEach(() => {
  fetchMocker.resetMocks();
});

test("can submit contact form", async () => {
  fetchMocker.mockResponse(JSON.stringify({ status: "ok" }));
  const ContactRoute = Route.options.component;
  if (!ContactRoute) {
    throw new Error("Contact route component is not defined");
  }
  const screen = render(
    <Provider store={makeStore()}>
      <ContactRoute />
    </Provider>,
  );

  const nameInput = screen.getByPlaceholderText("Name") as HTMLInputElement;
  const emailInput = screen.getByPlaceholderText("Email") as HTMLInputElement;
  const msgTextArea = screen.getByPlaceholderText(
    "Message",
  ) as HTMLTextAreaElement;

  const testData = {
    name: "Brian",
    email: "test@example.com",
    message: "This is a test message",
  };

  nameInput.value = testData.name;
  emailInput.value = testData.email;
  msgTextArea.value = testData.message;

  const btn = screen.getByRole("button");

  btn.click();

  const h3 = await screen.findByRole("heading", { level: 3 });

  expect(h3.innerText).toContain("Submitted");

  const requests = fetchMocker.requests();
  expect(requests.length).toBe(1);
  expect(requests[0].url).toBe("/api/contact");
  expect(requests[0].method).toBe("POST");
  expect(requests[0].headers.get("Content-Type")).toBe("application/json");
  expect(await requests[0].json()).toEqual(testData);
});