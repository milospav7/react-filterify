import ReactJson from "react-json-view";
import "./App.css";
import "./style/style.css";
import {
  useContainerState,
  useODataFilterQuery,
} from "./components/hooks";
import UserFilters from "./test/UserFilters";

function App() {
  const filter = useContainerState("F1");
  const queryString = useODataFilterQuery("F1");

  return (
    <div className="App">
      <div className="d-flex flex-row p-5">
        <div className="col-4">
          <h5 className="text-muted">USER FILTERS</h5>
          <UserFilters containerId="F1" />
        </div>
        <div className="p-3">
          <h5 className="text-muted mb-4">FILTERS IN-MEMORY STATE</h5>
          <p className="mb-2 border border-secondary rounded text-left p-2">
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
