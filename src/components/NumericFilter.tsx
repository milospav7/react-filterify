import React, { useState, useMemo, useRef, useCallback } from "react";
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
import {
  useContainerStyleSchema,
  useFilterActions,
  useFilterState,
} from "./hooks";
import { updatePropertyFilter } from "../store/actionCreators";
import { DebouncedInputField } from "./DebouncedInputField";
import { BaseFilterProps } from "../store/interfaces";
import FilterDecorator from "./FilterDecorator";
import RenderIf from "./RenderIf";
import { numericOperatorSymbols } from "./NumericFilter.utils";
import { faIconByOperator } from "./common.utils";

interface IProps extends BaseFilterProps {
  placeholder?: string;
  useDecimal?: boolean;
  multipleOperators?: boolean;
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
  multipleOperators,
}) => {
  const [operatorsListOpen, setOperatorsListOpen] = useState(false);
  const toggleDropdown = useCallback(
    () => setOperatorsListOpen(!operatorsListOpen),
    [operatorsListOpen]
  );
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
  const operator = filterOperator ?? numericOperatorSymbols.eq;
  const { styles } = useContainerStyleSchema(containerId);

  const updateTargetFilter = useCallback(
    (value: string | null) => {
      if (value) {
        const parsed = useDecimal ? parseFloat(value) : parseInt(value, 10);
        updateFilter(parsed, { operator });
      } else updateFilter(value, { operator });
    },
    [operator, updateFilter, useDecimal]
  );

  const updateOperator = useCallback(
    (op: string) => {
      if (op !== operator) {
        const val = inputRef.current?.props.value?.toString() ?? "";
        const parsed = useDecimal ? parseFloat(val) : parseInt(val, 10);
        dispatcher(
          updatePropertyFilter(containerId, filteringProperty, parsed, op)
        );
      }
    },
    [containerId, dispatcher, filteringProperty, operator, useDecimal]
  );

  const operatorSelected = useCallback((op: string) => operator === op, [operator]);

  const filterOperators = useMemo(
    () => (
      <RenderIf condition={!!multipleOperators}>
        <InputGroupAddon addonType="prepend">
          <ButtonDropdown isOpen={operatorsListOpen} toggle={toggleDropdown}>
            <DropdownToggle
              className="p-0 m-0 rounded-left text-muted z-index-auto"
              data-testid={`${containerId}-oprs-menu-btn`}
            >
              <FontAwesomeIcon icon={faCaretDown} className="mx-1 text-light" />
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem
                active={operatorSelected(numericOperatorSymbols.eq)}
                onClick={() => updateOperator(numericOperatorSymbols.eq)}
              >
                Equal
              </DropdownItem>
              <DropdownItem
                active={operatorSelected(numericOperatorSymbols.ne)}
                onClick={() => updateOperator(numericOperatorSymbols.ne)}
              >
                Not equal
              </DropdownItem>
              <DropdownItem
                active={operatorSelected(numericOperatorSymbols.gt)}
                onClick={() => updateOperator(numericOperatorSymbols.gt)}
              >
                Greater than
              </DropdownItem>
              <DropdownItem
                active={operatorSelected(numericOperatorSymbols.ge)}
                onClick={() => updateOperator(numericOperatorSymbols.ge)}
              >
                Greater than or equal
              </DropdownItem>
              <DropdownItem
                active={operatorSelected(numericOperatorSymbols.lt)}
                onClick={() => updateOperator(numericOperatorSymbols.lt)}
              >
                Less than
              </DropdownItem>
              <DropdownItem
                active={operatorSelected(numericOperatorSymbols.le)}
                onClick={() => updateOperator(numericOperatorSymbols.le)}
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
      </RenderIf>
    ),
    [
      containerId,
      operatorsListOpen,
      multipleOperators,
      operator,
      operatorSelected,
      toggleDropdown,
      updateOperator,
    ]
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
            {filterOperators}
            <DebouncedInputField
              inputRef={inputRef}
              filteringProperty={filteringProperty}
              filterValue={filterValue}
              onChange={updateTargetFilter}
              type="number"
              placeholder={placeholder ?? label}
              style={styles.input}
            />
          </InputGroup>
        </>
      </FilterDecorator>
    ),
    [
      withAssociatedLabel,
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

export default NumericFilter;
