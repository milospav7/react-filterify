import { useSelector } from "react-redux";

export const useGridFilter = (containerId) => ({
  propertyFilters: useSelector(
    (state) => state?.[containerId]?.propertyFilters
  ),
  navigationPropertyFilters: useSelector(
    (state) => state?.[containerId]?.navigationPropertyFilters
  ),
  functionFilters: useSelector(
    (state) => state?.[containerId]?.functionFilters
  ),
  dateTimeUpdated: useSelector(
    (state) => state?.[containerId]?.dateTimeUpdated
  ),
});
