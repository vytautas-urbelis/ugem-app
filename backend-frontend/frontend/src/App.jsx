
import React from "react";
import { APIProvider } from "@vis.gl/react-google-maps";
import Router from "./routes"
import { googleAPI } from "./utils/CONST";

function App() {

  return (
    <>
        <APIProvider apiKey={googleAPI}>
        <Router/>
        </APIProvider>
        
    </>
    
  );
}

export default App;
