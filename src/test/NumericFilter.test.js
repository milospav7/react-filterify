import { screen } from "@testing-library/react";
import NumericFilter from "../components/NumericFilter";
import { render } from "../test-utils";

test("Numeric filter with label", () => {
  render(
    <NumericFilter
      containerId="F2_Test"
      withAssociatedLabel
      label="Year when joined"
      filteringProperty="YearJoined"
      placeholder="Datetime when joined.."
    />
  );
  expect(
    screen.getByPlaceholderText(/datetime when joined/i)
  ).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/datetime when joined/i)).toHaveValue(null);
  expect(screen.getByText(/year when joined/i)).toBeInTheDocument();
});

test("Numeric filter without label", () => {
  render(
    <NumericFilter
      containerId="F2_Test"
      filteringProperty="YearJoined"
      placeholder="Datetime when joined.."
    />
  );
  expect(screen.queryByText(/year when joined/i)).not.toBeInTheDocument(); // ** getByText will throw error if nothing found
  expect(
    screen.getByPlaceholderText(/datetime when joined/i)
  ).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/datetime when joined/i)).toHaveValue(null);
});

// To throw error without container id
