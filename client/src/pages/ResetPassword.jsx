import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { userAuthStore } from '../authstore/userstore'
import toast from 'react-hot-toast'
import Loading from '../components/loading'

const ResetPassword = () => {
    const {token} =useParams()
    const [password,setpassword] = useState('')
    const [confirmpassword, setconfirmpassword] = useState('')
    const {resetPassword,error,isLoading,message} = userAuthStore()
     const navigate = useNavigate()

    const handleSubmit = async (e)=>{

        e.preventDefault()
        
        if(password !== confirmpassword){
            toast.error("password doesn't Matched")
            return
        }

        try {

            await resetPassword(token,password)
            navigate('/login')
            toast.success('Password reset successful')
            
        } catch (error) {
            toast.error(error.message)
        }

    }
  return (
    <div className='flex justify-center items-center min-h-screen'>
        <form onSubmit={handleSubmit} className='bg-white p-8 max-w-md w-full  '>
          <h1 className='text-center mb-6 text-xl font-bold '>Reset Password</h1>
          <label htmlFor='newpassword ' className='block font-medium text-sm'>New Password</label>
          <input type='password' placeholder='***********'
           className='w-full border px-4 py-2 focus:outline-none focus:ring-offset-1 focus:ring-1 focus:ring-offset-[#0e6e6d] rounded-md'
           id='newpassword'
           value={password}
           onChange={(e)=>setpassword(e.target.value)}
           required
          />
          
          <label htmlFor='confirmpassword' className='block font-medium text-sm mt-3'>confirm Password</label>
          <input type='password' placeholder='***********'
           className='w-full border px-4 py-2 focus:outline-none focus:ring-offset-1 focus:ring-1 focus:ring-offset-[#0e6e6d] rounded-md'
           id='confirmpassword'
           value={confirmpassword}
           onChange={(e)=>setconfirmpassword(e.target.value)}
           required
          />
        
         {error && <p className='text-red-500 font-medium mt-2'>{error}</p>}
         {message && <p className='text-green-500  mb-4 font-medium mt-4'>{message}</p>}

          <button type='submit' disabled={isLoading} className='bg-[#0e3547] text-white rounded-md w-full mt-4 flex justify-center py-2 hover:scale-[1.03] active:scale-[0.99] cursor-pointer'>
            {isLoading ? <Loading/> :"set New Password" }
            
            </button>
         
        </form> 
    </div>
  )
}

export default ResetPassword
