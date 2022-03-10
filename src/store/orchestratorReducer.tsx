import { containerInitialState, containerReducer } from "./containerReducer";
import {
  Container,
  FilterConfiguration,
  ValueTypedObject,
} from "./types";

let FILTER_CONTAINERS: ValueTypedObject<Container> = {};

const getStorageKey = (containerId: string) =>
  `${containerId}_filterify_container`; // HERE WE CAN MODIFY SELECTOR KEY

const tryGetInitStateFromStorage = (
  containerId: string,
  defaultState: Container
) => {
  try {
    const fromLocalStorage = localStorage.getItem(getStorageKey(containerId));
    if (fromLocalStorage) return JSON.parse(fromLocalStorage);
    return defaultState;
  } catch (_error) {
    return defaultState; // fallback if somehow parsing fails
  }
};

const shouldSaveInStorage = (id: string) =>
  FILTER_CONTAINERS[id]?.saveToLocalStorage;

const filterifyFilters = (state = FILTER_CONTAINERS, action: any) => {
  if (!action.id) return state;

  const container = state[action.id];
  const updatedFiltersContainer = containerReducer(container, action);

  const enrichedFilterState = {
    ...updatedFiltersContainer,
    dateTimeUpdated: new Date().toString(), // Enrich for datetime stamp
  };
  if (shouldSaveInStorage(action.id))
    localStorage.setItem(
      getStorageKey(action.id),
      JSON.stringify(enrichedFilterState)
    );

  return {
    ...state,
    [action.id]: enrichedFilterState,
  };
};

export const configureFilterfyReducer = (
  preconfigurations: FilterConfiguration[]
) => {
  if (preconfigurations.length === 0)
    throw new Error(
      "Filteirfy reducer configurator function 'configureFilterfyReducer' must receive at least one filter configuration."
    );

  preconfigurations.forEach((config: FilterConfiguration) => {
    let initialState = config.saveToLocalStorage
      ? tryGetInitStateFromStorage(config.id, containerInitialState)
      : containerInitialState;

    FILTER_CONTAINERS[config.id] = {
      ...initialState,
      saveToLocalStorage: config.saveToLocalStorage,
      styleSchema: config.styleSchema,
    };
  });

  return filterifyFilters;
};
