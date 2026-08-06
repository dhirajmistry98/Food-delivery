import React, { useContext, useEffect } from 'react'
import './Verify.css'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';

const Verify = () => {

const[searchParams] = useSearchParams();
const success = searchParams.get("success")
const orderId = searchParams.get("orderId")
const {url, showNotification} = useContext(StoreContext);
const navigate = useNavigate()


const verifyPayment = async () => {
  try {
    const response = await axios.post(url+"/api/order/verify",{success,orderId});
    if (response.data.success) {
       showNotification("Payment verified successfully.", "success");
       navigate("/myorders");
    }
    else{
      showNotification(response.data.message || "Payment was not completed.", "error");
      navigate("/")
    }
  } catch (error) {
    showNotification(error.response?.data?.message || "Unable to verify payment.", "error");
    navigate("/")
  }
}
 useEffect (()=>{
     verifyPayment();
 },[])

  return (
    <div className='verify'>
       <div className="spinner">

       </div>
    </div>
  )
}

export default Verify
