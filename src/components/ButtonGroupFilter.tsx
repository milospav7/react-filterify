/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useMemo } from "react";
import { useDispatch } from "react-redux";
import { Button, ButtonGroup } from "reactstrap";
import { BaseFilterProps } from "../store/interfaces";
import FilterDecorator from "./FilterDecorator";
import { useContainerActions, useContainerState } from "./hooks";

interface IProps extends BaseFilterProps {
  options: Array<any>;
  isMulti?: boolean;
  logic?: string;
}

const ButtonGroupFilter: React.FC<IProps> = ({
  containerId,
  filteringProperty,
  navigationProperty,
  options,
  isMulti = false,
  className,
  withAssociatedLabel,
  labelClassName,
  label,
  style,
  logic = "or",
}) => {
  const dispatcher = useDispatch();

  const { updateFilter } = useContainerActions(
    containerId,
    filteringProperty,
    navigationProperty
  );
  const { filterValue, filterOperator } = useContainerState(
    containerId,
    filteringProperty,
    navigationProperty
  );

  const updateInMultitMode = useCallback(
    (value) => {
      let modifiedFilter;
      const previousFilter = filterValue ?? [];
      const allOptionsDeselected =
        previousFilter.length === 1 && previousFilter[0] === value;

      if (allOptionsDeselected) modifiedFilter = null;
      else
        modifiedFilter = previousFilter.some((v: any) => v === value)
          ? previousFilter.filter((v: any) => v !== value)
          : [...previousFilter, value];

      updateFilter(modifiedFilter, { operator: "eq", logic });
    },
    [containerId, dispatcher, filteringProperty, filterValue]
  );

  const updateInSingleMode = useCallback(
    (value) => {
      const modifiedFilter = filterValue === value ? null : value;
      updateFilter(modifiedFilter, { operator: "eq", logic });
    },
    [containerId, filterValue, dispatcher, filteringProperty, filterOperator]
  );

  const setPropertyFilter = useCallback(
    (value) => {
      if (isMulti) {
        updateInMultitMode(value);
      } else {
        updateInSingleMode(value);
      }
    },
    [isMulti, updateInMultitMode, updateInSingleMode]
  );

  const isOptionSelected = useCallback(
    (option) => {
      if (isMulti) return filterValue?.some((v: any) => v === option);
      return filterValue === option;
    },
    [filterValue, isMulti]
  );

  const memoizedFilter = useMemo(
    () => (
      <FilterDecorator
        displayLabel={withAssociatedLabel}
        className={className}
        labelClassName={labelClassName}
        label={label}
        style={style}
      >
        <ButtonGroup key={`bgf-${filteringProperty}`} size="sm">
          {options.map((opt, ind) => (
            <Button
              key={`${ind}-${filteringProperty}`}
              className="no-higlight-focus"
              color="light"
              onClick={() => {
                setPropertyFilter(opt);
              }}
              active={isOptionSelected(opt)}
            >
              {opt}
            </Button>
          ))}
        </ButtonGroup>
      </FilterDecorator>
    ),
    [className, filteringProperty, options, isOptionSelected, setPropertyFilter]
  );

  return memoizedFilter;
};

export default ButtonGroupFilter;
