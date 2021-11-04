/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useMemo } from "react";
import { useDispatch } from "react-redux";
import Select from "react-select";
import { Option } from "react-select/src/filters";
import {
  updateNavigationPropertyFilter,
  updatePropertyFilter,
} from "../store/actionCreators";
import { useFilterifyFilter } from "./hooks";

export const options = [
  { value: "true", label: "Yes" },
  { value: "false", label: "No" },
];

interface IProps {
  containerId: string;
  filteringProperty: string;
  navigationProperty?: string;
  isNavigationProperty?: boolean;
  isNestedNavigationProperty?: boolean;
  isLoading?: boolean;
  isClearable?: boolean;
  isMulti?: boolean;
  size?: string;
}

const BooleanFilter: React.FC<IProps> = ({
  containerId,
  isNavigationProperty = false,
  filteringProperty,
  navigationProperty,
  isNestedNavigationProperty = false,
  isMulti = false,
  size,
  isLoading,
  isClearable,
}) => {
  const { propertyFilters, navigationPropertyFilters } =
    useFilterifyFilter(containerId);
  const dispatcher = useDispatch();

  const updateFilter = useCallback(
    (option: Option) => {
      if (isNavigationProperty) {
        dispatcher(
          updateNavigationPropertyFilter(
            containerId,
            navigationProperty,
            filteringProperty,
            option,
            null,
            isNestedNavigationProperty
          )
        );
      } else
        dispatcher(
          updatePropertyFilter(containerId, filteringProperty, option)
        );
    },
    [dispatcher]
  );

  const filterValue = useMemo(() => {
    if (isNavigationProperty)
      return navigationPropertyFilters[filteringProperty]?.value ?? null;
    return propertyFilters[filteringProperty]?.value ?? null;
  }, [
    navigationPropertyFilters[filteringProperty]?.value,
    propertyFilters[filteringProperty]?.value,
  ]);

  const memoizedFilter = useMemo(
    () => (
      <Select
        key={`${filteringProperty}-blf`}
        size={size}
        options={options}
        value={filterValue}
        isMulti={isMulti}
        onChange={updateFilter}
        isClearable={isClearable}
        isLoading={isLoading}
      />
    ),
    [filterValue, isLoading, options]
  );

  return memoizedFilter;
};

export default BooleanFilter;
