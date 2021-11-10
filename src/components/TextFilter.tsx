import React, { useState, useMemo, useCallback } from "react";
import { useRef } from "react";
import { useDispatch } from "react-redux";
import {
  InputGroup,
  InputGroupAddon,
  Input,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  ButtonDropdown,
  InputGroupText,
} from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAsterisk,
  faCaretDown,
  faCommentDots,
  faCommentSlash,
  faEquals,
  faNotEqual,
} from "@fortawesome/free-solid-svg-icons";
import { ValueTypedObject } from "../store/types";
import { useFilterifyFilter } from "./hooks";
import {
  updateNavigationPropertyFilter,
  updatePropertyFilter,
} from "../store/actionCreators";
import { DebouncedInputField } from "./DebouncedInputField";
import { BaseFilterProps } from "../store/interfaces";
import FilterDecorator from "./FilterDecorator";

const operatorsMap: ValueTypedObject<string> = {
  contains: "contains",
  doesnotcontain: "doesnotcontain",
  startswith: "startswith",
  endswith: "endswith",
  eq: "eq",
  ne: "ne",
};

const faIcons: ValueTypedObject<any> = {
  contains: faCommentDots,
  doesnotcontain: faCommentSlash,
  notlike: faCommentSlash,
  eq: faEquals,
  ne: faNotEqual,
  startswith: faAsterisk,
  endswith: faAsterisk,
};

interface ITextFilterProps extends BaseFilterProps {
  containerId: string;
  displayName?: string;
}

