import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import EmployeeSurvey from "./pages/EmployeeSurvey";
import AdminEntries from "./pages/AdminEntries";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<EmployeeSurvey />} />
        <Route path="/admin" element={<AdminEntries />} />
      </Routes>
    </BrowserRouter>
  );
}
