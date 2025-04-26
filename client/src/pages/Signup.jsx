import React, { useEffect, useState } from 'react'
import { Link, useNavigate,} from 'react-router-dom'
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"; 
import { userAuthStore } from '../authstore/userstore';
import {toast} from 'react-hot-toast';
import Loading from '../components/Loading';

const Signup = () => {

    const [showpassword,setshowpassword] = useState(false)
    const {signup,error,isLoading} = userAuthStore()
  
    const [email,setemail] = useState('')
    const [password,setpassword] = useState('')
    const [name,setname] = useState('')

   const navigate =  useNavigate()

    const handleSubmit =async (e)=>{
         e.preventDefault()
  try {

     await signup(email,password,name)
     navigate('/verifyEmail')
    
     
  } catch (error) {
     console.log(error)
  }
       
     
    }

  

  return (
    <div className='min-h-screen flex justify-center items-center p-4 z-11  '>
        <form onSubmit={handleSubmit} className=' max-w-md w-full p-8 rounded-md bg-white  shadow-2xl '>
             <h1 className='mb-4 text-xl text-center  font-bold'>Create Account </h1>
            <div className='flex flex-col gap-2 '>
                 <div>
                 <label htmlFor='fullName' className='block text-sm font-semibold mb-1'>Full Name</label>
                 <input 
                  type="text" 
                  placeholder='Enter Full Name'
                  id='fullName'
                  value={name}
                  className='w-full border px-4 py-2 focus:outline-none focus:ring-offset-1 focus:ring-1 focus:ring-offset-[#0e6e6d] rounded-md '
                  required
                  onChange={(e)=>setname(e.target.value)}
                  autoComplete='name'
                  />
                 </div>
                 <div>
                 <label htmlFor='Email' className='block font-semibold text-sm mb-1'>Email</label>
                 <input 
                   type="email"
                   placeholder='Email Address'
                   className='w-full border px-4 py-2 focus:outline-none focus:ring-offset-1 focus:ring-1 focus:ring-offset-[#0e6e6d] rounded-md'
                   required
                   value={email}
                   onChange={(e)=>setemail(e.target.value)}
                   autoComplete="email"
                   />
                 </div>
                 <div className='relative'>
                 <label htmlFor='password' className='block font-semibold text-sm mb-1'>password</label>
                 <input 
                 type={showpassword ? "text" :"password"}
                  placeholder='*********' 
                  className='w-full border px-4 py-2 focus:outline-none focus:ring-offset-1 focus:ring-1 focus:ring-offset-[#0e6e6d] rounded-md' 
                  required
                  value={password}
                  onChange={(e)=>setpassword(e.target.value)}
                  autoComplete='new-password'
                  />
                  {error && <p className='text-red-500 text-[15px] mt-2'>{error}</p>}
                   <span className='absolute right-3 top-[34px] cursor-pointer 'onClick={()=>setshowpassword((prev)=>!prev)} >
                    {showpassword ? <AiOutlineEyeInvisible size={22}/> : <AiOutlineEye size={22} />} </span>
                 </div>
                
                 <button type='submit'
                   disabled={isLoading}
                   className="flex items-center justify-center w-full font-medium text-white bg-[#0e3547] py-2 cursor-pointer mt-2 rounded-md transition-transform duration-200 active:scale-[0.95] hover:scale-[1.02] ">
                     
                    {isLoading ? <Loading/>:"Sign Up"}
                    
                    
                    </button>
            </div>
            <p className=' mt-2 text-center '>Already had an account?{" "}<Link to={'/login'} className='hover:underline text-md font-bold'>login</Link></p>
        </form>
       
       
    </div>
  )
}

export default Signup
