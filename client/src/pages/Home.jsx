import React, { useState } from 'react'
import { userAuthStore } from '../authstore/userstore'
import Loading from '../components/Loading'



const Home = () => {
  const {user,logout,isLoading} = userAuthStore()




  const handlesubmit = async()=>{

    try {

      await logout()
      
    } catch (error) {
        console.log(error)
    }

  }

  return (
    <div className='min-h-screen flex justify-center items-center'>
       <div className='shadow-2xl p-8 flex flex-col justify-center items-center bg-white rounded-md'>
        <p className='mb-2'>Hello <strong>{user.name}</strong> </p>
        <p>You loggined as : <strong>{user.email}</strong> </p>
        <button onClick={handlesubmit} disabled={isLoading} className='text-white bg-[#0e3547] w-full rounded-md mt-5 py-2 cursor-pointer font-bold hover:scale-[1.03] active:scale-[0.9] transform transition-transform duration-300'>
          {isLoading ? <Loading/>: "Logout"}
         
          </button>
    </div>
    </div>
  )
}

export default Home
