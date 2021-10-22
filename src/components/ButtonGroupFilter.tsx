import React, { useCallback, useMemo } from "react";
import { useDispatch } from "react-redux";
import { Button, ButtonGroup } from "reactstrap";
import { updatePropertyFilter } from "../store/actionCreators";
import { AnyObject } from "../store/types";
import { useGridFilter } from "./hooks";

interface IProps {
  reduxFilterId: string;
  filterName: string;
  options: Array<any>;
  optionsCustomContent?: AnyObject;
  optionsCustomFilterValues?: AnyObject;
  isMulti?: boolean;
  wrapperClassName?: string;
}

const ButtonGroupFilter: React.FC<IProps> = ({
  reduxFilterId,
  filterName,
  options,
  optionsCustomContent = {},
  optionsCustomFilterValues = {},
  isMulti = false,
  wrapperClassName = "",
}) => {
  const { propertyFilters } = useGridFilter(reduxFilterId);
  const propValue = propertyFilters[filterName]?.value;
  const propOperator = propertyFilters[filterName]?.operator;
  const dispatcher = useDispatch();

  const setPropertyFilter = useCallback(
    (value, operator = "eq", logic = "or") => {
      if (isMulti) {
        if (propValue) {
          let nextFilterValue = propValue.some((v: any) => v === value)
            ? propValue.filter((v: any) => v !== value)
            : [...propValue, value];
          dispatcher(
            updatePropertyFilter(
              reduxFilterId,
              filterName,
              nextFilterValue,
              operator,
              logic
            )
          );
        } else
          dispatcher(
            updatePropertyFilter(
              reduxFilterId,
              filterName,
              [value],
              operator,
              logic
            )
          );
      } else {
        if (propValue !== undefined && operator === propOperator)
          dispatcher(updatePropertyFilter(reduxFilterId, filterName, null));
        else
          dispatcher(
            updatePropertyFilter(
              reduxFilterId,
              filterName,
              value,
              operator,
              logic
            )
          );
      }
    },
    [isMulti, propValue, dispatcher, filterName, reduxFilterId, propOperator]
  );

  const isOptionSelected = useCallback(
    (optValue, optOperator = "eq") => {
      if (isMulti)
        return !!propValue?.some(
          (v: any) => v === optValue && optOperator === propOperator
        );
      return propValue === optValue && optOperator === propOperator;
    },
    [propValue, isMulti, propOperator]
  );

  const updateFilter = useCallback(
    (opt) => {
      if (optionsCustomFilterValues[opt]) {
        setPropertyFilter(
          optionsCustomFilterValues[opt].value,
          optionsCustomFilterValues[opt].operator,
          optionsCustomFilterValues[opt].logic
        );
      } else setPropertyFilter(opt);
    },
    [optionsCustomFilterValues, setPropertyFilter]
  );

  const isButtonOptionSelected = useCallback(
    (opt) =>
      optionsCustomFilterValues[opt]
        ? isOptionSelected(
            optionsCustomFilterValues[opt].value,
            optionsCustomFilterValues[opt].operator
          )
        : isOptionSelected(opt),
    [optionsCustomFilterValues, isOptionSelected]
  );

  const memoizedFilter = useMemo(
    () => (
      <div className={wrapperClassName}>
        <ButtonGroup key={`bgf-${filterName}`} size="sm">
          {options.map((opt, ind) => (
            <Button
              key={`${ind}-${filterName}`}
              className="no-higlight-focus"
              color="light"
              onClick={() => {
                updateFilter(opt);
              }}
              active={isButtonOptionSelected(opt)}
            >
              {optionsCustomContent?.[opt] ?? opt}
            </Button>
          ))}
        </ButtonGroup>
      </div>
    ),
    [
      optionsCustomContent,
      options,
      wrapperClassName,
      filterName,
      updateFilter,
      isButtonOptionSelected,
    ]
  );

  return memoizedFilter;
};

export default ButtonGroupFilter;
