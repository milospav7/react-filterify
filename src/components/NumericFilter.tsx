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
import { useFilterActions, useFilterState } from "./hooks";
import { updatePropertyFilter } from "../store/actionCreators";
import { DebouncedInputField } from "./DebouncedInputField";
import { BaseFilterProps } from "../store/interfaces";
import FilterDecorator from "./FilterDecorator";

const operatorSymbols: ValueTypedObject<string> = {
  eq: "eq",
  ne: "ne",
  gt: "gt",
  ge: "ge",
  lt: "lt",
  le: "le",
};

const faIconByOperator: ValueTypedObject<any> = {
  eq: faEquals,
  ne: faNotEqual,
  gt: faGreaterThan,
  ge: faGreaterThanEqual,
  lt: faLessThan,
  le: faLessThanEqual,
};

interface IProps extends BaseFilterProps {
  placeholder?: string;
  useDecimal?: boolean;
}

const NumericFilter: React.FC<IProps> = ({
  containerId,
  filteringProperty,
  navigationProperty,
  useDecimal,
  placeholder,
  className,
  withAssociatedLabel,
  labelClassName,
  label,
  style,
}) => {
  const [dropdownOpen, setOpen] = useState(false);
  const toggle = () => setOpen(!dropdownOpen);
  const dispatcher = useDispatch();
  const inputRef = useRef<Input>(null);

  const { updateFilter } = useFilterActions(
    containerId,
    filteringProperty,
    navigationProperty
  );
  const { filterValue, filterOperator } = useFilterState(
    containerId,
    filteringProperty,
    navigationProperty
  );
  const operator = filterOperator ?? operatorSymbols.eq;

  const updateTargetFilter = (value: string | null) => {
    if (value) {
      const parsed = useDecimal ? parseFloat(value) : parseInt(value, 10);
      updateFilter(parsed, { operator });
    } else updateFilter(value, { operator });
  };

  const updateOperator = (op: string) => {
    if (op !== operator) {
      const val = inputRef.current?.props.value?.toString() ?? "";
      const parsed = useDecimal ? parseFloat(val) : parseInt(val, 10);
      dispatcher(
        updatePropertyFilter(containerId, filteringProperty, parsed, op)
      );
    }
  };

  const operatorSelected = (op: string) => operator === op;

  const memoizedFilter = useMemo(
    () => (
      <FilterDecorator
        displayLabel={withAssociatedLabel}
        className={className}
        labelClassName={labelClassName}
        label={label}
        style={style}
      >
        <>
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
                    active={operatorSelected(operatorSymbols.eq)}
                    onClick={() => updateOperator(operatorSymbols.eq)}
                  >
                    Equal
                  </DropdownItem>
                  <DropdownItem
                    active={operatorSelected(operatorSymbols.ne)}
                    onClick={() => updateOperator(operatorSymbols.ne)}
                  >
                    Not equal
                  </DropdownItem>
                  <DropdownItem
                    active={operatorSelected(operatorSymbols.gt)}
                    onClick={() => updateOperator(operatorSymbols.gt)}
                  >
                    Greater than
                  </DropdownItem>
                  <DropdownItem
                    active={operatorSelected(operatorSymbols.ge)}
                    onClick={() => updateOperator(operatorSymbols.ge)}
                  >
                    Greater than or equal
                  </DropdownItem>
                  <DropdownItem
                    active={operatorSelected(operatorSymbols.lt)}
                    onClick={() => updateOperator(operatorSymbols.lt)}
                  >
                    Less than
                  </DropdownItem>
                  <DropdownItem
                    active={operatorSelected(operatorSymbols.le)}
                    onClick={() => updateOperator(operatorSymbols.le)}
                  >
                    Less than or equal
                  </DropdownItem>
                </DropdownMenu>
              </ButtonDropdown>
            </InputGroupAddon>
            <InputGroupAddon addonType="prepend">
              <InputGroupText>
                <FontAwesomeIcon
                  icon={faIconByOperator[operator]}
                  style={{ fontSize: ".9em" }}
                />
              </InputGroupText>
            </InputGroupAddon>
            <DebouncedInputField
              inputRef={inputRef}
              filteringProperty={filteringProperty}
              filterValue={filterValue}
              onChange={updateTargetFilter}
              type="number"
              placeholder={placeholder ?? label}
            />
          </InputGroup>
        </>
      </FilterDecorator>
    ),
    [filterValue, dropdownOpen]
  );

  return memoizedFilter;
};

export default NumericFilter;
