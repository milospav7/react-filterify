import React, { useCallback, useMemo } from "react";
import { Button, ButtonGroup } from "reactstrap";
import { BaseFilterProps } from "../../store/interfaces";
import FilterDecorator from "../shared/FilterDecorator";
import {
  useContainerStyleSchema,
  useFilterActions,
  useFilterState,
} from "../../hooks";

interface IProps extends BaseFilterProps {
  options: Array<any>;
  isMulti?: boolean;
  logic?: "or" | "and";
}

const ButtonGroupFilter: React.FC<IProps> = ({
  containerId,
  filteringProperty,
  navigationProperty,
  options,
  isMulti = false,
  className,
  withLabel,
  labelClassName,
  label,
  style,
  logic = "or",
  size = "sm",
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
    [filterValue, updateFilter, logic]
  );

  const updateInSingleMode = useCallback(
    (value) => {
      const modifiedFilter = filterValue === value ? null : value;
      updateFilter(modifiedFilter, { operator: "eq", logic });
    },
    [filterValue, updateFilter, logic]
  );

  const updateTargetFilter = useCallback(
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
        withLabel={withLabel}
        className={className}
        labelClassName={labelClassName}
        label={label}
        style={style}
        labelStyle={styles.label}
      >
        <ButtonGroup className="border border-muted rounded" key={`bgf-${filteringProperty}`} size={size}>
          {options.map((opt, ind) => (
            <Button
              key={`${ind}-${filteringProperty}`}
              className="no-higlight-focus"
              color="light"
              onClick={() => {
                updateTargetFilter(opt);
              }}
              active={isOptionSelected(opt)}
            >
              {opt}
            </Button>
          ))}
        </ButtonGroup>
      </FilterDecorator>
    ),
    [
      withLabel,
      className,
      labelClassName,
      label,
      style,
      styles.label,
      filteringProperty,
      size,
      options,
      isOptionSelected,
      updateTargetFilter,
    ]
  );

  return memoizedFilter;
};

export default ButtonGroupFilter;
