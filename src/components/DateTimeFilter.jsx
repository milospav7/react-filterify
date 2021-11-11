import { useState, useRef, useMemo, useCallback } from "react";
import { useDispatch } from "react-redux";
import DatePicker, { registerLocale } from "react-datepicker";
import enGb from "date-fns/locale/en-GB";
import ReactTooltip from "react-tooltip";
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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCaretDown,
  faCalendarAlt,
  faClock,
} from "@fortawesome/free-solid-svg-icons";
import { useContainerState } from "../outageManagement/IntentionalOutage/shared/custom_hooks";
import { updatePropertyFilter } from "./store/sharedActions";
import { translate } from "../../i18n";
import {
  dateFormatter,
  dateTimeFormatter,
} from "../../config/dateTimeSettings";
import RenderIf from "./RenderIf";

registerLocale("en-gb", enGb);

const operatorsMap = {
  eq: "eq",
  ne: "ne",
  gt: "gt",
  ge: "ge",
  lt: "lt",
  le: "le",
};

const faClassNames = {
  eq: "fas fa-equals",
  ne: "fas fa-not-equal",
  gt: "fas fa-greater-than",
  ge: "fas fa-greater-than-equal",
  lt: "fas fa-less-than",
  le: "fas fa-less-than-equal",
};

const dateFormat = dateFormatter.replace("DD", "dd").replace("YYYY", "yyyy");
const dateTimeFormat = dateTimeFormatter
  .replace("DD", "dd")
  .replace("YYYY", "yyyy");

const DateTimeFilterWithOperators = ({
  containerId,
  filteringProperty,
  hideDateTimeSwitch = false,
  placeholder = "",
}) => {
  const { propertyFilters } = useContainerState(containerId);
  const [dropdownOpen, setOpen] = useState(false);
  const [operator, setOperator] = useState(
    propertyFilters[filteringProperty].operator ?? operatorsMap.eq
  );
  const [showTime, setShowTime] = useState(false);
  const dispatcher = useDispatch();
  const inputRef = useRef();
  const toggle = () => setOpen(!dropdownOpen);

  const currentFilterValue = useMemo(() => {
    const defVal = propertyFilters[filteringProperty]?.value ?? null;
    if (defVal) return moment(defVal).toDate();
    return undefined;
  }, [filteringProperty, propertyFilters]);

  const setPropertyFilter = useCallback(
    (date) => {
      const queryDatetime = date ?? null;
      dispatcher(
        updatePropertyFilter(
          containerId,
          filteringProperty,
          queryDatetime,
          operator
        )
      );
    },
    [containerId, dispatcher, filteringProperty, operator]
  );

  const updateOperator = useCallback(
    (op) => {
      if (op !== operator) {
        const date = inputRef.current.props.selected;
        const queryDatetime = date ?? null;
        setOperator(op);
        dispatcher(
          updatePropertyFilter(
            containerId,
            filteringProperty,
            queryDatetime,
            op
          )
        );
      }
    },
    [containerId, dispatcher, filteringProperty, operator]
  );

  const operatorSelected = (op) => operator === op;

  return (
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
        <DatePicker
          ref={inputRef}
          key={`${filteringProperty}-f`}
          showTimeSelect={showTime}
          className="form-control form-control-sm"
          wrapperClassName="react-datepicker-wrapper-ips-sm width-auto col m-0 p-0 rounded-right"
          dateFormat={showTime ? dateTimeFormat : dateFormat}
          selected={currentFilterValue}
          onChange={setPropertyFilter}
          isClearable
          placeholderText={placeholder ?? filteringProperty}
          locale="en-gb"
        />
        <RenderIf condition={!hideDateTimeSwitch}>
          <InputGroupAddon addonType="append">
            <InputGroupText
              onClick={() => setShowTime(!showTime)}
              className="cursor-pointer"
            >
              <span data-tip data-for={`display-time-${filteringProperty}`}>
                <ReactTooltip
                  place="top"
                  id={`display-time-${filteringProperty}`}
                  effect="solid"
                >
                  {showTime
                    ? translate("ClickToExcludeTime")
                    : translate("ClickToIncludeTime")}
                </ReactTooltip>

                <FontAwesomeIcon icon={faCalendarAlt} fixedWidth />
                {showTime && (
                  <FontAwesomeIcon className="ml-1" icon={faClock} fixedWidth />
                )}
              </span>
            </InputGroupText>
          </InputGroupAddon>
        </RenderIf>
      </InputGroup>
    </div>
  );
};

export default DateTimeFilterWithOperators;
