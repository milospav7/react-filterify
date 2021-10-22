import "./App.css";
import { useGridFilter } from "./components/hooks";
import TestingFilters1 from "./test/TestingFilters1";

function App() {
  const filter = useGridFilter("F1");
  return (
    <div className="App">
      <div className="d-flex flex-row p-5">
        <div className="w-25">
          <TestingFilters1 containerId="F1" />
        </div>
        <div className="p-3">{JSON.stringify(filter)}</div>
      </div>
    </div>
  );
}

export default App;
