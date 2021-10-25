import { useSelector } from "react-redux";

export const useFilterifyFilter = (containerId) => ({
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

export const useFilterCounter = (containerId, excludeTreeViewFilter = true) => {
  let counter = 0;
  const propertyFilters = useSelector(
    (state) => state[containerId].propertyFilters ?? {}
  );
  const navigationPropertyFilters = useSelector(
    (state) => state[containerId].navigationPropertyFilters ?? {}
  );
  const functionFilters = useSelector(
    (state) => state[containerId].functionFilters ?? []
  );

  if (containerId) {
    counter += Object.keys(propertyFilters).length;
    counter += Object.keys(navigationPropertyFilters).length;
    counter += functionFilters.length;

    return counter;
  }
  return null;
};
