/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useMemo } from "react";
import Select from "react-select";
import { BaseFilterProps } from "../store/interfaces";
import FilterDecorator from "./FilterDecorator";
import {
  useContainerStyleSchema,
  useFilterActions,
  useFilterState,
} from "./hooks";

const options = [
  { value: true, label: "Yes" },
  { value: false, label: "No" },
];

interface IProps extends BaseFilterProps {
  isLoading?: boolean;
  isClearable?: boolean;
  isMulti?: boolean;
}

const BooleanFilter: React.FC<IProps> = ({
  containerId,
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
  const { updateFilter } = useFilterActions(
    containerId,
    filteringProperty,
    navigationProperty
  );
  const { filterValue } = useFilterState(
    containerId,
    filteringProperty,
    navigationProperty
  );
  const { styles } = useContainerStyleSchema(containerId);

  const updateTargetFilter = useCallback((value) => updateFilter(value), []);

  const memoizedFilter = useMemo(
    () => (
      <FilterDecorator
        displayLabel={withAssociatedLabel}
        className={className}
        labelClassName={labelClassName}
        label={label}
        style={style}
        labelStyle={styles.label}
      >
        <Select
          key={`${filteringProperty}-blf`}
          size={size}
          options={options}
          value={filterValue}
          isMulti={isMulti}
          onChange={updateTargetFilter}
          isClearable={isClearable}
          isLoading={isLoading}
          styles={{
            valueContainer: (base: any) => ({ ...base, ...styles.input }),
          }}
        />
      </FilterDecorator>
    ),
    [filterValue, isLoading, options]
  );

  return memoizedFilter;
};

export default BooleanFilter;
