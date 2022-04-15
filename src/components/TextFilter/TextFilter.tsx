import React, { useState, useMemo, useCallback } from "react";
import { useRef } from "react";
import {
  InputGroup,
  Input,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  ButtonDropdown,
  InputGroupText,
} from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import {
  useFilterActions,
  useFilterState,
  useContainerState,
  useContainerStyleSchema,
} from "../../hooks";
import { DebouncedInputField } from "../shared/DebouncedInputField";
import { BaseFilterProps } from "../../store/interfaces";
import FilterDecorator from "../shared/FilterDecorator";
import { generateCustomExpression, operatorSymbols } from "./TextFilter.utils";
import RenderIf from "../shared/RenderIf";
import { faIconByOperator } from "../shared/common.utils";

interface IProps extends BaseFilterProps {
  multipleOperators?: boolean;
}

const TextFilter: React.FC<IProps> = ({
  containerId,
  filteringProperty,
  navigationProperty,
  className,
  withLabel,
  labelClassName,
  label,
  style,
  placeholder,
  multipleOperators = true,
}) => {
  const { propertyFilters, navigationPropertyFilters } =
    useContainerState(containerId);

  const getInitialOperator = useCallback(() => {
    let defaultOperator = "contains";

    if (navigationProperty) {
      const supportedOperators = Object.keys(operatorSymbols);
      const existingExpression =
        navigationPropertyFilters[filteringProperty]?.generatedExpression;

      if (existingExpression) {
        const existingOperator = supportedOperators.find(
          (operator) => existingExpression.indexOf(operator) >= 0
        );
        if (existingOperator) defaultOperator = existingOperator;
      }
    } else {
      const propFOpr = propertyFilters[filteringProperty]?.operator;
      if (propFOpr) defaultOperator = propFOpr;
    }
    return operatorSymbols[defaultOperator];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [operatorsListOpen, setOperatorsListOpen] = useState(false);
  const [operator, setOperator] = useState(getInitialOperator());
  const inputRef = useRef<Input>(null);
  const toggleDropdown = useCallback(
    () => setOperatorsListOpen(!operatorsListOpen),
    [operatorsListOpen]
  );

  const { updateFilter } = useFilterActions(
    containerId,
    filteringProperty,
    navigationProperty
  );
  const { filterValue } = useFilterState(
    containerId,
    filteringProperty,
    navigationProperty
  );
  const { styles } = useContainerStyleSchema(containerId);

  const updateTargetFilter = useCallback(
    (value: any) => {
      // TODO: remove and move expression generation responsibility to reducer
      const generatedExpression = navigationProperty
        ? generateCustomExpression(filteringProperty, operator, value)
        : "";

      updateFilter(value, { operator }, generatedExpression);
    },
    [filteringProperty, navigationProperty, operator, updateFilter]
  );

  const updateOperator = useCallback(
    (op: string) => {
      if (op !== operator) {
        const generatedExpression = navigationProperty
          ? generateCustomExpression(filteringProperty, op, filterValue)
          : "";
        updateFilter(filterValue, { operator: op }, generatedExpression);
        setOperator(op);
      }
    },
    [filterValue, filteringProperty, navigationProperty, operator, updateFilter]
  );

  const operatorSelected = useCallback(
    (op: string) => operator === op,
    [operator]
  );

  const filterOperators = useMemo(
    () => (
      <RenderIf condition={!!multipleOperators}>
        <ButtonDropdown isOpen={operatorsListOpen} toggle={toggleDropdown}>
          <DropdownToggle
            data-testid={`${containerId}-oprs-menu-btn`}
            className="p-0 m-0 rounded-left text-muted z-index-auto"
          >
            <FontAwesomeIcon icon={faCaretDown} className="mx-1 text-light" />
          </DropdownToggle>
          <DropdownMenu>
            <DropdownItem
              active={operatorSelected(operatorSymbols.contains)}
              onClick={() => updateOperator(operatorSymbols.contains)}
            >
              Contains
            </DropdownItem>
            <DropdownItem
              active={operatorSelected(operatorSymbols.doesnotcontain)}
              onClick={() => updateOperator(operatorSymbols.doesnotcontain)}
            >
              Does not contain
            </DropdownItem>
            <DropdownItem
              active={operatorSelected(operatorSymbols.startswith)}
              onClick={() => updateOperator(operatorSymbols.startswith)}
            >
              Starts with
            </DropdownItem>
            <DropdownItem
              active={operatorSelected(operatorSymbols.endswith)}
              onClick={() => updateOperator(operatorSymbols.endswith)}
            >
              Ends with
            </DropdownItem>
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
          </DropdownMenu>
        </ButtonDropdown>
        <InputGroupText className="text-muted">
          {operator === operatorSymbols.endswith && (
            <span style={{ lineHeight: "1" }} className="me-1">
              ....
            </span>
          )}
          <FontAwesomeIcon
            icon={faIconByOperator[operator]}
            className="filter-operator-icon"
          />
          {operator === operatorSymbols.startswith && (
            <span style={{ lineHeight: "1" }} className="ms-1">
              ....
            </span>
          )}
        </InputGroupText>
      </RenderIf>
    ),
    [
      multipleOperators,
      operatorsListOpen,
      toggleDropdown,
      containerId,
      operatorSelected,
      operator,
      updateOperator,
    ]
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
        <>
          <InputGroup size="sm">
            {filterOperators}
            <DebouncedInputField
              inputRef={inputRef}
              filteringProperty={filteringProperty}
              filterValue={filterValue}
              onChange={updateTargetFilter}
              placeholder={placeholder ?? label}
              style={styles.input}
            />
          </InputGroup>
        </>
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
      filterOperators,
      filteringProperty,
      filterValue,
      updateTargetFilter,
      placeholder,
    ]
  );

  return memoizedFilter;
};

export default TextFilter;
