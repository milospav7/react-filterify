import { useSelector } from "react-redux";

export const useFilterifyFilter = (containerId: string) => ({
  propertyFilters: useSelector(
    (state: any) => state.filterifyFilters[containerId]?.propertyFilters
  ),
  navigationPropertyFilters: useSelector(
    (state: any) =>
      state.filterifyFilters[containerId]?.navigationPropertyFilters
  ),
  functionFilters: useSelector(
    (state: any) => state.filterifyFilters[containerId]?.functionFilters
  ),
  styleSchema: useSelector(
    (state: any) => state.filterifyFilters[containerId]?.styleSchema
  ),
  dateTimeUpdated: useSelector(
    (state: any) => state.filterifyFilters[containerId]?.dateTimeUpdated
  ),
});

export const useFilterCounter = (containerId: string) => {
  let counter = 0;

  const propertyFilters = useSelector(
    (state: any) => state.filterifyFilters[containerId].propertyFilters ?? {}
  );
  const navigationPropertyFilters = useSelector(
    (state: any) =>
      state.filterifyFilters[containerId].navigationPropertyFilters ?? {}
  );
  const functionFilters = useSelector(
    (state: any) => state.filterifyFilters[containerId].functionFilters ?? []
  );

  if (containerId) {
    counter += Object.keys(propertyFilters).length;
    counter += Object.keys(navigationPropertyFilters).length;
    counter += functionFilters.length;

    return counter;
  }
  return null;
};
