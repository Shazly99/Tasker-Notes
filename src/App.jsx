import jwtDecode from 'jwt-decode';
import React, { useEffect, useState } from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import About from './components/About/About';
import Login from './components/Auth/Login/Login';
import Register from './components/Auth/Register/Register';
import Home from './components/Home/Home';
import Navbar from './components/Navbar/Navbar';
import NotFound from './components/Notfound/NotFound';
import './Style/App.css';
 
function App() {
  const [GetTocken, setGetTocken] = useState(null)
  const [userData, setuserData] = useState(null)
 
  let ApiInfo=[userData ,GetTocken]
  let navigate=useNavigate()
  function saveuserData(){
    let encode=localStorage.getItem('userTocken')
    setGetTocken(encode)
    let decode=jwtDecode(encode)
    setuserData(decode)
  }
  useEffect(() => {
    if (localStorage.getItem('userTocken')) {
      saveuserData()
    }
  }, [])
  function logout() {
    setuserData(null)
    localStorage.removeItem('userTocken')
    navigate('/login')
  }
  // ProtectedRoute Component Function Guard in URL 
  function ProtectedRoute(props) {
    if (localStorage.getItem('userTocken') === null) {
      return <Navigate to='/login' />
    } else {
      return props.children
    }
  }
  return (
    <>
      {
        <ToastContainer  autoClose={1000}/>
      }
      <Navbar   Tocken={userData} logout={logout} />
      <Routes>
        <Route path='/' element={<ProtectedRoute><Home    /></ProtectedRoute> } />
        <Route path='/home' element={<ProtectedRoute><Home     /></ProtectedRoute>} />
        <Route path='/about' element={<About />} />
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login Tocken={userData} />} />
        <Route path='*' element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
