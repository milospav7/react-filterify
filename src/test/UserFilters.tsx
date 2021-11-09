import React from "react";
import { Label } from "reactstrap";
import BooleanFilter from "../components/BooleanFilter";
import ClearButton from "../components/ClearButton";
import DropdownFilter from "../components/DropdownFilter";
import NumericFilter from "../components/NumericFilter";
import TextFilter from "../components/TextFilter";

interface IProps {
  containerId: string;
  resetOnUnmount?: boolean;
  wrapperClassName?: string;
}

const UserFilters: React.FC<IProps> = ({
  containerId,
  wrapperClassName = "",
}) => (
  <div className={wrapperClassName}>
    <ClearButton containerId="F1" />
    <div className="mb-2 mt-3">
      <Label
        for="Book"
        className="pb-0 text-dark font-weight-bold d-block text-left"
        size="sm"
      >
        Book name
      </Label>
      <TextFilter
        key="sbs"
        navigationProperty="Books"
        filteringProperty="Name"
        containerId={containerId}
      />
    </div>
    <div className="mb-2">
      <Label
        for="BookWriter"
        className="pb-0 text-dark font-weight-bold d-block text-left"
        size="sm"
      >
        Book writer
      </Label>
      <DropdownFilter
        key="bndgz"
        size="sm"
        containerId={containerId}
        navigationProperty="Books"
        filteringProperty="Writer"
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
      <Label
        className="pb-0 text-dark font-weight-bold d-block text-left"
        size="sm"
      >
        User status
      </Label>
      <DropdownFilter
        key="plsts"
        size="sm"
        containerId={containerId}
        filteringProperty="UserStatus"
        options={["Active", "Inactive", "Banned"].map((v) => ({
          label: v,
          value: v,
        }))}
        isMulti
        isClearable
      />
    </div>
    <div className="mb-2">
      <Label
        className="pb-0 text-dark font-weight-bold d-block text-left"
        size="sm"
      >
        Year when joined
      </Label>
      <NumericFilter
        key="ply"
        displayName="Year when joined"
        filteringProperty="YearJoined"
        containerId={containerId}
      />
    </div>
    <div className="mb-2">
      <Label
        className="pb-0 text-dark font-weight-bold d-block text-left"
        size="sm"
      >
        Is premium user
      </Label>
      <BooleanFilter
        key="iscnt"
        size="sm"
        containerId={containerId}
        filteringProperty="IsPremiumUser"
        isClearable
      />
    </div>

    <div className="mb-4">
      <Label
        className="pb-0 text-dark font-weight-bold d-block text-left"
        size="sm"
      >
        Registered by
      </Label>
      <TextFilter
        key="usrnm"
        containerId={containerId}
        filteringProperty="RegisterdBy"
        displayName="Registered by"
      />
    </div>
  </div>
);

export default UserFilters;
