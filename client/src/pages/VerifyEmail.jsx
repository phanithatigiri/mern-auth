import React, { useState, useRef} from 'react';
import { userAuthStore } from '../authstore/userstore';
import {toast} from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import Loading from '../components/loading';

const VerifyEmail = ({ onSubmit }) => {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const inputRef = useRef([]);
  

  const navigate= useNavigate()

  const {verifyEmail,error,isLoading} = userAuthStore()

  const handleChange = (e, index) => {
    const value = e.target.value;

    if (!/^\d*$/.test(value)) return; // only allow digits

    const updatedOtp = [...otp];

    // Handle paste (if more than one digit)
    if (value.length > 1) {skype
      const pasted = value.slice(0, 6).split("");
      for (let i = 0; i < 6; i++) {
        updatedOtp[i] = pasted[i] || "";
      }
      setOtp(updatedOtp);
      const nextIndex = pasted.findIndex((d) => d === "");
      inputRef.current[nextIndex === -1 ? 5 : nextIndex]?.focus();
      return;
    }

    // Regular one digit input
    updatedOtp[index] = value;
    setOtp(updatedOtp);

    if (value && index < 5) {
      inputRef.current[index + 1].focus();
    }
  };

  const handleBackspace = (e, index) => {
    if (e.key === "Backspace") {
      const updatedOtp = [...otp];

      if (otp[index] === "") {
        if (index > 0) {
          inputRef.current[index - 1]?.focus();
        }
      } else {
        updatedOtp[index] = "";
        setOtp(updatedOtp);
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6).split("");
    const newOtp = otp.map((_, i) => pastedData[i] || "");
    setOtp(newOtp);

    const lastFilledIndex = pastedData.findIndex((v) => v === "");
    inputRef.current[lastFilledIndex === -1 ? 5 : lastFilledIndex]?.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    const joinedOtp = otp.join("");

   try {
    await verifyEmail(joinedOtp)
    toast.success("Email Verified Successfully")
     navigate('/')  
   } catch (error) {
      console.log(error)
   }
  };

  

  return (
    <div className='min-h-screen flex justify-center items-center p-4  '>
       <div className=' p-8  text-center shadow-2xl bg-white'>
        <h1 className='text-2xl font-semibold'>Verify Your Email</h1>
        <p className='mb-6'>Enter the 6-digit code sent to your email address.</p>
       <form onSubmit={handleSubmit} className='flex flex-col gap-2'>
        <div className='flex gap-2 justify-center'>
        {otp.map((digit, index) => (
    <input
      key={index}
      type='text'
      value={digit}
      onChange={(e) => handleChange(e, index)}
      onKeyDown={(e) => handleBackspace(e, index)}
      onPaste={handlePaste}
      maxLength={1}
      ref={(el) => (inputRef.current[index] = el)}
      className='w-10 h-10 border border-gray-800 rounded text-center text-lg focus:outline-none focus:ring-2 focus:ring-black'
    />
  ))}  

        </div>

        {error && <p className='text-red-600  mt-2'>{error}</p>}
        
<button
  type='submit'
  className=' text-white bg-[#0e3547] py-2 px-4 rounded-md disabled:opacity-50 cursor-pointer mt-2 self-center'
>
  {isLoading ? <Loading/>:"Verify Email"}
  
</button>

      </form>
       </div>
    
    
     </div>
  );
};

export default VerifyEmail;
