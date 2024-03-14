import Login from "./Components/Login/Login";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Admin from "./Components/Admin/Admin";
import Employee from "./Components/Employee/Employee";
import EmployeePortal from "./Components/Admin/EmployeePortal";
import ItemPortal from "./Components/Admin/ItemPortal";
import React from "react";
//import "rsuite/dist/rsuite.min.css";

//import { Button } from "rsuite";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/Admin" element={<Admin />}>
            <Route path="EmployeePortal" element={<EmployeePortal />} />
            <Route path="ItemsPortal" element={<ItemPortal />} />
          </Route>
          <Route path="/Employee" element={<Employee />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
