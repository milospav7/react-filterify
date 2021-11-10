import ReactJson from "react-json-view";
import "./App.css";
import "./style/style.css";
import { useFilterifyFilter } from "./components/hooks";
import UserFilters from "./test/UserFilters";
import { FilterHelperMethods } from "./store/containerReducer";

function App() {
  const filter = useFilterifyFilter("F1");
  return (
    <div className="App">
      <div className="d-flex flex-row p-5">
        <div className="col-4">
          <UserFilters containerId="F1" />
        </div>
        <div className="p-3">
          <ReactJson src={filter} style={{ textAlign: "left" }} />
          {console.log(FilterHelperMethods.generateODataFilterString(filter))}
        </div>
      </div>
    </div>
  );
}

export default App;
