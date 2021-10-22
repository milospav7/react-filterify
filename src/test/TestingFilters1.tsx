import React from "react";
import { Label } from "reactstrap";
import DropdownFilter from "../components/DropdownFilter";
import NumericFilter from "../components/NumericFilter";
import TextFilter from "../components/TextFilter";

export const yesNo = [
  { value: "true", label: "Yes" },
  { value: "false", label: "No" },
];

const navPropertyNames = {
  OPERATIONAL_REGION: "OperationalRegion",
  OUTAGE_REGION: "OutageRegion",
  MAINTENANCE_REGION: "MaintenanceRegion",
  BIDDING_ZONE: "BiddingZone",
  SUBSTATION: "Substation",
};
interface IProps {
  containerId: string;
  resetOnUnmount?: boolean;
  wrapperClassName?: string;
}

const TestingFilters1: React.FC<IProps> = ({
  containerId,
  wrapperClassName = "",
}) => (
  <div className={wrapperClassName}>
    <div className="mb-2">
      <Label for="Substation" className="pb-0 text-muted" size="sm">
        Substation
      </Label>
      <TextFilter
        key="sbs"
        isNavigationProperty
        navigationPropertyName="OutageItems/RelatedSubstations"
        navigationPropertyFilterField="SubstationName"
        isNestedNavigationProperty
        containerId={containerId}
        filterName={navPropertyNames.SUBSTATION}
      />
    </div>
    <div className="mb-2">
      <Label for="BiddingZoneID" className="pb-0 text-muted" size="sm">
        Bidding Zone
      </Label>
      <DropdownFilter
        key="bndgz"
        size="sm"
        containerId={containerId}
        isNavigationProperty
        isNestedNavigationProperty
        navigationPropertyName="OutageItems/RelatedSubstations"
        filterName={navPropertyNames.BIDDING_ZONE}
        options={["Zone 1", "Zone 2", "Zone 3"].map((v) => ({
          label: v,
          value: v,
        }))}
        isMulti
        isClearable
      />
    </div>
    <div className="mb-2">
      <Label for="PlanStatusID" className="pb-0 text-muted" size="sm">
        PlanStatus
      </Label>
      <DropdownFilter
        key="plsts"
        size="sm"
        containerId={containerId}
        filterName="PlanStatus"
        options={["Created", "Approved", "Delayed"].map((v) => ({
          label: v,
          value: v,
        }))}
        isMulti
        isClearable
      />
    </div>
    <div className="mb-2">
      <Label for="PlanYear" className="pb-0 text-muted" size="sm">
        PlanYear
      </Label>
      <NumericFilter
        key="ply"
        displayName="PlanYear"
        filterName="PlanYear"
        containerId={containerId}
      />
    </div>
    <div className="mb-2">
      <Label for="IsContinuous" className="pb-0 text-muted" size="sm">
        IsContinuous
      </Label>
      <DropdownFilter
        key="iscnt"
        size="sm"
        containerId={containerId}
        filterName="IsContinuous"
        options={yesNo}
        isBoolean
        isClearable
      />
    </div>

    <div className="mb-2">
      <Label
        for="IsSwitchingOrderRequired"
        className="pb-0 text-muted"
        size="sm"
      >
        IsSwitchingOrderRequired
      </Label>
      <DropdownFilter
        key="iswrq"
        size="sm"
        containerId={containerId}
        filterName="IsSwitchingOrderRequired"
        options={yesNo}
        isBoolean
        isClearable
      />
    </div>
    <div className="mb-4">
      <Label for="UserName" className="pb-0 text-muted" size="sm">
        UserName
      </Label>
      <TextFilter
        key="usrnm"
        containerId={containerId}
        filterName="IpsUserNameCreated"
        displayName="UserName"
      />
    </div>
  </div>
);

export default TestingFilters1;
