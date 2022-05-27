import React from "react";
import BooleanFilter from "../components/BooleanFilter/BooleanFilter";
import ButtonGroupFilter from "../components/ButtonGroupFilter/ButtonGroupFilter";
import ResetFiltersButton from "../components/shared/ResetFiltersButton";
import DateTimeFilter from "../components/DateTimeFilter/DateTimeFilter";
import DropdownFilter from "../components/DropdownFilter/DropdownFilter";
import NumericFilter from "../components/NumericFilter/NumericFilter";
import TextFilter from "../components/TextFilter/TextFilter";

interface IProps {
  containerId: string;
  resetOnUnmount?: boolean;
  wrapperClassName?: string;
}

const UserFilters: React.FC<IProps> = ({
  containerId,
  wrapperClassName,
}) => (
  <div className={wrapperClassName}>
    <TextFilter
      key="usn"
      withLabel
      label="User name"
      filteringProperty="UserName"
      containerId={containerId}
    />
    <TextFilter
      key="sbs"
      withLabel
      label="Book name"
      navigationProperty="Books"
      filteringProperty="Name"
      containerId={containerId}
    />
    <DropdownFilter
      key="bndgz"
      withLabel
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
      withLabel
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
      withLabel
      label="Year when joined"
      filteringProperty="YearJoined"
      containerId={containerId}
      placeholder="Year when joined.."
      multipleOperators

    />
    <BooleanFilter
      key="iscnt"
      withLabel
      label="Is premium user"
      size="sm"
      containerId={containerId}
      filteringProperty="IsPremiumUser"
      isClearable
    />
    <TextFilter
      key="usrnm"
      withLabel
      label="Registered by"
      containerId={containerId}
      filteringProperty="RegisterdBy"
    />
    <DateTimeFilter
      containerId={containerId}
      withLabel
      label="Date of registration"
      filteringProperty="DateTimeRegistered"
    />
    <ButtonGroupFilter
      containerId={containerId}
      withLabel
      label="Region"
      isMulti
      filteringProperty="Region"
      options={["Šumadija", "Banat", "Srem"]}
      className="text-start mb-3"
    />
    <ResetFiltersButton containerId={containerId} />
  </div>
);

export default UserFilters;
