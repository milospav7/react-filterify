import React from "react";
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
    <TextFilter
      key="usn"
      withAssociatedLabel
      label="User name"
      filteringProperty="UserName"
      displayName="User name"
      containerId={containerId}
    />
    <TextFilter
      key="sbs"
      withAssociatedLabel
      label="Book name"
      navigationProperty="Books"
      filteringProperty="Name"
      containerId={containerId}
    />
    <DropdownFilter
      key="bndgz"
      withAssociatedLabel
      label="Book writer"
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
    <DropdownFilter
      key="plsts"
      withAssociatedLabel
      label="User status"
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
    <NumericFilter
      key="ply"
      withAssociatedLabel
      label="Year when joined"
      displayName="Year when joined"
      filteringProperty="YearJoined"
      containerId={containerId}
    />
    <BooleanFilter
      key="iscnt"
      withAssociatedLabel
      label="Is premium user"
      size="sm"
      containerId={containerId}
      filteringProperty="IsPremiumUser"
      isClearable
    />
    <TextFilter
      key="usrnm"
      withAssociatedLabel
      label="Registered by"
      containerId={containerId}
      filteringProperty="RegisterdBy"
      displayName="Registered by"
    />
    <ClearButton containerId="F1" />
  </div>
);

export default UserFilters;
