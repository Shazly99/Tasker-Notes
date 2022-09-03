import React from 'react' 
export default function NotFound() {
    let img =require('../../image/404.png')
   return (
    <>
    <div className='d-flex justify-content-center'>
    <img src={img}  />
    </div>
    </>
  )
}
