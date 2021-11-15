import React from "react";
import { screen } from "@testing-library/react";
import TextFilter from "../components/TextFilter";
import { render } from "../test-utils";

test("Text filter with label", () => {
  render(
    <TextFilter
      withAssociatedLabel
      label="User name"
      filteringProperty="UserName"
      displayName="User name"
      containerId="F2_Test"
      placeholder="Search for user.."
    />
  );
  expect(screen.getByPlaceholderText(/search for user/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/search for user/i)).toHaveValue("");
  expect(screen.getByText(/user name/i)).toBeInTheDocument();
});

test("Text filter without label", () => {
  render(
    <TextFilter
      filteringProperty="UserName"
      containerId="F2_Test"
      placeholder="Search for user.."
    />
  );
  expect(screen.queryByText(/user name/i)).not.toBeInTheDocument(); // ** getByText will throw error if nothing found
  expect(screen.getByPlaceholderText(/search for user/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/search for user/i)).toHaveValue("");
});
