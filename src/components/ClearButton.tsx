import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
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
    <button
      type="button"
      className="cursor-pointer btn btn-link btn-sm"
      style={{
        position: "absolute",
        top: "0",
        right: "0",
        zIndex: 101,
      }}
      disabled={filtersCounter === 0}
      onClick={resetFilters}
    >
      Clear all
    </button>
  );
};

export default ClearButton; // TODO: extend component for optional styling (to avoid hardcoded absolute postiion, that info should come from outside)
