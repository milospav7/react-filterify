import { screen } from "@testing-library/react";
import ButtonGroupFilter from "../../../components/ButtonGroupFilter";
import { CONTAINER_IDS } from "../../../store/store";
import { render } from "../../../test-utils";

test("Button group filter with label", () => {
  render(
    <ButtonGroupFilter
      containerId={CONTAINER_IDS.C2_Test}
      withAssociatedLabel
      label="Region"
      isMulti
      filteringProperty="Region"
      options={["Šumadija", "Banat", "Srem"]}
      className="text-left mb-3"
    />
  );
  expect(screen.getByText(/region/i)).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /šumadija/i })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /banat/i })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /srem/i })).toBeInTheDocument();
});

test("Button group filter without label", () => {
  render(
    <ButtonGroupFilter
      containerId={CONTAINER_IDS.C2_Test}
      isMulti
      filteringProperty="Region"
      options={["Šumadija", "Banat", "Srem"]}
      className="text-left mb-3"
    />
  );
  expect(screen.queryByText(/region/i)).not.toBeInTheDocument(); // ** getByText will throw error if nothing found
  expect(screen.getByRole("button", { name: /šumadija/i })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /banat/i })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /srem/i })).toBeInTheDocument();
});

// To throw error without container id
