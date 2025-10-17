import "./global.css";
import { createRoot } from "react-dom/client";
import App from "./App";

const container = document.getElementById("root")!;
const anyWin = window as any;
if (!anyWin.__REACT_ROOT__) {
  anyWin.__REACT_ROOT__ = createRoot(container);
}
anyWin.__REACT_ROOT__.render(<App />);
