import React, { useState } from "react";
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
