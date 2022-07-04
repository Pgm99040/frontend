import React from "react";
import { ToastContainer } from 'react-toastify';
import Routers from "./routes";
import './App.css';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <div className="d-flex justify-content-between" style={{minHeight : '100vh', alignItems : "stretch", flexDirection : "column"}}>
      <Routers/>
        <ToastContainer position={"top-right"} autoClose={3000} limit={4}/>
    </div>
  );
}

export default App;
