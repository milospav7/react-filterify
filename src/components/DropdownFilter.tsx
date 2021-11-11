/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useMemo } from "react";
import Select from "react-select";
import { Option } from "react-select/src/filters";
import { BaseFilterProps } from "../store/interfaces";
import { FilterOption } from "../store/types";
import FilterDecorator from "./FilterDecorator";
import { useContainerActions, useSingleFilterState } from "./hooks";

interface IProps extends BaseFilterProps {
  options: Array<Option | FilterOption>;
  isLoading?: boolean;
  isClearable?: boolean;
  isMulti?: boolean;
}

const DropdownFilter: React.FC<IProps> = ({
  containerId,
  options,
  filteringProperty,
  navigationProperty,
  isMulti = false,
  size,
  isLoading,
  isClearable,
  className,
  withAssociatedLabel,
  labelClassName,
  label,
  style,
}) => {
  const { updateFilter } = useContainerActions(
    containerId,
    filteringProperty,
    navigationProperty
  );
  const { filterValue } = useSingleFilterState(
    containerId,
    filteringProperty,
    navigationProperty
  );

  const updateTargetFilter = useCallback((value) => updateFilter(value), []);

  const memoizedFilter = useMemo(
    () => (
      <FilterDecorator
        displayLabel={withAssociatedLabel}
        className={className}
        labelClassName={labelClassName}
        label={label}
        style={style}
      >
        <Select
          key={`${filteringProperty}-ddf`}
          size={size}
          options={options}
          value={filterValue}
          isMulti={isMulti}
          onChange={updateTargetFilter}
          isClearable={isClearable}
          isLoading={isLoading}
        />
      </FilterDecorator>
    ),
    [filterValue, isLoading, options]
  );

  return memoizedFilter;
};

export default DropdownFilter;
