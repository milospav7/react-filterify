import React, { useMemo } from "react";
import { Button } from "reactstrap";
import { useActiveFiltersCounter, useContainerActions } from "./hooks";

interface IResetFiltersButtonProps {
  containerId: string;
  className?: string;
  label?: string;
}

const ResetFiltersButton: React.FC<IResetFiltersButtonProps> = ({
  containerId,
  className = "cursor-pointer btn btn-danger",
  label = "Clear filters",
}) => {
  const filtersCounter = useActiveFiltersCounter(containerId);
  const { removeAllFilters } = useContainerActions(containerId);

  const memoizedFilter = useMemo(
    () => (
      <Button
        size="sm"
        className={className}
        disabled={filtersCounter === 0}
        onClick={removeAllFilters}
      >
        {label}
      </Button>
    ),
    [className, filtersCounter, label, removeAllFilters]
  );

  return memoizedFilter;
};

export default ResetFiltersButton;
