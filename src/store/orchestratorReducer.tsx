import { containerInitialState, containerReducer } from "./containerReducer";
import {
  ContainerType,
  FilterConfigurationType,
  ValueTypedObject,
} from "./types";

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

let prebuiltContainers: ValueTypedObject<ContainerType>;

const shouldSaveInStorage = (id: string) =>
  prebuiltContainers && prebuiltContainers[id]?.saveToLocalStorage;

export const filterifyReducer = (state = prebuiltContainers, action: any) => {
  // if (prebuiltContainers && !(action.id in prebuiltContainers)) return state; // TODO: update to resolve dynamically
  if (!action.id) return state;

  const container = state?.[action.id];
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
  prebuiltContainers = {};

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
        styleSchema: pc.styleSchema,
      };
    }
  });

  return filterifyReducer;
};
