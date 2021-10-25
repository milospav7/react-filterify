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
  navigationProperty?: string;
  isNestedNavigationProperty?: boolean;
}

const TextFilter: React.FC<ITextFilterProps> = ({
  containerId,
  filterName,
  displayName,
  isNavigationProperty,
  navigationProperty,
  isNestedNavigationProperty,
}) => {
  const { propertyFilters, navigationPropertyFilters } =
    useFilterifyFilter(containerId);

  const getDefaultOperator = useCallback(() => {
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
  }, [
    filterName,
    isNavigationProperty,
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
      if (isNavigationProperty) {
        let customExpression = "";
        if (opr === "eq" || opr === "ne")
          customExpression = `(s/${filterName} ${opr} '${value}')`;
        else if (opr === "contains")
          customExpression = `contains(s/${filterName}, '${value}')`;
        else if (opr === "doesnotcontain")
          customExpression = `(indexof(s/${filterName}, '${value}') eq -1)`;
        else if (opr === "startswith" || opr === "endswith")
          customExpression = `${opr}(s/${filterName}, '${value}')`;

        dispatcher(
          updateNavigationPropertyFilter(
            containerId,
            navigationProperty,
            filterName,
            value,
            customExpression,
            isNestedNavigationProperty
          )
        );
      } else
        dispatcher(updatePropertyFilter(containerId, filterName, value, opr));
    },
    [
      containerId,
      dispatcher,
      filterName,
      isNavigationProperty,
      isNestedNavigationProperty,
      navigationProperty,
    ]
  );

  const setPropertyFilter = (value: string | null) => {
    updateCorrespondingFilter(value, operator);
  };

  const filterValue = useMemo(() => {
    if (isNavigationProperty)
      return navigationPropertyFilters[filterName]?.value ?? "";
    return propertyFilters[filterName]?.value ?? "";
  }, [
    filterName,
    isNavigationProperty,
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
            fieldName={filterName}
            displayName={displayName || filterName}
            reduxValue={filterValue}
            onChange={setPropertyFilter}
            placeholder={displayName || filterName}
          />
        </InputGroup>
      </div>
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filterValue, dropdownOpen]
  );

  return memoizedFilter;
};

export default TextFilter;
