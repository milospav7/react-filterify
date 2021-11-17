import React from "react";
import { screen } from "@testing-library/react";
import { render } from "../test-utils";
import DropdownFilter from "../components/DropdownFilter";

test("Dropdown filter with label", () => {
  render(
    <DropdownFilter
      withAssociatedLabel
      label="User status"
      size="sm"
      containerId="F2_Test"
      filteringProperty="UserStatus"
      options={["Active", "Inactive", "Banned"].map((v) => ({
        label: v,
        value: v,
      }))}
      isMulti
      isClearable
      placeholder="Select status.."
    />
  );
  expect(
    screen.getByText(/select status/i)
  ).toBeInTheDocument();
  expect(screen.getByText(/user status/i)).toBeInTheDocument();
});

test("Dropdown filter without label", () => {
  render(
    <DropdownFilter
      size="sm"
      containerId="F2_Test"
      filteringProperty="UserStatus"
      options={["Active", "Inactive", "Banned"].map((v) => ({
        label: v,
        value: v,
      }))}
      isMulti
      isClearable
      placeholder="Select status.."
    />
  );
  expect(screen.queryByText(/user status/i)).not.toBeInTheDocument(); // ** getByText will throw error if nothing found
  expect(screen.getByText(/select status/i)).toBeInTheDocument();
});

// To throw error without container id
