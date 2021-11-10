import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import { Button } from "reactstrap";
import { resetAllFilters } from "../store/actionCreators";
import { useFilterCounter } from "./hooks";

interface IClearButtonProps {
  containerId: string;
  subscribedToTreeView?: boolean;
}

const ClearButton: React.FC<IClearButtonProps> = ({
  containerId,
  subscribedToTreeView,
}) => {
  const dispatcher = useDispatch();
  const filtersCounter = useFilterCounter(containerId);

  const resetFilters = useCallback(() => {
    dispatcher(resetAllFilters(containerId, subscribedToTreeView));
  }, [dispatcher, containerId, subscribedToTreeView]);

  return (
    <Button
      size="sm"
      className="cursor-pointer btn btn-danger btn-sm"
      disabled={filtersCounter === 0}
      onClick={resetFilters}
    >
      Clear all
    </Button>
  );
};

export default ClearButton; // TODO: extend component for optional styling (to avoid hardcoded absolute postiion, that info should come from outside)
