import React, { useContext, useState } from 'react'
import './LoginPopup.css'
import { assets } from '../../assets/assets'
import { StoreContext } from '../../context/StoreContext'
import axios from "axios"


export const LoginPopup = ({setShowLogin}) => {

  const { url, setToken, showLoading, hideLoading, showNotification } = useContext(StoreContext)

  const [currState, setCurrState] = useState ("Login")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [data, setData] = useState({
    name: "",
    email:"",
    password:""
  })

  const onChangeHandler = (event) => {
     const name = event.target.name;
     const value = event.target.value;
     setData(data=>({...data, [name]:value}))
  }
 const onLogin = async (event) => {
          event.preventDefault()
          if (currState !== "Login" && !data.name.trim()) {
            showNotification("Please enter your name to create an account.", "error")
            return
          }

          if (!data.email.trim() || !data.password) {
            showNotification("Please enter your email and password.", "error")
            return
          }

          let newUrl = url;
          if (currState==="Login") {
            newUrl += "/api/user/login"
          }
          else{
            newUrl += "/api/user/register"
          }
          setIsSubmitting(true)
          showLoading(currState === "Login" ? "Signing you in..." : "Creating your account...")

          try {
            const response = await axios.post(newUrl,data);
            if (response.data.success) {
               setToken(response.data.token);
               localStorage.setItem("token", response.data.token);
               showNotification(currState === "Login" ? "Signed in successfully." : "Account created successfully.", "success")
               setShowLogin(false)
            }
            else{
              showNotification(response.data.message, "error")
            }
          } catch (error) {
            showNotification(error.response?.data?.message || "Unable to connect to the server", "error")
          } finally {
            setIsSubmitting(false)
            hideLoading()
          }
 }

  return (
    <div className='login-popup'>
      <form onSubmit={onLogin} className="login-popup-container">
        <div className="login-popup-title">
          <h2>{currState}</h2>
          <img onClick ={()=> setShowLogin(false)} src={assets.cross_icon} alt="" />
        </div>
        <div className="login-popup-inputs">
          {currState==="Login"?<></>:<input name='name' onChange={onChangeHandler} value={data.name} type="text" placeholder='Your name' required />}
          <input name='email' onChange={onChangeHandler} value={data.email}  type="email"  placeholder='Your email' required/>
          <input  name='password' onChange={onChangeHandler} value={data.password} type="password"  placeholder='Password' required/>
        </div>
        <button type='submit' disabled={isSubmitting}>{isSubmitting ? "Please wait..." : currState==="Sign Up" ? "Create account":"Login"}</button>
        <div className="login-popup-condition">
          <input type="checkbox"  required/>
          <p>By continuing, i agree to the terms of use & privacy policy.</p>
        </div>
        {currState === "Login"
        ?<p>Create a new account? <span onClick={()=>setCurrState("Sign Up")}>Click here</span></p>
        :<p>Already have a account? <span onClick={()=>setCurrState("Login")}>Login here</span></p>
        }
      </form>
    </div>
  )
}
