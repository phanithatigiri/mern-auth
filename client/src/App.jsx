import { Navigate, Route, Routes } from "react-router-dom"
import Signup from "./pages/signup"
import Login from "./pages/login"
import ForgotPassword from "./pages/forgotPassword"
import VerifyEmail from "./pages/VerifyEmail"
import Home from "./pages/Home"
import { Toaster } from "react-hot-toast"
import { userAuthStore } from "./authstore/userstore"
import { useEffect } from "react"
import ResetPassword from "./pages/ResetPassword"


const ProtectedAuth = ({children})=>{
    const {isAuthenticated,user} = userAuthStore()
    if(!isAuthenticated){
      return <Navigate to='/login' replace/>
    }
    if(!user.isVerified){
      return <Navigate to='/verifyEmail' replace/>
    }
  return children
}

const RedirectAuthenticatedUser = ({children})=>{
  const {isAuthenticated,user} = userAuthStore()
    if(isAuthenticated && user.isVerified){
      return <Navigate to='/' replace />
    }
    
   return children
}


function App() {
 
 

  const {isCheckingAuth,checkauth,user,isAuthenticated} = userAuthStore()

  useEffect(()=>{
      checkauth()
  },[checkauth])
   


  return (
    <>
     <div className="fixed inset-0 z-0 bg-[url('/bg.png')] bg-cover bg-center blur-[2px]" />

{/* Main content layer */}
<div className="relative z-10 min-h-screen">
  <Toaster />
  <Routes>
    <Route path='/' element={
      <ProtectedAuth>
        <Home />
      </ProtectedAuth>
    } />
    <Route path="/signup" element={
      <RedirectAuthenticatedUser>
        <Signup />
      </RedirectAuthenticatedUser>
    } />
    <Route path='/login' element={
      <RedirectAuthenticatedUser>
        <Login />
      </RedirectAuthenticatedUser>
    } />
    <Route path='/forgotPassword' element={<ForgotPassword />} />
    <Route path='/verifyEmail' element={
      <RedirectAuthenticatedUser>
        <VerifyEmail />
      </RedirectAuthenticatedUser>
    } />
    <Route path='/reset-password/:token' element={
      <RedirectAuthenticatedUser>
        <ResetPassword />
      </RedirectAuthenticatedUser>
    } />
  </Routes>
</div>
    </>
  )
}

export default App
