import React, { useState } from "react";

import AddUserForm from "./componenets/AddUserForm";
import Home from "./componenets/Home";
import GetAlluserTable from "./componenets/GetAlluserTable";
import ExistingUser from "./componenets/ExistingUser";
import Header from "./Header";
import "../src/Tabs.css";
function App() {
  const [activeTab, setActiveTab] = useState("tab1");

  return (
    <>
      <Header activeTab={activeTab} setActiveTab={setActiveTab}/>
      
    </>
  );
}

export default App;
