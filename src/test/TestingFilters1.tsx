import React from "react";
import { Label } from "reactstrap";
import DropdownFilter from "../components/DropdownFilter";
import NumericFilter from "../components/NumericFilter";
import TextFilter from "../components/TextFilter";

export const yesNo = [
  { value: "true", label: "Yes" },
  { value: "false", label: "No" },
];
interface IProps {
  containerId: string;
  resetOnUnmount?: boolean;
  wrapperClassName?: string;
}

const TestingFilters1: React.FC<IProps> = ({
  containerId,
  wrapperClassName = "",
}) => (
  <div className={wrapperClassName}>
    <div className="mb-2">
      <Label for="Book" className="pb-0 text-dark font-weight-bold d-block text-left" size="sm">
        Book name
      </Label>
      <TextFilter
        key="sbs"
        isNavigationProperty
        navigationPropertyName="Books/Name"
        navigationPropertyFilterField="Name"
        isNestedNavigationProperty
        containerId={containerId}
        filterName="Book name"
      />
    </div>
    <div className="mb-2">
      <Label for="BookWriter" className="pb-0 text-dark font-weight-bold d-block text-left" size="sm">
        Book writer
      </Label>
      <DropdownFilter
        key="bndgz"
        size="sm"
        containerId={containerId}
        isNavigationProperty
        isNestedNavigationProperty
        navigationPropertyName="Books/Writer"
        filterName="Book writer"
        options={[
          "Ivo Andric",
          "Jovan Sterija Popovic",
          "Jovan Jovanovic Zmaj",
        ].map((v) => ({
          label: v,
          value: v,
        }))}
        isMulti
        isClearable
      />
    </div>
    <div className="mb-2">
      <Label className="pb-0 text-dark font-weight-bold d-block text-left" size="sm">
        User status
      </Label>
      <DropdownFilter
        key="plsts"
        size="sm"
        containerId={containerId}
        filterName="UserStatus"
        options={["Active", "Inactive", "Banned"].map((v) => ({
          label: v,
          value: v,
        }))}
        isMulti
        isClearable
      />
    </div>
    <div className="mb-2">
      <Label className="pb-0 text-dark font-weight-bold d-block text-left" size="sm">
        Year when joined
      </Label>
      <NumericFilter
        key="ply"
        displayName="Year when joined"
        filterName="YearJoined"
        containerId={containerId}
      />
    </div>
    <div className="mb-2">
      <Label className="pb-0 text-dark font-weight-bold d-block text-left" size="sm">
        Is premium user
      </Label>
      <DropdownFilter
        key="iscnt"
        size="sm"
        containerId={containerId}
        filterName="IsPremiumUser"
        options={yesNo}
        isBoolean
        isClearable
      />
    </div>

    <div className="mb-4">
      <Label className="pb-0 text-dark font-weight-bold d-block text-left" size="sm">
        Registered by
      </Label>
      <TextFilter
        key="usrnm"
        containerId={containerId}
        filterName="RegisterdBy"
        displayName="Registered by"
      />
    </div>
  </div>
);

export default TestingFilters1;
