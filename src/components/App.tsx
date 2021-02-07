import React, { useState, useEffect } from "react";

import Console from "./Console/Console";
import Viewport from "./Viewport/Viewport";
import "../styles/App.css";

const App = () => {
    // This is where we are going to have shared
    // state between the console and the Viewport
    const [selectedVis, setSelectedVis] = useState<string>("default");

    useEffect(() => {
        console.log("there was a change");
    }, [selectedVis]);

    return (
        <div className="App">
            <Console setSelectedVis={setSelectedVis} />
            <Viewport selectedVis={selectedVis} />
        </div>
    );
};

export default App;
