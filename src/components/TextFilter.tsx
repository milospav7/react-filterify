/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useMemo } from "react";
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

interface ITextFilterProps {
  containerId: string;
  filterName: string;
  displayName?: string;
  isNavigationProperty?: boolean;
  navigationPropertyName?: string;
  navigationPropertyFilterField?: string;
  isNestedNavigationProperty?: boolean;
}

const TextFilter: React.FC<ITextFilterProps> = ({
  containerId,
  filterName,
  displayName,
  isNavigationProperty,
  navigationPropertyName,
  navigationPropertyFilterField,
  isNestedNavigationProperty,
}) => {
  const { propertyFilters, navigationPropertyFilters } =
    useFilterifyFilter(containerId);

  const getDefaultOperator = () => {
    let defaultOperator = "contains";
    if (isNavigationProperty) {
      const supportedOperators = Object.keys(operatorsMap);
      const customExpression =
        navigationPropertyFilters[filterName]?.customExpression ?? null;

      if (customExpression)
        supportedOperators.forEach((k) => {
          if (customExpression.indexOf(k) >= 0) defaultOperator = k;
        });
    } else {
      const propFOpr =
        (propertyFilters[filterName] && propertyFilters[filterName].operator) ||
        null;
      if (propFOpr) defaultOperator = propFOpr;
    }
    return operatorsMap[defaultOperator];
  };
  const [dropdownOpen, setOpen] = useState(false);
  const [operator, setOperator] = useState(getDefaultOperator());
  const dispatcher = useDispatch();
  const inputRef = useRef<Input>(null);

  const toggle = () => setOpen(!dropdownOpen);

  const updateCorrespondingFilter = (
    value: string | ReadonlyArray<string> | number | undefined | null,
    opr: string
  ) => {
    const navFilterField = navigationPropertyFilterField || filterName;

    if (isNavigationProperty) {
      let customExpression = "";
      if (opr === "eq" || opr === "ne")
        customExpression = `(s/${navFilterField} ${opr} '${value}')`;
      else if (opr === "contains")
        customExpression = `contains(s/${navFilterField}, '${value}')`;
      else if (opr === "doesnotcontain")
        customExpression = `(indexof(s/${navFilterField}, '${value}') eq -1)`;
      else if (opr === "startswith" || opr === "endswith")
        customExpression = `${opr}(s/${navFilterField}, '${value}')`;

      dispatcher(
        updateNavigationPropertyFilter(
          containerId,
          navigationPropertyName,
          filterName,
          value,
          customExpression,
          isNestedNavigationProperty
        )
      );
    } else
      dispatcher(updatePropertyFilter(containerId, filterName, value, opr));
  };

  const setPropertyFilter = (value: string | null) => {
    updateCorrespondingFilter(value, operator);
  };

  const filterValue = useMemo(() => {
    if (isNavigationProperty)
      return navigationPropertyFilters[filterName]?.value ?? "";
    return propertyFilters[filterName]?.value ?? "";
  }, [
    propertyFilters[filterName]?.value,
    navigationPropertyFilters[filterName]?.value,
  ]);

  const updateOperator = (op: string) => {
    if (op !== operator) {
      const val = inputRef?.current?.props.value;
      updateCorrespondingFilter(val, op);
      setOperator(op);
    }
  };

  const operatorSelected = (op: string) => operator === op;

  const memoizedFilter = useMemo(
    () => (
      <div>
        <InputGroup size="sm">
          <InputGroupAddon addonType="prepend">
            <ButtonDropdown isOpen={dropdownOpen} toggle={toggle}>
              <DropdownToggle className="p-0 m-0 rounded-left text-muted z-index-auto">
                <FontAwesomeIcon icon={faCaretDown} className="mx-1 text-light" />
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
            fieldName={filterName}
            displayName={displayName || filterName}
            reduxValue={filterValue}
            onChange={setPropertyFilter}
            placeholder={displayName || filterName}
          />
        </InputGroup>
      </div>
    ),
    [filterValue, dropdownOpen]
  );

  return memoizedFilter;
};

export default TextFilter;
