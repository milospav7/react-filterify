/* eslint-disable react-hooks/exhaustive-deps */
import React, { useMemo } from "react";
import { useDispatch } from "react-redux";
import Select from "react-select";
import { Option } from "react-select/src/filters";
import {
  updateNavigationPropertyFilter,
  updatePropertyFilter,
} from "../store/actionCreators";
import { AnyObject } from "../store/types";
import { useFilterifyFilter } from "./hooks";

interface IProps {
  containerId: string;
  filteringProperty: string;
  options: Array<Option | AnyObject>;
  navigationProperty?: string;
  isNavigationProperty?: boolean;
  isNestedNavigationProperty?: boolean;
  isLoading?: boolean;
  isClearable?: boolean;
  isMulti?: boolean;
  size?: string;
  isBoolean?: boolean;
}

const DropdownFilter: React.FC<IProps> = ({
  containerId,
  options,
  isNavigationProperty = false,
  filteringProperty,
  navigationProperty,
  isNestedNavigationProperty = false,
  isMulti = false,
  size,
  isLoading,
  isClearable,
  isBoolean,
}) => {
  const { propertyFilters, navigationPropertyFilters } =
    useFilterifyFilter(containerId);
  const dispatcher = useDispatch();

  const propValue = propertyFilters[filteringProperty]?.value;
  const navPropValue = navigationPropertyFilters[filteringProperty]?.value;

  const updateCorrespondingFilter = (option: Option | AnyObject) => {
    const processedValue =
      isBoolean && option ? JSON.parse(option.value) : option;

    if (isNavigationProperty) {
      dispatcher(
        updateNavigationPropertyFilter(
          containerId,
          navigationProperty,
          filteringProperty,
          processedValue,
          null,
          isNestedNavigationProperty
        )
      );
    } else
      dispatcher(
        updatePropertyFilter(containerId, filteringProperty, processedValue)
      );
  };

  const filterValue = useMemo(() => {
    if (isNavigationProperty) {
      if (navPropValue !== undefined)
        return navigationPropertyFilters[filteringProperty].type === "boolean"
          ? options.find((opt) => opt.value === JSON.stringify(navPropValue))
          : navPropValue;
      return null;
    }

    if (propValue !== undefined)
      return propertyFilters[filteringProperty].type === "boolean"
        ? options.find((opt) => opt.value === JSON.stringify(propValue))
        : propValue;

    return null;
  }, [propValue, navPropValue]);

  const memoizedFilter = useMemo(
    () => (
      <Select
        key={`${filteringProperty}-ddf`}
        size={size}
        options={options}
        value={filterValue}
        isMulti={isMulti}
        onChange={updateCorrespondingFilter}
        isClearable={isClearable}
        isLoading={isLoading}
      />
    ),
    [filterValue, isLoading, options]
  );

  return memoizedFilter;
};

export default DropdownFilter;
