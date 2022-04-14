import { useCallback, useEffect, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  resetAllFilters,
  updateNavigationPropertyFilter,
  updatePropertyFilter,
} from "./store/containerReducer_rt";
import { ContainerHelperMethods } from "./store/containerReducer";
import {
  FilterEventHandlers,
  FilterOperator,
  ContainerStyle,
} from "./store/types";

//#region Container specific hooks

export const useContainerState = (containerId: string) => ({
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
  dateTimeUpdated: useSelector(
    (state: any) => state.filterifyFilters[containerId]?.dateTimeUpdated
  ),
});

export const useContainerActiveFiltersCounter = (containerId: string) => {
  let counter = 0;

  const { propertyFilters, navigationPropertyFilters, functionFilters } =
    useContainerState(containerId);

  if (propertyFilters) counter += Object.keys(propertyFilters).length;
  if (navigationPropertyFilters)
    counter += Object.keys(navigationPropertyFilters).length;
  if (functionFilters) counter += functionFilters.length;

  return counter;
};

export const useContainerStyleSchema = (containerId: string) => {
  const { labelFontSize, placeholderFontSize, labelColor, highlightWhenInUse } =
    useSelector(
      (state: any) => state.filterifyFilters[containerId].styleSchema ?? {}
    );

  const containerStyle: ContainerStyle = {
    styles: {
      label: {
        fontSize: labelFontSize,
        color: labelColor,
      },
      input: {
        fontSize: placeholderFontSize,
      },
    },
    highlightWhenInUse,
  };

  return containerStyle;
};

export const useContainerSubscription = (
  containerId: string,
  eventHandlers: FilterEventHandlers,
  raiseEventOnMount = false
) => {
  const { onChange } = eventHandlers;
  const filterString = useODataFilterQuery(containerId);
  const firstRenderRef = useRef(true);
  const { current: isFirstRender } = firstRenderRef;

  const {
    propertyFilters,
    navigationPropertyFilters,
    functionFilters,
    dateTimeUpdated: dateTimeFilterUpdated,
  } = useContainerState(containerId);

  useEffect(() => {
    if (raiseEventOnMount)
      onChange(
        { propertyFilters, navigationPropertyFilters, functionFilters },
        { oDataFilterString: filterString }
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isFirstRender)
      onChange(
        { propertyFilters, navigationPropertyFilters, functionFilters },
        { oDataFilterString: filterString }
      );
    firstRenderRef.current = false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateTimeFilterUpdated]);
};

export const useContainerActions = (containerId: string) => {
  const dispatcher = useDispatch();

  const removeAllFilters = useCallback(() => {
    dispatcher(resetAllFilters({ containerId }));
  }, [dispatcher, containerId]);

  return { removeAllFilters };
};

export const useODataFilterQuery = (containerId: string) => {
  const {
    propertyFilters,
    navigationPropertyFilters,
    functionFilters,
    dateTimeUpdated,
  } = useContainerState(containerId);

  const filterQueryString = useMemo(
    () =>
      ContainerHelperMethods.generateODataFilterString({
        propertyFilters,
        navigationPropertyFilters,
        functionFilters,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dateTimeUpdated]
  );

  return filterQueryString;
};
//#endregion

//#region Single filter specific hooks

export const useFilterActions = (
  containerId: string,
  property: string,
  navigationProperty?: string
) => {
  const dispatcher = useDispatch();

  const updateFilter = useCallback(
    (
      filterValue: any,
      symbols?: FilterOperator,
      generatedExpression?: string
    ) => {
      if (navigationProperty) {
        dispatcher(
          updateNavigationPropertyFilter({
            containerId,
            navigationProperty,
            property,
            filterValue,
            generatedExpression,
          })
        );
      } else
        dispatcher(
          updatePropertyFilter({
            containerId,
            property,
            filterValue,
            operator: symbols?.operator ?? "eq",
            logic: symbols?.logic ?? "and",
          })
        );
    },
    [containerId, dispatcher, property, navigationProperty]
  );

  return { updateFilter };
};

export const useFilterState = (
  containerId: string,
  filteringProperty: string,
  navigationProperty?: string
) => {
  const { propertyFilters, navigationPropertyFilters } =
    useContainerState(containerId);
  const filterOperator = propertyFilters[filteringProperty]?.operator;

  const filterValue = useMemo(() => {
    if (navigationProperty)
      return navigationPropertyFilters[filteringProperty]?.value ?? null;
    return propertyFilters[filteringProperty]?.value ?? null;
  }, [
    filteringProperty,
    navigationProperty,
    navigationPropertyFilters,
    propertyFilters,
  ]);

  return { filterValue, filterOperator };
};
//#endregion
