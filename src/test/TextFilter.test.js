import React from "react";
import { screen } from "@testing-library/react";
import TextFilter from "../components/TextFilter";
import { render } from "../test-utils";

test("User filters", () => {
  render(
    <TextFilter
      withAssociatedLabel
      label="User name"
      filteringProperty="UserName"
      displayName="User name"
      containerId="F2_Test"
    />
  );
  expect(screen.getByPlaceholderText("User name")).toBeInTheDocument();
  expect(screen.getByPlaceholderText("User name")).toHaveValue("");
});
