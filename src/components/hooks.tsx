import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { FilteringEventHandlersType } from "../store/types";

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

export const useFilterSubscription = (
  containerId: string,
  eventHandlers: FilteringEventHandlersType,
  raiseEventOnMount = false
) => {
  const { onChange } = eventHandlers;

  const firstRenderRef = useRef(true);
  const { current: isFirstRender } = firstRenderRef;

  const {
    propertyFilters,
    navigationPropertyFilters,
    functionFilters,
    dateTimeUpdated: dateTimeFilterUpdated,
  } = useFilterifyFilter(containerId);

  useEffect(() => {
    if (raiseEventOnMount)
      onChange({ propertyFilters, navigationPropertyFilters, functionFilters });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isFirstRender)
      onChange({ propertyFilters, navigationPropertyFilters, functionFilters });
    firstRenderRef.current = false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateTimeFilterUpdated]);
};
