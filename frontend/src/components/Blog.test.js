import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Blog from "./Blog";

test("renders title and user by default", () => {
  const blog = {
    title: "Test blog",
    author: "xyl",
    url: "www.test.com",
    likes: "0",
    user: "wrong",
  };

  const { container } = render(<Blog blog={blog} />);

  const divDefault = container.querySelector(".default");
  const divDetailed = container.querySelector(".detailed");

  expect(divDefault).not.toHaveStyle("display: none");
  expect(divDetailed).toHaveStyle("display: none");
});

test("renders detail when view button is pressed", async () => {
  const blog = {
    title: "Test blog",
    author: "xyl",
    url: "www.test.com",
    likes: "0",
    user: "wrong",
  };

  const { container } = render(<Blog blog={blog} />);

  const user = userEvent.setup();
  const button = screen.getByText("view");
  await user.click(button);

  const divDefault = container.querySelector(".default");
  const divDetailed = container.querySelector(".detailed");

  expect(divDefault).toHaveStyle("display: none");
  expect(divDetailed).not.toHaveStyle("display: none");
});

test("event handler is called when like button is clicked", async () => {
  const blog = {
    title: "Test blog",
    author: "xyl",
    url: "www.test.com",
    likes: "0",
    user: "wrong",
  };

  const mockHandler = jest.fn();

  render(<Blog blog={blog} increaseLikes={mockHandler} />);

  const user = userEvent.setup();
  const button = screen.getByText("like");
  await user.click(button);
  await user.click(button);

  expect(mockHandler.mock.calls).toHaveLength(2);
});
