import { createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import { configureFilterfyReducer } from "./orchestratorReducer";

const composedEnhancers = composeWithDevTools();

const store = createStore(
  configureFilterfyReducer([
    {
      id: "F1",
      saveToLocalStorage: true,
      styleSchema: {
        highlightWhenInUse: true,
        labelColor: "red",
        labelFontSize: "13px",
        placeholderColor: "green",
      },
    },
    "F2",
  ]),
  composedEnhancers
);

export default store;
