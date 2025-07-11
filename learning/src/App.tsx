import { Routes, Route, Link } from 'react-router-dom';

import DinoOrNot from "./dinoOrNot"
import WhereFrom from "./WhereFrom"
import Devtools from "./DevTools"
function App() {
  
  
  return (
    <div>
    <nav className="nav">
    <Link to="/">Home</Link> | <Link to="/map">Guess Map</Link>
    </nav>
    
    <Routes>
    <Route path="/" element={<DinoOrNot />} />
    <Route path="/map" element={<WhereFrom />} />
    <Route path="/dev" element={<Devtools />} />
    </Routes>
    </div>
  );

}

export default App
