import { createStore, combineReducers } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import { configureFilterfyReducer } from "./orchestratorReducer";

export const CONTAINER_IDS = {
  C1: "C1",
  C2_Test: "C2_Test",
};

const composedEnhancers = composeWithDevTools();
const filterifyFilters = configureFilterfyReducer([
  {
    id: CONTAINER_IDS.C1,
    saveToLocalStorage: true,
    styleSchema: {
      highlightWhenInUse: true,
      labelColor: "black",
      labelFontSize: "1em",
    },
  },
  {
    id: CONTAINER_IDS.C2_Test,
    saveToLocalStorage: false,
  },
]);

const reducers = combineReducers({
  filterifyFilters,
});

const store = createStore(reducers, composedEnhancers);

export default store;
