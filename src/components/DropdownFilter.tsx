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
import { useGridFilter } from "./hooks";

interface IProps {
  containerId: string;
  options: Array<Option | AnyObject>;
  isNavigationProperty?: boolean;
  filterName: string;
  isLoading?: boolean;
  isClearable?: boolean;
  navigationPropertyName?: string;
  isNestedNavigationProperty?: boolean;
  isMulti?: boolean;
  size?: string;
  isBoolean?: boolean;
}

const DropdownFilter: React.FC<IProps> = ({
  containerId,
  options,
  isNavigationProperty = false,
  filterName,
  navigationPropertyName,
  isNestedNavigationProperty = false,
  isMulti = false,
  size,
  isLoading,
  isClearable,
  isBoolean,
}) => {
  const { propertyFilters, navigationPropertyFilters } =
    useGridFilter(containerId);
  const dispatcher = useDispatch();

  const propValue = propertyFilters[filterName]?.value;
  const navPropValue = navigationPropertyFilters[filterName]?.value;

  const updateCorrespondingFilter = (option: Option | AnyObject) => {
    const processedValue =
      isBoolean && option ? JSON.parse(option.value) : option;

    if (isNavigationProperty) {
      dispatcher(
        updateNavigationPropertyFilter(
          containerId,
          navigationPropertyName,
          filterName,
          processedValue,
          null,
          isNestedNavigationProperty
        )
      );
    } else
      dispatcher(
        updatePropertyFilter(containerId, filterName, processedValue)
      );
  };

  const filterValue = useMemo(() => {
    if (isNavigationProperty) {
      if (navPropValue !== undefined)
        return navigationPropertyFilters[filterName].type === "boolean"
          ? options.find((opt) => opt.value === JSON.stringify(navPropValue))
          : navPropValue;
      return null;
    }

    if (propValue !== undefined)
      return propertyFilters[filterName].type === "boolean"
        ? options.find((opt) => opt.value === JSON.stringify(propValue))
        : propValue;

    return null;
  }, [propValue, navPropValue]);

  const memoizedFilter = useMemo(
    () => (
      <Select
        key={`${filterName}-ddf`}
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
