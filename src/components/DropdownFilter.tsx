/* eslint-disable react-hooks/exhaustive-deps */
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useCallback, useMemo, useState } from "react";
import Select from "react-select";
import { Option } from "react-select/src/filters";
import {
  ButtonDropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  InputGroup,
  InputGroupText,
} from "reactstrap";
import { BaseFilterProps } from "../store/interfaces";
import { FilterOption } from "../store/types";
import { faIconByOperator } from "./common.utils";
import { getDropdownStyles } from "./DropdownFilter.utils";
import FilterDecorator from "./FilterDecorator";
import {
  useContainerStyleSchema,
  useFilterActions,
  useFilterState,
} from "./hooks";

interface IProps extends BaseFilterProps {
  options: Array<Option | FilterOption>;
  isLoading?: boolean;
  isClearable?: boolean;
  isMulti?: boolean;
}

const DropdownFilter: React.FC<IProps> = ({
  containerId,
  options,
  filteringProperty,
  navigationProperty,
  isMulti = false,
  size = "sm",
  isLoading,
  isClearable,
  className,
  withAssociatedLabel,
  labelClassName,
  label,
  style,
  placeholder,
}) => {
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
  const { styles } = useContainerStyleSchema(containerId);

  const [dropdownOpen, setOpen] = useState(false);
  const toggle = () => setOpen(!dropdownOpen);
  const [operator, setOperator] = useState(filterOperator ?? "eq");

  const updateTargetFilter = useCallback(
    (value) => updateFilter(value, { operator: operator }),
    [operator]
  );

  const updateOperator = (op: string) => {
    if (op !== operator) {
      if (filterValue) updateFilter(filterValue, { operator: op });
      setOperator(op);
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
        labelStyle={styles.label}
      >
        <InputGroup size={size} className="d-flex flex-row align-items-stretch">
          <ButtonDropdown isOpen={dropdownOpen} toggle={toggle}>
            <DropdownToggle className="p-0 m-0 rounded-start text-muted z-index-auto">
              <FontAwesomeIcon icon={faCaretDown} className="mx-1 text-light" />
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem
                active={operatorSelected("eq")}
                onClick={() => updateOperator("eq")}
              >
                In
              </DropdownItem>
              <DropdownItem
                active={operatorSelected("ne")}
                onClick={() => updateOperator("ne")}
              >
                Not In
              </DropdownItem>
            </DropdownMenu>
          </ButtonDropdown>
          <InputGroupText className="text-muted">
            <FontAwesomeIcon
              icon={faIconByOperator[operator]}
              className="filter-operator-icon"
            />
          </InputGroupText>
          <Select
            key={`${filteringProperty}-ddf`}
            options={options}
            value={filterValue}
            isMulti={isMulti}
            onChange={updateTargetFilter}
            isClearable={isClearable}
            isLoading={isLoading}
            placeholder={placeholder}
            name={filteringProperty}
            className="flex-fill"
            styles={{
              ...getDropdownStyles({ size }),
              valueContainer: (base: any) => ({ ...base, ...styles.input }),
            }}
          />
        </InputGroup>
      </FilterDecorator>
    ),
    [filterValue, isLoading, options, size, dropdownOpen, operator]
  );

  return memoizedFilter;
};

export default DropdownFilter;
