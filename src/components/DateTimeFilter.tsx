import { useState, useRef, useMemo, useCallback } from "react";
import DatePicker from "react-datepicker";
// import enGb from "date-fns/locale/en-GB";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import {
  InputGroup,
  InputGroupAddon,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  ButtonDropdown,
  InputGroupText,
} from "reactstrap";
import {
  faCalendarAlt,
  faCaretDown,
  faClock,
  faEquals,
  faGreaterThan,
  faGreaterThanEqual,
  faLessThan,
  faLessThanEqual,
  faNotEqual,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import RenderIf from "./RenderIf";
import {
  useContainerActions,
  useSingleFilterState,
} from "./hooks";
import { BaseFilterProps } from "../store/interfaces";
import { ValueTypedObject } from "../store/types";
import FilterDecorator from "./FilterDecorator";

// registerLocale("en-gb", enGb);

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

// const dateFormat = dateFormatter.replace("DD", "dd").replace("YYYY", "yyyy");
// const dateTimeFormat = dateTimeFormatter
//   .replace("DD", "dd")
//   .replace("YYYY", "yyyy");

interface IProps extends BaseFilterProps {
  containerId: string;
  hideDateTimeSwitch?: boolean;
}

const DateTimeFilter: React.FC<IProps> = ({
  containerId,
  filteringProperty,
  hideDateTimeSwitch = false,
  placeholder,
  navigationProperty,
  className,
  withAssociatedLabel,
  labelClassName,
  label,
  style,
}) => {
  const { updateFilter } = useContainerActions(
    containerId,
    filteringProperty,
    navigationProperty
  );
  const { filterValue, filterOperator } = useSingleFilterState(
    containerId,
    filteringProperty,
    navigationProperty
  );
  const [dropdownOpen, setOpen] = useState(false);
  const [operator, setOperator] = useState(filterOperator ?? operatorsMap.eq);

  const [showTime, setShowTime] = useState(false);
  const inputRef = useRef<any>();
  const toggle = useCallback(() => setOpen(!dropdownOpen), []);

  const selectedDatetime = useMemo(() => {
    if (filterValue) return moment(filterValue).toDate();
    return null;
  }, [filterValue]);

  const updateDatetimeFilter = useCallback(
    (date) => {
      updateFilter(date, operator);
    },
    [operator, updateFilter]
  );

  const updateOperator = useCallback(
    (op) => {
      if (op !== operator) {
        const date = inputRef.current?.props.selected;
        const queryDatetime = date ?? null;
        setOperator(op);
        updateFilter(queryDatetime, op);
      }
    },
    [operator, updateFilter]
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
      >
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
          <DatePicker
            ref={inputRef}
            key={`${filteringProperty}-f`}
            showTimeSelect={showTime}
            className="form-control form-control-sm"
            wrapperClassName="width-auto col m-0 p-0 rounded-right"
            // dateFormat={showTime ? dateTimeFormat : dateFormat}
            selected={selectedDatetime}
            onChange={updateDatetimeFilter}
            isClearable
            placeholderText={placeholder ?? label ?? filteringProperty}
            locale="en-gb"
          />
          <RenderIf condition={!hideDateTimeSwitch}>
            <InputGroupAddon addonType="append">
              <InputGroupText
                onClick={() => setShowTime(!showTime)}
                className="cursor-pointer"
              >
                <FontAwesomeIcon icon={faCalendarAlt} fixedWidth />
                {showTime && (
                  <FontAwesomeIcon className="ml-1" icon={faClock} fixedWidth />
                )}
              </InputGroupText>
            </InputGroupAddon>
          </RenderIf>
        </InputGroup>
      </FilterDecorator>
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filterValue, dropdownOpen, showTime]
  );

  return memoizedFilter;
};

export default DateTimeFilter;
