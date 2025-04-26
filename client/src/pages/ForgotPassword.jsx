import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { IoArrowBackOutline } from "react-icons/io5";
import { userAuthStore } from '../authstore/userstore';
import { IoMdMailUnread } from "react-icons/io";
import {toast} from 'react-hot-toast'
import Loading from '../components/loading';
const ForgotPassword = () => {

  const [email,setemail] = useState('')
  const [isSubmitted,setisSubmitted] = useState(false)
  const {isLoading , forgotPassword} = userAuthStore()
  const handlesubmit = async(e)=>{
      e.preventDefault()
      try {

        await forgotPassword(email)
        setisSubmitted(true)
        
      } catch (error) {
          toast.error(error.response.data.message)
      }
     
  }

  return (
    <div className='flex items-center min-h-screen justify-center  '>
      <div className='flex flex-col '>
      
             <h1 className='font-bold  shadow-2xl text-xl text-center bg-white p-2 text-[#031a19]'>Forgot Password</h1>
             {!isSubmitted ?(
                <form onSubmit={handlesubmit} className='flex flex-col items-center gap-2  shadow-2xl max-w-md w-full p-8 bg-white'>
                  <p className='text-center'>Enter your email address and we'll send you a link to rest your password</p>
                  <input type='email'
                   placeholder='Enter Your Email Address Here'
                   className='w-full border px-4 py-2 focus:outline-none focus:ring-offset-1 focus:ring-1 focus:ring-offset-[#0e6e6d] rounded-md'
                   autoComplete='email'
                   value={email}
                   onChange={(e)=>setemail(e.target.value)}
                   required 
                   />
                   <button type='submit' 
                   disabled={isLoading}
                   className="flex items-center justify-center w-full font-bold  text-[#031a19] bg-[#5bb1af] py-2 cursor-pointer mt-2 rounded-md transition-transform duration-200 active:scale-[0.95] hover:scale-[1.02] ">
                    {isLoading ? <Loading/> : "Send Reset Link"}
                    </button>
                  
             </form>

             ):(<div className='flex flex-col justify-center gap-2 max-w-md w-full bg-white p-8'>
              <p className='text-xl font-semibold text-center'>Check Your Email</p>
                 <p className='flex justify-center '><IoMdMailUnread color='darkgreen' size={30}/></p>
                 
                <p className='mb-3 text-center'>We've sent a reset link to <strong>{email}</strong>, if it's linked to an account.</p> 
             </div>)}
             
         
        <div className='px-8 py-2 flex justify-center bg-[#0e3547] '>
				<Link to={"/login"} className=' gap-1  text-[#d6fffd]  font-medium hover:underline flex items-center'>
					<IoArrowBackOutline />back to Login 
				</Link>
			</div>
      </div>
       
          
    </div>
  )
}

export default ForgotPassword
