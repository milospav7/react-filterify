import ReactJson from "react-json-view";
import "./App.css";
import "./style/style.css";
import { useContainerState, useODataFilterQuery } from "./store/hooks";
import TestContainer from "./tests/TestContainer";
import { CONTAINER_IDS } from "./store/store";

function App() {
  const filter = useContainerState(CONTAINER_IDS.C1);
  const queryString = useODataFilterQuery(CONTAINER_IDS.C1);

  return (
    <div className="App">
      <div className="d-flex flex-row p-5">
        <div className="col-3">
          <h5 className="text-muted">USER FILTERS</h5>
          <TestContainer containerId={CONTAINER_IDS.C1} />
        </div>
        <div className="p-3">
          <h5 className="text-muted mb-4">IN-MEMORY STATE</h5>
          <p className="mb-2 border border-secondary rounded text-start p-2">
            Generated filter query string:{" "}
            <span className="font-weight-bold">{queryString}</span>{" "}
          </p>
          <ReactJson src={filter} style={{ textAlign: "left" }} />
        </div>
      </div>
    </div>
  );
}

export default App;
