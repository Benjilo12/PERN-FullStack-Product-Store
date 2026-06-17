import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Homepage from "./pages/Homepage";
import ProductPage from "./pages/ProductPage";
import { useThemeStore } from "./store/useThemeStore";

function App() {
  const { theme } = useThemeStore();
  return (
    <div
      className="min-h-screen bg-base-200 transition-colors duration-300"
      data-theme={theme}
    >
      <Navbar />
      <Routes>
        <Route path="/" element={<Homepage />}></Route>
        <Route path="/product/:id" element={<ProductPage />}></Route>
      </Routes>
    </div>
  );
}

export default App;
