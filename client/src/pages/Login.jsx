import React, { useState } from "react";
import { Link } from "react-router-dom";
import Loading from "../components/loading";
import { userAuthStore } from "../authstore/userstore";
import toast from "react-hot-toast";

const Login = () => {
    
    const {login,isLoading,error} = userAuthStore()
    
    const [email,setemail] =useState('')
    const [password,setpassword] =useState('')
  



    const handleSubmit = async(e) =>{
          e.preventDefault()
          try {
            await login(email,password)
            toast.success("Successfully Logged In")
           
          } catch (error) {
           
              console.log(error)
              
          }
         
    }
    return (
        <div className="min-h-screen flex justify-center items-center p-4 ">
            <form onSubmit={handleSubmit} className="p-8 w-full bg-white max-w-md rounded-md shadow-2xl">
                  <h1 className="text-center mb-4 text-xl font-bold text-[#031a19]">Welcome Back</h1>
                 <div className="flex flex-col gap-3">
                     <div className="">
                        <label className="block mb-1 text-sm font-semibold" htmlFor="email">Email</label>
                         <input 
                          type='email' 
                          id='email'
                          placeholder="Email Address"
                          className="w-full border px-4 py-2 focus:outline-none focus:ring-offset-1 focus:ring-1 focus:ring-offset-[#0e6e6d] rounded-md "
                          required
                          value={email}
                          onChange={(e)=>setemail(e.target.value)}
                          autoComplete='email'
                          />
                     </div>
                     <div>
                        <label className="block mb-1 text-sm font-semibold" htmlFor="password">password</label>
                         <input 
                          type='password' 
                          id='password'
                          placeholder="*************"
                          className="w-full border px-4 py-2 focus:outline-none focus:ring-offset-1 focus:ring-1 focus:ring-offset-[#0e6e6d] rounded-md"
                          required
                          value={password}
                          onChange={(e)=>setpassword(e.target.value)}
                          autoComplete='new-password'
                          />
                     </div>
                     
                 </div>
                  <Link  to={'/forgotPassword'}>Forgot Password?</Link>

                   {error && <p className="text-red-600">{error}</p>}

                  <button type='submit'
                   disabled={isLoading}
                   className="flex items-center justify-center w-full font-medium text-white bg-[#0e3547] py-2 cursor-pointer mt-2 rounded-md transition-transform duration-200 active:scale-[0.95] hover:scale-[1.02] ">

                    {isLoading ? <Loading size={22}/>:"Login"}
                    
                    
                    </button>
                  <div>
                  <p className="mt-2 text-center">don't you have account?{" "}<Link to={'/signup'} className="hover:underline font-bold ">Sign Up</Link></p>
                  </div>

            </form>
        </div>
    )
}

export default Login 

