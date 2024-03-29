import { useState, useRef, useMemo, useCallback } from "react";
import DatePicker from "react-datepicker";
// import enGb from "date-fns/locale/en-GB";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import {
  InputGroup,
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
import RenderIf from "../shared/RenderIf";
import {
  useContainerStyleSchema,
  useFilterActions,
  useFilterState,
} from "../../store/hooks";
import { BaseFilterProps } from "../../store/interfaces";
import FilterDecorator from "../shared/FilterDecorator";

const operatorSymbols: Record<string, string> = {
  eq: "eq",
  ne: "ne",
  gt: "gt",
  ge: "ge",
  lt: "lt",
  le: "le",
};

const faIconByOperator: Record<string, any> = {
  eq: faEquals,
  ne: faNotEqual,
  gt: faGreaterThan,
  ge: faGreaterThanEqual,
  lt: faLessThan,
  le: faLessThanEqual,
};

const dateFormat = "dd/MM/yyyy".replace("DD", "dd").replace("YYYY", "yyyy");
const dateTimeFormat = "dd/MM/yyyy HH:mm"
  .replace("DD", "dd")
  .replace("YYYY", "yyyy");

interface IProps extends BaseFilterProps {
  hideDateTimeSwitch?: boolean;
}

const DateTimeFilter: React.FC<IProps> = ({
  containerId,
  filteringProperty,
  hideDateTimeSwitch = false,
  placeholder,
  navigationProperty,
  className,
  withLabel,
  labelClassName,
  label,
  style,
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
  const [operator, setOperator] = useState(
    filterOperator ?? operatorSymbols.eq
  );
  const [showTime, setShowTime] = useState(false);
  const inputRef = useRef<any>();

  const toggleOperatorDropdown = useCallback(
    () => setOpen(!dropdownOpen),
    [dropdownOpen]
  );
  const toggleTimeComponent = useCallback(
    () => setShowTime(!showTime),
    [showTime]
  );

  const selectedDatetime = useMemo(() => {
    if (filterValue) return moment(filterValue).toDate();
    return null;
  }, [filterValue]);

  const updateDatetimeFilter = useCallback(
    (date) => {
      updateFilter(date, { operator });
    },
    [operator, updateFilter]
  );

  const updateOperator = useCallback(
    (op) => {
      if (op !== operator) {
        const date = inputRef.current?.props.selected;
        setOperator(op);
        updateFilter(date, { operator: op });
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
        withLabel={withLabel}
        className={className}
        labelClassName={labelClassName}
        label={label}
        style={style}
        labelStyle={styles.label}
      >
        <InputGroup size="sm">
          <ButtonDropdown isOpen={dropdownOpen} toggle={toggleOperatorDropdown}>
            <DropdownToggle className="p-0 m-0 rounded-left text-muted z-index-auto">
              <FontAwesomeIcon icon={faCaretDown} className="mx-1 text-light" />
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

          <InputGroupText>
            <FontAwesomeIcon
              icon={faIconByOperator[operator]}
              className="filter-operator-icon"
            />
          </InputGroupText>
          <DatePicker
            ref={inputRef}
            key={`${filteringProperty}-dtmfltr`}
            showTimeSelect={showTime}
            className="form-control form-control-sm"
            wrapperClassName="width-auto col m-0 p-0 rounded-right"
            dateFormat={showTime ? dateTimeFormat : dateFormat}
            selected={selectedDatetime}
            onChange={updateDatetimeFilter}
            isClearable
            placeholderText={placeholder ?? label ?? filteringProperty}
          />
          <RenderIf condition={!hideDateTimeSwitch}>
            <InputGroupText
              onClick={toggleTimeComponent}
              className="cursor-pointer"
            >
              <FontAwesomeIcon icon={faCalendarAlt} fixedWidth />
              {showTime && (
                <FontAwesomeIcon className="ms-1" icon={faClock} fixedWidth />
              )}
            </InputGroupText>
          </RenderIf>
        </InputGroup>
      </FilterDecorator>
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filterValue, dropdownOpen, showTime, operator]
  );

  return memoizedFilter;
};

export default DateTimeFilter;
