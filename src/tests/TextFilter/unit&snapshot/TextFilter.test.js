import { fireEvent, screen } from "@testing-library/react";
import TextFilter from "../../../components/TextFilter";
import { CONTAINER_IDS } from "../../../store/store";
import { render, rtrCreate } from "../../../test-utils";

/** UNIT TESTING */
test("Text filter with label", () => {
  render(
    <TextFilter
      withAssociatedLabel
      label="User name"
      filteringProperty="UserName"
      displayName="User name"
      containerId={CONTAINER_IDS.C2_Test}
      placeholder="Search for user.."
    />
  );
  expect(screen.getByText(/user name/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/search for user/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/search for user/i)).toHaveValue("");
});

test("Text filter without label", () => {
  render(
    <TextFilter
      filteringProperty="UserName"
      containerId={CONTAINER_IDS.C2_Test}
      placeholder="Search for user.."
    />
  );
  expect(screen.queryByText(/user name/i)).not.toBeInTheDocument(); // ** getByText will throw error if nothing found
  expect(screen.getByPlaceholderText(/search for user/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/search for user/i)).toHaveValue("");
});

test("Operators menu will be rendered when toggle button clicked", () => {
  render(
    <TextFilter
      filteringProperty="UserName"
      containerId={CONTAINER_IDS.C2_Test}
      placeholder="Search for user.."
    />
  );
  fireEvent.click(screen.getByTestId(`${CONTAINER_IDS.C2_Test}-oprs-menu-btn`));
  expect(screen.queryByText("Contains")).toBeInTheDocument();
});

// To throw error without container id

/** SNAPSHOT TESTING */
test("Render TextFilter as expected", () => {
  const filter = rtrCreate(
    <TextFilter
      filteringProperty="UserName"
      containerId={CONTAINER_IDS.C2_Test}
      placeholder="Search for user.."
    />
  ).toJSON();

  expect(filter).toMatchSnapshot();
});
