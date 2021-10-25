import React, { useCallback, useMemo } from "react";
import { useDispatch } from "react-redux";
import { Button, ButtonGroup } from "reactstrap";
import { updatePropertyFilter } from "../store/actionCreators";
import { AnyObject } from "../store/types";
import { useFilterifyFilter } from "./hooks";

interface IProps {
  containerId: string;
  filteringProperty: string;
  options: Array<any>;
  optionsCustomContent?: AnyObject;
  optionsCustomcurrentFilterValues?: AnyObject;
  isMulti?: boolean;
  wrapperClassName?: string;
}

const ButtonGroupFilter: React.FC<IProps> = ({
  containerId,
  filteringProperty,
  options,
  optionsCustomContent = {},
  optionsCustomcurrentFilterValues = {},
  isMulti = false,
  wrapperClassName = "",
}) => {
  const { propertyFilters } = useFilterifyFilter(containerId);
  const currentFilterValue = propertyFilters[filteringProperty]?.value;
  const filterOperaetor = propertyFilters[filteringProperty]?.operator;
  const dispatcher = useDispatch();

  const updateInMultiValueMode = useCallback(
    (value, operator, logic) => {
      if (currentFilterValue) {
        let newValue = currentFilterValue.some((v: any) => v === value)
          ? currentFilterValue.filter((v: any) => v !== value)
          : [...currentFilterValue, value];

        dispatcher(
          updatePropertyFilter(
            containerId,
            filteringProperty,
            newValue,
            operator,
            logic
          )
        );
      } else
        dispatcher(
          updatePropertyFilter(
            containerId,
            filteringProperty,
            [value],
            operator,
            logic
          )
        );
    },
    [containerId, dispatcher, filteringProperty, currentFilterValue]
  );

  const updateInSingleValueMode = useCallback(
    (value, operator, logic) => {
      if (currentFilterValue !== undefined && operator === filterOperaetor)
        dispatcher(updatePropertyFilter(containerId, filteringProperty, null));
      else
        dispatcher(
          updatePropertyFilter(containerId, filteringProperty, value, operator, logic)
        );
    },
    [containerId, currentFilterValue, dispatcher, filteringProperty, filterOperaetor]
  );

  const setPropertyFilter = useCallback(
    (value, operator = "eq", logic = "or") => {
      if (isMulti) {
        updateInMultiValueMode(value, operator, logic);
      } else {
        updateInSingleValueMode(value, operator, logic);
      }
    },
    [isMulti, updateInMultiValueMode, updateInSingleValueMode]
  );

  const isOptionSelected = useCallback(
    (option, optOperator = "eq") => {
      if (isMulti)
        return !!currentFilterValue?.some(
          (v: any) => v === option && optOperator === filterOperaetor
        );
      return currentFilterValue === option && optOperator === filterOperaetor;
    },
    [currentFilterValue, isMulti, filterOperaetor]
  );

  const updateFilter = useCallback(
    (opt) => {
      if (optionsCustomcurrentFilterValues[opt]) {
        setPropertyFilter(
          optionsCustomcurrentFilterValues[opt].value,
          optionsCustomcurrentFilterValues[opt].operator,
          optionsCustomcurrentFilterValues[opt].logic
        );
      } else setPropertyFilter(opt);
    },
    [optionsCustomcurrentFilterValues, setPropertyFilter]
  );

  const isButtonOptionSelected = useCallback(
    (opt) =>
      optionsCustomcurrentFilterValues[opt]
        ? isOptionSelected(
            optionsCustomcurrentFilterValues[opt].value,
            optionsCustomcurrentFilterValues[opt].operator
          )
        : isOptionSelected(opt),
    [optionsCustomcurrentFilterValues, isOptionSelected]
  );

  const memoizedFilter = useMemo(
    () => (
      <div className={wrapperClassName}>
        <ButtonGroup key={`bgf-${filteringProperty}`} size="sm">
          {options.map((opt, ind) => (
            <Button
              key={`${ind}-${filteringProperty}`}
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
      filteringProperty,
      updateFilter,
      isButtonOptionSelected,
    ]
  );

  return memoizedFilter;
};

export default ButtonGroupFilter;
