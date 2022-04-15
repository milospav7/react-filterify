import { fireEvent, screen } from "@testing-library/react";
import NumericFilter from "../../../components/NumericFilter/NumericFilter";
import { CONTAINER_IDS } from "../../../store/store";
import { render, rtrCreate } from "../../../test-utils";

/** UNIT TESTING */
test("Numeric filter with label", () => {
  render(
    <NumericFilter
      containerId={CONTAINER_IDS.C2_Test}
      withLabel
      label="Year when joined"
      filteringProperty="YearJoined"
      placeholder="Datetime when joined.."
    />
  );
  expect(
    screen.getByPlaceholderText(/datetime when joined/i)
  ).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/datetime when joined/i)).toHaveValue(
    null
  );
  expect(screen.getByText(/year when joined/i)).toBeInTheDocument();
});

test("Numeric filter without label", () => {
  render(
    <NumericFilter
      containerId={CONTAINER_IDS.C2_Test}
      filteringProperty="YearJoined"
      placeholder="Datetime when joined.."
    />
  );
  expect(screen.queryByText(/year when joined/i)).not.toBeInTheDocument(); // ** getByText will throw error if nothing found
  expect(
    screen.getByPlaceholderText(/datetime when joined/i)
  ).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/datetime when joined/i)).toHaveValue(
    null
  );
});

test("Operators menu will be displayed when toggle button clicked", () => {
  render(
    <NumericFilter
      containerId={CONTAINER_IDS.C2_Test}
      filteringProperty="YearJoined"
      placeholder="Datetime when joined.."
    />
  );
  fireEvent.click(screen.getByTestId(`${CONTAINER_IDS.C2_Test}-oprs-menu-btn`));
  expect(screen.queryByText("Equal")).toBeInTheDocument();
});

// To throw error without container id

/** SNAPSHOT TESTING */
it("Render NumericFilter as expected", () => {
  const filter = rtrCreate(
    <NumericFilter
      containerId={CONTAINER_IDS.C2_Test}
      filteringProperty="YearJoined"
      placeholder="Datetime when joined.."
    />
  ).toJSON();

  expect(filter).toMatchSnapshot();
});