const TextFilter: React.FC<ITextFilterProps> = ({
  containerId,
  filteringProperty,
  displayName,
  navigationProperty,
  className,
  withAssociatedLabel,
  labelClassName,
  label,
}) => {
  const { propertyFilters, navigationPropertyFilters } =
    useFilterifyFilter(containerId);

  const getDefaultOperator = useCallback(() => {
    let defaultOperator = "contains";

    if (navigationProperty) {
      const supportedOperators = Object.keys(operatorsMap);
      const generatedExpression =
        navigationPropertyFilters[filteringProperty]?.generatedExpression ??
        null;

      if (generatedExpression)
        supportedOperators.forEach((k) => {
          if (generatedExpression.indexOf(k) >= 0) defaultOperator = k;
        });
    } else {
      const propFOpr =
        (propertyFilters[filteringProperty] &&
          propertyFilters[filteringProperty].operator) ||
        null;
      if (propFOpr) defaultOperator = propFOpr;
    }
    return operatorsMap[defaultOperator];
  }, [
    filteringProperty,
    navigationProperty,
    navigationPropertyFilters,
    propertyFilters,
  ]);

  const [dropdownOpen, setOpen] = useState(false);
  const [operator, setOperator] = useState(getDefaultOperator());
  const dispatcher = useDispatch();
  const inputRef = useRef<Input>(null);

  const toggle = () => setOpen(!dropdownOpen);

  const updateCorrespondingFilter = useCallback(
    (
      value: string | ReadonlyArray<string> | number | undefined | null,
      opr: string
    ) => {
      if (navigationProperty) {
        let generatedExpression = "";
        if (opr === "eq" || opr === "ne")
          generatedExpression = `(s/${filteringProperty} ${opr} '${value}')`;
        else if (opr === "contains")
          generatedExpression = `contains(s/${filteringProperty}, '${value}')`;
        else if (opr === "doesnotcontain")
          generatedExpression = `(indexof(s/${filteringProperty}, '${value}') eq -1)`;
        else if (opr === "startswith" || opr === "endswith")
          generatedExpression = `${opr}(s/${filteringProperty}, '${value}')`;

        dispatcher(
          updateNavigationPropertyFilter(
            containerId,
            navigationProperty,
            filteringProperty,
            value,
            generatedExpression
          )
        );
      } else
        dispatcher(
          updatePropertyFilter(containerId, filteringProperty, value, opr)
        );
    },
    [containerId, dispatcher, filteringProperty, navigationProperty]
  );

  const setPropertyFilter = (value: string | null) => {
    updateCorrespondingFilter(value, operator);
  };

  const filterValue = useMemo(() => {
    if (navigationProperty)
      return navigationPropertyFilters[filteringProperty]?.value ?? "";
    return propertyFilters[filteringProperty]?.value ?? "";
  }, [
    filteringProperty,
    navigationProperty,
    navigationPropertyFilters,
    propertyFilters,
  ]);

  const updateOperator = useCallback(
    (op: string) => {
      if (op !== operator) {
        const val = inputRef?.current?.props.value;
        updateCorrespondingFilter(val, op);
        setOperator(op);
      }
    },
    [operator, updateCorrespondingFilter]
  );

  const operatorSelected = useCallback(
    (op: string) => operator === op,
    [operator]
  );

  const memoizedFilter = useMemo(
    () => (
      <FilterDecorator
        displayLabel={withAssociatedLabel}
        className={className}
        labelClassName={labelClassName}
        label={label}
      >
        <div>
          <InputGroup size="sm">
            <InputGroupAddon addonType="prepend">
              <ButtonDropdown isOpen={dropdownOpen} toggle={toggle}>
                <DropdownToggle className="p-0 m-0 rounded-left text-muted z-index-auto">
                  <FontAwesomeIcon
                    icon={faCaretDown}
                    className="mx-1 text-light"
                  />
                </DropdownToggle>
                <DropdownMenu>
                  <DropdownItem
                    active={operatorSelected(operatorsMap.contains)}
                    onClick={() => updateOperator(operatorsMap.contains)}
                  >
                    Contains
                  </DropdownItem>
                  <DropdownItem
                    active={operatorSelected(operatorsMap.doesnotcontain)}
                    onClick={() => updateOperator(operatorsMap.doesnotcontain)}
                  >
                    Does not contain
                  </DropdownItem>
                  <DropdownItem
                    active={operatorSelected(operatorsMap.startswith)}
                    onClick={() => updateOperator(operatorsMap.startswith)}
                  >
                    Starts with
                  </DropdownItem>
                  <DropdownItem
                    active={operatorSelected(operatorsMap.endswith)}
                    onClick={() => updateOperator(operatorsMap.endswith)}
                  >
                    Ends with
                  </DropdownItem>
                  <DropdownItem
                    active={operatorSelected(operatorsMap.eq)}
                    onClick={() => updateOperator(operatorsMap.eq)}
                  >
                    Equal
                  </DropdownItem>
                  <DropdownItem
                    active={operatorSelected(operatorsMap.ne)}
                    onClick={() => updateOperator(operatorsMap.ne)}
                  >
                    Not equal
                  </DropdownItem>
                </DropdownMenu>
              </ButtonDropdown>
            </InputGroupAddon>
            <InputGroupAddon addonType="prepend">
              <InputGroupText className="text-muted">
                {operator === operatorsMap.endswith && (
                  <span style={{ lineHeight: "1" }} className="mr-1">
                    ....
                  </span>
                )}
                <FontAwesomeIcon
                  icon={faIcons[operator]}
                  style={{ fontSize: ".9em" }}
                />
                {operator === operatorsMap.startswith && (
                  <span style={{ lineHeight: "1" }} className="ml-1">
                    ....
                  </span>
                )}
              </InputGroupText>
            </InputGroupAddon>
            <DebouncedInputField
              inputReference={inputRef}
              filteringProperty={filteringProperty}
              displayName={displayName || filteringProperty}
              reduxValue={filterValue}
              onChange={setPropertyFilter}
              placeholder={displayName || filteringProperty}
            />
          </InputGroup>
        </div>
      </FilterDecorator>
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filterValue, dropdownOpen]
  );

  return memoizedFilter;
};

export default TextFilter;
