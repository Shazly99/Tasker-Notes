 
import Axios from 'axios'
import Joi from 'joi'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
// import Axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import timers from "jquery";

export default function Login(props) {
   // validation
  const [email, setemail] = useState(false)
  const [password, setpassword] = useState(false)
  // value care object content data of user
  const [user, setUser] = useState({
    email: '',
    password: ''
  })
  const [Error, setError] = useState(null)
  const [isLoading, setisLoading] = useState(false)
  const [ErrorValidation, setErrorValidation] = useState(null)
  let Navigate = useNavigate()

  function validationLoginFrom() {
    let schema = Joi.object({
      email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
      password: Joi.string().pattern(new RegExp('^[A-Z][a-z0-9]{3,10}$')),
    })
    return schema.validate(user, { abortEarly: false })
  }

  // change user of data 
  function getUserData(e) {
    //Deep  cope
    let myUser = { ...user }
    // action
    myUser[e.target.name] = e.target.value
    setUser(myUser)
  }

  async function submitLoginForm(e) {
    e.preventDefault()
    let ErrorValidation = validationLoginFrom()
    if (ErrorValidation.error) {
      setErrorValidation(ErrorValidation.error.details)
      toast.error(ErrorValidation.error.details)
      let x = ErrorValidation.error.details
      // validation
      let email=x.filter((x) => x.context.key == 'email').map((x)=>x.message).toString()
      setemail(email)
      let password=x.filter((x) => x.context.key == 'password').map((x)=>x.message).toString()
      setpassword(password)
    } else {
      setisLoading(true)
      let { data } = await Axios.post('https://route-egypt-api.herokuapp.com/signin', user)
      setisLoading(false)
      if (data.message == 'success') {
        setisLoading(true)
        toast.success(data.message + ' ' + 'to Login')
        localStorage.setItem('userTocken',data.token)
        setTimeout(() => {
          // Calling Apis
          Navigate('/home')
        }, 2000);
        return () => clearTimeout(timers);
   
      } else {
        setisLoading(false)
        setError(data.message)
        toast.error("Error  " + " " + data.message)
      }
    }


  }
  return (
    <>

      <div className='mx-auto  w-Form   mt-4'>
        <h1 className='text-center text-light'>Login Now</h1>

        <form onSubmit={submitLoginForm} >
 
          <div className='mt-3'>
            <label htmlFor='email' className='h4 text-light'>Email</label>
            <input onChange={getUserData} placeholder='Enter your Email' type="Email" className='form-control  p-2 text-dark' id='email' name='email' />
            {
              email? <div className="text-danger" role="alert">
                <span>{email}</span>
              </div> :''
            }
          </div>
          <div className='mt-3'>
            <label htmlFor='password' className='h4 text-light'>Password</label>
            <input onChange={getUserData} placeholder='Enter your Password' type="password" className='form-control p-2 text-dark' id='password' name='password' />
            {
              password?<div className="text-danger" role="alert">
                <span>{password}</span>
              </div> :''
            }
          </div>

          <div className=' py-4 text-center'>
            {
              isLoading ?
                <button className="btn btn-primary w-100 p-2 rounded-pill" type="button" disabled>
                  <span className="spinner-border spinner-border-sm mx-2" role="status" aria-hidden="true"></span>
                  Loading...
                </button> :
                <button className='btn btn-outline-primary w-100 p-2 rounded-pill '>Login</button>

            }
          </div>
        </form>
      </div>
    </>
  )
}
