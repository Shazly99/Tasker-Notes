import jwtDecode from 'jwt-decode'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'

export default function Navbar(props) {
  let img = require('../../image/notes.png')
  let tocken = localStorage.getItem('userTocken')
    
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-transparent">
        <div className="container-fluid ">
          <Link to="home" className="navbar-brand fw-bolder d-flex flex-row justify-content-center align-items-center  mx-2"  >
            <img width={30} src={img} alt="" /> <span className='Note h2 mx-2  fw-bolder'>Note</span>
          </Link>
          <button className="navbar-toggler border-2  " type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon "></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              {
                tocken ?
                <li className="nav-item">
                <Link to='home' className="nav-link mt-2 h3 active" aria-current="page" >Task</Link>
              </li>:''
              }

            </ul>
            <form className="navbar-nav ms-auto mb-2 mb-lg-0">
              {
                !tocken?
                
                  <>
                    <li className="nav-item">
                      <Link to='register' className="nav-link" >Register</Link>
                    </li>
                    <li className="nav-item">
                      <Link to="login" className="nav-link" >Login</Link>
                    </li>
                  </>  :
                      <>     <li className="nav-item">
                      <a onClick={props.logout} className=" nav-link" >
                        <span className='fw-bolder solid text-muted'>  Logout </span><i className="mx-1 fa-solid fa-right-from-bracket"></i>
                        </a>
                    </li></>
              }

            </form>
          </div>
        </div>
      </nav>
    </>
  )
}
