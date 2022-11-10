import "./App.css";
import PathFindingVisualizer from "./components/PathFindingVisualizer/PathFindingVisualizer";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      <Toaster position="top-right" />
      <PathFindingVisualizer />
    </>
  );
}

export default App;
