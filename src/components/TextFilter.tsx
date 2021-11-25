import React, { useState, useMemo, useCallback } from "react";
import { useRef } from "react";
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
import {
  useFilterActions,
  useFilterState,
  useContainerState,
  useContainerStyleSchema,
} from "./hooks";
import { DebouncedInputField } from "./DebouncedInputField";
import { BaseFilterProps } from "../store/interfaces";
import FilterDecorator from "./FilterDecorator";

const operatorSymbols: ValueTypedObject<string> = {
  contains: "contains",
  doesnotcontain: "doesnotcontain",
  startswith: "startswith",
  endswith: "endswith",
  eq: "eq",
  ne: "ne",
};

const faIconByOperator: ValueTypedObject<any> = {
  contains: faCommentDots,
  doesnotcontain: faCommentSlash,
  notlike: faCommentSlash,
  eq: faEquals,
  ne: faNotEqual,
  startswith: faAsterisk,
  endswith: faAsterisk,
};

//** TODO: should be moved in filter generator part and handled by centralized mechanism. Filter component should ony dispatch type of filter, it's value and selected operator, no need to determine any custom expression from ui components  */
const generateCustomExpression = (
  filteringProperty: string,
  opr: string,
  value: string
) => {
  let generatedExpression = "";

  if (opr === "eq" || opr === "ne")
    generatedExpression = `(s/${filteringProperty} ${opr} '${value}')`;
  else if (opr === "contains")
    generatedExpression = `contains(s/${filteringProperty}, '${value}')`;
  else if (opr === "doesnotcontain")
    generatedExpression = `(indexof(s/${filteringProperty}, '${value}') eq -1)`;
  else if (opr === "startswith" || opr === "endswith")
    generatedExpression = `${opr}(s/${filteringProperty}, '${value}')`;

  return generatedExpression;
};

const TextFilter: React.FC<BaseFilterProps> = ({
  containerId,
  filteringProperty,
  navigationProperty,
  className,
  withAssociatedLabel,
  labelClassName,
  label,
  style,
  placeholder,
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

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [operator, setOperator] = useState(getInitialOperator());
  const inputRef = useRef<Input>(null);
  const toggleDropdown = useCallback(
    () => setDropdownOpen(!dropdownOpen),
    [dropdownOpen]
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
        <>
          <InputGroup size="sm">
            <InputGroupAddon addonType="prepend">
              <ButtonDropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
                <DropdownToggle
                  data-testid={`${containerId}-oprs-menu-btn`}
                  className="p-0 m-0 rounded-left text-muted z-index-auto"
                >
                  <FontAwesomeIcon
                    icon={faCaretDown}
                    className="mx-1 text-light"
                  />
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
                    onClick={() =>
                      updateOperator(operatorSymbols.doesnotcontain)
                    }
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
            </InputGroupAddon>
            <InputGroupAddon addonType="prepend">
              <InputGroupText className="text-muted">
                {operator === operatorSymbols.endswith && (
                  <span style={{ lineHeight: "1" }} className="mr-1">
                    ....
                  </span>
                )}
                <FontAwesomeIcon
                  icon={faIconByOperator[operator]}
                  style={{ fontSize: ".9em" }}
                />
                {operator === operatorSymbols.startswith && (
                  <span style={{ lineHeight: "1" }} className="ml-1">
                    ....
                  </span>
                )}
              </InputGroupText>
            </InputGroupAddon>
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filterValue, dropdownOpen]
  );

  return memoizedFilter;
};

export default TextFilter;
