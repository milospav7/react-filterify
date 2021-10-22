import { containerInitialState, containerReducer } from "./containerReducer";
import { ContainerType, FilterConfigurationType, ValueTypedObject } from "./types";

const getStorageKey = (containerId: string) =>
  `${containerId}_filterify_container`; // HERE WE CAN MODIFY SELECTOR KEY

const tryGetInitStateFromStorage = (containerId: string) => {
  try {
    const fromLocalStorage = localStorage.getItem(getStorageKey(containerId));
    if (fromLocalStorage) return JSON.parse(fromLocalStorage);
    return { ...containerInitialState };
  } catch (error) {
    // Exceptions.logException(error);
    return { ...containerInitialState }; // fallback if somehow parsing fails
  }
};

let prebuiltContainers: null | ValueTypedObject<ContainerType>;

const shouldSaveInStorage = (id: string) =>
  prebuiltContainers && prebuiltContainers[id]?.saveToLocalStorage;

export const filterifyReducer = (state = prebuiltContainers, action) => {
  if (prebuiltContainers && !(action.id in prebuiltContainers)) return state; // TODO: update to resolve dynamically

  const container = state[action.id];
  const updatedFiltersContainer = containerReducer(container, action);

  const enrichedFilterState = {
    ...updatedFiltersContainer,
    dateTimeUpdated: new Date().toString(),
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
  preconfigurations: string[] | FilterConfigurationType[]
) => {
  prebuiltContainers = new Map();

  preconfigurations.forEach((pc: string | FilterConfigurationType) => {
    if (typeof pc === "string") {
      prebuiltContainers[pc] = { ...containerInitialState };
    } else {
      let initialState = pc.saveToLocalStorage
        ? tryGetInitStateFromStorage(pc.id)
        : { ...containerInitialState };

      prebuiltContainers[pc.id] = {
        ...initialState,
        saveToLocalStorage: pc.saveToLocalStorage,
        globalStyleSchema: pc.globalStyleSchema,
      };
    }
  });

  return filterifyReducer;
};
