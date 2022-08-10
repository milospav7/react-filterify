import { containerReducer } from "./containerReducer";
import { getStorageKey, resolveInitialState } from "./helpers";
import { Container, ContainerConfiguration } from "./types";

let CONTAINERS: Record<string, Container> = {};

const shouldSaveInStorage = (id: string) => CONTAINERS[id]?.saveToLocalStorage;

// TODO: sync with rt types
const containers = (state = CONTAINERS, action: any) => {
  const containerId = action.payload?.containerId;
  if (!containerId) return state;

  const container = state[containerId];
  const updatedFiltersContainer = containerReducer(container, action);

  const enrichedFilterState = {
    ...updatedFiltersContainer,
    dateTimeUpdated: new Date().toString(), // Enrich for datetime stamp
  };

  if (shouldSaveInStorage(containerId)) {
    const key = getStorageKey(containerId);
    localStorage.setItem(key, JSON.stringify(enrichedFilterState));
  }

  return {
    ...state,
    [containerId]: enrichedFilterState,
  };
};

export const configureFilterfyReducer = (
  preconfigurations: ContainerConfiguration[]
) => {
  if (preconfigurations.length === 0)
    throw new Error(
      "Filterify reducer configurator function 'configureFilterfyReducer' must receive at least one container configuration."
    );

  preconfigurations.forEach((config: ContainerConfiguration) => {
    const initialState = resolveInitialState(config);
    const enrichedState = {
      ...initialState,
      saveToLocalStorage: config.saveToLocalStorage,
      styleSchema: config.styleSchema,
    };

    CONTAINERS[config.id] = enrichedState;
  });

  return containers;
};
