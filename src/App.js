import { HashRouter, Route, Router, Routes } from "react-router-dom";
import BackupPage from "./Component/BackupPage";
import RestorePage from "./Component/RestorePage";
import HomeScreen from "./Component/HomeScreen";
import "./css/App.css";
import { KioskProvider } from "./Util/KioskContext";

function App() {
  return (
    <KioskProvider>
      <div className="Kiosk-App">
        <HashRouter>
          <Routes>
            <Route exact path="/" element={<HomeScreen />} />
            <Route path="/backup" element={<BackupPage />} />
            <Route path="/restore" element={<RestorePage />} />
          </Routes>
        </HashRouter>
      </div>
    </KioskProvider>
  );
}

export default App;
