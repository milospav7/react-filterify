import { screen } from "@testing-library/react";
import TextFilter from "../components/TextFilter";
import { CONTAINER_IDS } from "../store/store";
import { render } from "../test-utils";

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

// To throw error without container id
