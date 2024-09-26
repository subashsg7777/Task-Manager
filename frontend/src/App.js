import logo from './logo.svg';
import './App.css';
import Header from './Header';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Add from './Add';
import Notepad from './Notepad';
import Signin from './Signin';
import Login from './Login';
function App() {
  return (
    <>
    <Header />
    <Router>
      <Routes>
      <Route path='/add' element={<Add />}/>
      <Route path='/' element={<Notepad />}/>
      <Route path='/signin' element={<Signin />}/>
      <Route path='/login' element={<Login />}/>
      </Routes>
    </Router>
    </>
  );
}

export default App;
