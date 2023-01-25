import logo from './logo.svg';
import './App.css';
import { Routes, Route } from "react-router-dom"
import Login from './Pages/Login';
import Home from './Pages/Home';
import Answers from './Pages/Answers';
import Graphs from './Pages/Graphs';
import RandomNum from './Pages/RandomNum';

function App() {
  return (
    <Routes>
      {/* <Route path='/' element={<Login />} /> */}
      <Route path='/' element={<Home />} />
      <Route path='/answers' element={<Answers />} />
      <Route path='/graphs' element={<Graphs />} />
      <Route path='/randomNum' element={<RandomNum />} />
    </Routes>
  );
}

export default App;
