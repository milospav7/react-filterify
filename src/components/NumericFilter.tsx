/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useMemo, useRef } from "react";
import { useDispatch } from "react-redux";
import {
  InputGroup,
  InputGroupAddon,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  ButtonDropdown,
  InputGroupText,
  Input,
} from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCaretDown,
  faEquals,
  faGreaterThan,
  faGreaterThanEqual,
  faLessThan,
  faLessThanEqual,
  faNotEqual,
} from "@fortawesome/free-solid-svg-icons";
import { ValueTypedObject } from "../store/types";
import { useFilterifyFilter } from "./hooks";
import { updatePropertyFilter } from "../store/actionCreators";
import { DebouncedInputField } from "./DebouncedInputField";

const operatorsMap: ValueTypedObject<string> = {
  eq: "eq",
  ne: "ne",
  gt: "gt",
  ge: "ge",
  lt: "lt",
  le: "le",
};

const faIcons: ValueTypedObject<any> = {
  eq: faEquals,
  ne: faNotEqual,
  gt: faGreaterThan,
  ge: faGreaterThanEqual,
  lt: faLessThan,
  le: faLessThanEqual,
};

interface IProps {
  containerId: string;
  filteringProperty: string;
  displayName?: string;
  placeholder?: string;
  useDecimal?: boolean;
}

const NumericFilter: React.FC<IProps> = ({
  containerId,
  filteringProperty,
  displayName,
  useDecimal,
  placeholder,
}) => {
  const { propertyFilters } = useFilterifyFilter(containerId);
  const propFilterValue = propertyFilters[filteringProperty]?.value;
  const [dropdownOpen, setOpen] = useState(false);
  const operator = propertyFilters[filteringProperty]?.operator ?? operatorsMap.eq;

  const dispatcher = useDispatch();
  const inputRef = useRef<Input>(null);

  const toggle = () => setOpen(!dropdownOpen);

  const setPropertyFilter = (value: string | null) => {
    if (value) {
      const parsed = useDecimal ? parseFloat(value) : parseInt(value, 10);
      dispatcher(
        updatePropertyFilter(containerId, filteringProperty, parsed, operator)
      );
    } else
      dispatcher(
        updatePropertyFilter(containerId, filteringProperty, value, operator)
      );
  };

  const filterValue = useMemo(
    () => (propFilterValue !== undefined ? propFilterValue : ""),
    [propFilterValue]
  );

  const updateOperator = (op: string) => {
    if (op !== operator) {
      const val = inputRef.current?.props.value?.toString() ?? "";
      const parsed = useDecimal ? parseFloat(val) : parseInt(val, 10);
      dispatcher(updatePropertyFilter(containerId, filteringProperty, parsed, op));
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
                <FontAwesomeIcon
                  icon={faCaretDown}
                  className="mx-1 text-light"
                />
              </DropdownToggle>
              <DropdownMenu>
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
                <DropdownItem
                  active={operatorSelected(operatorsMap.gt)}
                  onClick={() => updateOperator(operatorsMap.gt)}
                >
                  Greater than
                </DropdownItem>
                <DropdownItem
                  active={operatorSelected(operatorsMap.ge)}
                  onClick={() => updateOperator(operatorsMap.ge)}
                >
                  Greater than or equal
                </DropdownItem>
                <DropdownItem
                  active={operatorSelected(operatorsMap.lt)}
                  onClick={() => updateOperator(operatorsMap.lt)}
                >
                  Less than
                </DropdownItem>
                <DropdownItem
                  active={operatorSelected(operatorsMap.le)}
                  onClick={() => updateOperator(operatorsMap.le)}
                >
                  Less than or equal
                </DropdownItem>
              </DropdownMenu>
            </ButtonDropdown>
          </InputGroupAddon>
          <InputGroupAddon addonType="prepend">
            <InputGroupText>
              <FontAwesomeIcon
                icon={faIcons[operator]}
                style={{ fontSize: ".9em" }}
              />
            </InputGroupText>
          </InputGroupAddon>
          <DebouncedInputField
            inputReference={inputRef}
            filteringProperty={filteringProperty}
            displayName={displayName ?? filteringProperty}
            reduxValue={filterValue}
            onChange={setPropertyFilter}
            type="number"
            placeholder={placeholder ?? displayName}
          />
        </InputGroup>
      </div>
    ),
    [filterValue, dropdownOpen]
  );

  return memoizedFilter;
};

export default NumericFilter;
