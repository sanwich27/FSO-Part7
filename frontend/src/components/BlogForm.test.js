import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BlogForm from "./BlogForm";

test("Create note called with the right input", async () => {
  const mockHandler = jest.fn();
  render(<BlogForm createBlog={mockHandler} />);

  const titleInput = screen.getByPlaceholderText("enter the title");
  const authorInput = screen.getByPlaceholderText("enter the author");
  const urlInput = screen.getByPlaceholderText("enter the url");
  const submitButton = screen.getByText("create");

  const user = userEvent.setup();
  await user.type(titleInput, "testing a form...");
  await user.type(authorInput, "xyl");
  await user.type(urlInput, "www.uh.com");
  await user.click(submitButton);

  expect(mockHandler.mock.calls).toHaveLength(1);
  expect(mockHandler.mock.calls[0][0]).toEqual({
    title: "testing a form...",
    author: "xyl",
    url: "www.uh.com",
  });
});
