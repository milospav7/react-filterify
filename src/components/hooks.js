import { useSelector } from "react-redux";

export const useGridFilter = (containerId) => ({
  propertyFilters: useSelector(
    (state) => state?.filterify?.[containerId]?.propertyFilters
  ),
  navigationPropertyFilters: useSelector(
    (state) => state?.filterify?.[containerId]?.navigationPropertyFilters
  ),
  functionFilters: useSelector(
    (state) => state?.filterify?.[containerId]?.functionFilters
  ),
  dateTimeUpdated: useSelector(
    (state) => state?.filterify?.[containerId]?.dateTimeUpdated
  ),
});
