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
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { AnyObject } from "../store/types";
import { useGridFilter } from "./hooks";
import { updatePropertyFilter } from "../store/actionCreators";
import { DebouncedInputField } from "./DebouncedInputField";

const operatorsMap: AnyObject = {
  eq: "eq",
  ne: "ne",
  gt: "gt",
  ge: "ge",
  lt: "lt",
  le: "le",
};

const faClassNames: AnyObject = {
  eq: "fas fa-equals",
  ne: "fas fa-not-equal",
  gt: "fas fa-greater-than",
  ge: "fas fa-greater-than-equal",
  lt: "fas fa-less-than",
  le: "fas fa-less-than-equal",
};

interface IProps {
  reduxFilterId: string;
  filterName: string;
  displayName?: string;
  placeholder?: string;
  useDecimal?: boolean;
}

const NumericFilter: React.FC<IProps> = ({
  reduxFilterId,
  filterName,
  displayName,
  useDecimal,
  placeholder,
}) => {
  const { propertyFilters } = useGridFilter(reduxFilterId);
  const propFilterValue = propertyFilters[filterName]?.value;
  const [dropdownOpen, setOpen] = useState(false);
  const operator = propertyFilters[filterName]?.operator ?? operatorsMap.eq;

  const dispatcher = useDispatch();
  const inputRef = useRef<Input>(null);

  const toggle = () => setOpen(!dropdownOpen);

  const setPropertyFilter = (value: string | null) => {
    if (value) {
      const parsed = useDecimal ? parseFloat(value) : parseInt(value, 10);
      dispatcher(
        updatePropertyFilter(reduxFilterId, filterName, parsed, operator)
      );
    } else
      dispatcher(
        updatePropertyFilter(reduxFilterId, filterName, value, operator)
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
      dispatcher(updatePropertyFilter(reduxFilterId, filterName, parsed, op));
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
                <FontAwesomeIcon icon={faCaretDown} className="mx-1" />
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
              <i
                style={{ fontSize: ".9em" }}
                className={`${faClassNames[operator]} text-muted`}
              />
            </InputGroupText>
          </InputGroupAddon>
          <DebouncedInputField
            inputReference={inputRef}
            fieldName={filterName}
            displayName={displayName || filterName}
            reduxValue={filterValue}
            onChange={setPropertyFilter}
            type="number"
            placeholder={placeholder}
          />
        </InputGroup>
      </div>
    ),
    [filterValue, dropdownOpen]
  );

  return memoizedFilter;
};

export default NumericFilter;
