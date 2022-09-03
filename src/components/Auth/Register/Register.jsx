import Axios from 'axios'
import Joi from 'joi'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
// import Axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import timers from "jquery";

export default function Register() {
  // validation
  const [email, setemail] = useState(false)
  const [first_name, setfirst_name] = useState(false)
  const [last_name, setlast_name] = useState(false)
  const [isAge, setisAge] = useState(false)
  const [password, setpassword] = useState(false)

  // value care object content data of user
  const [user, setUser] = useState({
    first_name: '',
    last_name: '',
    age: 0,
    email: '',
    password: ''
  })
  const [Error, setError] = useState(null)
  const [isLoading, setisLoading] = useState(false)
  const [ErrorValidation, setErrorValidation] = useState(null)
  

  function validationRegisterFrom() {
    let schema = Joi.object({
      first_name: Joi.string().alphanum().required().max(10).min(3),
      last_name: Joi.string().alphanum().required().max(10).min(3),
      age: Joi.number().required().max(60).min(16),
      email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
      password: Joi.string().pattern(new RegExp('^[A-Z][a-z0-9]{3,10}$')),

    })
    return schema.validate(user, { abortEarly: false })
  }
  let Navigate = useNavigate()
  // change user of data 
  function getUserData(e) {
    //Deep  cope
    let myUser = { ...user }
    // action
    myUser[e.target.name] = e.target.value
    setUser(myUser)
  }
  async function submitRegisterForm(e) {
    e.preventDefault()
    let ErrorValidation = validationRegisterFrom()
    if (ErrorValidation.error) {
      setErrorValidation(ErrorValidation.error.details)
      toast.error(ErrorValidation.error.details)
      let x = ErrorValidation.error.details
      // validation
      let first_name=x.filter((x) => x.context.key == 'first_name').map((x)=>x.message).toString()
      setfirst_name(first_name)
      let last_name=x.filter((x) => x.context.key == 'last_name').map((x)=>x.message).toString()
      setlast_name(last_name)
      let age=x.filter((x) => x.context.key == 'age').map((x)=>x.message).toString()
      setisAge(age)
      let email=x.filter((x) => x.context.key == 'email').map((x)=>x.message).toString()
      setemail(email)
      let password=x.filter((x) => x.context.key == 'password').map((x)=>x.message).toString()
      setpassword(password)
    } else {
      setisLoading(true)
      let { data } = await Axios.post('https://routeegypt.herokuapp.com/signup', user)
      setisLoading(false)
       if (data.message == 'success') {
        setisLoading(true)
        toast.success(data.message + ' ' + 'to register')
        setTimeout(() => {
          // Calling Apis
          Navigate('/login')
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

      <div className='mx-auto w-Form  mt-4'>
        <h1 className='text-center text-light'>Register Now</h1>

        <form onSubmit={submitRegisterForm} >
          <div className='mt-3'>
            <label htmlFor='first_name ' className='h4  text-light'>First Name</label>
            <input onChange={getUserData} placeholder='Enter your First Name' type="text" className='form-control p-2 text-dark' id='first_name' name='first_name' />
            {
              first_name? <div className="text-danger" role="alert">
                <span>{first_name}</span>
              </div> :''
            }
          </div>
          <div className='mt-3'>
            <label htmlFor='last_name' className='h4 text-light'>Last Name</label>
            <input onChange={getUserData} placeholder='Enter your last Name' type="text" className='form-control p-2 text-dark' id='last_name' name='last_name' />
            {
              last_name? <div className="text-danger" role="alert">
                <span>{last_name}</span>
              </div> :''
            }
          </div>
          <div className='mt-3'>
            <label htmlFor='age' className='h4 text-light'>Age</label>
            <input onChange={getUserData} placeholder='Enter your Age' type="number" className='form-control p-2 text-dark' id='age' name='age' />
            {
              isAge?<div className="text-danger" role="alert">
                <span>{isAge}</span>
              </div> :''
            }
          </div>
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
                <button className='btn btn-outline-primary w-100 p-2 rounded-pill '>Register</button>

            }
          </div>
        </form>
      </div>
    </>
  )
}
