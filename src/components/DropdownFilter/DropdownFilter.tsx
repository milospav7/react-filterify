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
import { BaseFilterProps } from "../../store/interfaces";
import { FilterOption } from "../../store/types";
import { faIconByOperator } from "../shared/common.utils";
import { getDropdownStyles } from "./DropdownFilter.utils";
import FilterDecorator from "../shared/FilterDecorator";
import {
  useContainerStyleSchema,
  useFilterActions,
  useFilterState,
} from "../../hooks";

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
  withLabel,
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
  const toggle = useCallback(() => setOpen((p) => !p), []);
  const [operator, setOperator] = useState(filterOperator ?? "eq");

  const updateTargetFilter = useCallback(
    (value) => updateFilter(value, { operator: operator }),
    [operator, updateFilter]
  );

  const updateOperator = useCallback(
    (op: string) => {
      if (op !== operator) {
        if (filterValue) updateFilter(filterValue, { operator: op });
        setOperator(op);
      }
    },
    [filterValue, operator, updateFilter]
  );

  const operatorSelected = useCallback(
    (op: string) => operator === op,
    [operator]
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
    [
      withLabel,
      className,
      labelClassName,
      label,
      style,
      styles.label,
      styles.input,
      size,
      dropdownOpen,
      toggle,
      operatorSelected,
      operator,
      filteringProperty,
      options,
      filterValue,
      isMulti,
      updateTargetFilter,
      isClearable,
      isLoading,
      placeholder,
      updateOperator,
    ]
  );

  return memoizedFilter;
};

export default DropdownFilter;
