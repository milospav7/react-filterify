import { screen } from "@testing-library/react";
import DropdownFilter from "../../../components/DropdownFilter";
import { CONTAINER_IDS } from "../../../store/store";
import { render, rtrCreate } from "../../../test-utils";

/** UNIT TESTING */
test("Dropdown filter with label", () => {
  render(
    <DropdownFilter
      withAssociatedLabel
      label="User status"
      size="sm"
      containerId={CONTAINER_IDS.C2_Test}
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
  expect(screen.getByText(/select status/i)).toBeInTheDocument();
  expect(screen.getByText(/user status/i)).toBeInTheDocument();
});

test("Dropdown filter without label", () => {
  render(
    <DropdownFilter
      size="sm"
      containerId={CONTAINER_IDS.C2_Test}
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

/** SNAPSHOT TESTING */
it("Render DropdownFilter as expected", () => {
  const filter = rtrCreate(
    <DropdownFilter
      size="sm"
      containerId={CONTAINER_IDS.C2_Test}
      filteringProperty="UserStatus"
      options={["Active", "Inactive", "Banned"].map((v) => ({
        label: v,
        value: v,
      }))}
      isMulti
      isClearable
      placeholder="Select status.."
    />
  ).toJSON();

  expect(filter).toMatchSnapshot();
});
