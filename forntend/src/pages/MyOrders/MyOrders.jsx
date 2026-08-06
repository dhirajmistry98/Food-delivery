import React, { useState,useContext, useEffect } from 'react'
import './MyOrders.css'
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import { assets } from '../../assets/assets';


const MyOrders = () => {
   const {url,token,showNotification} = useContext(StoreContext);
   const [data,setData] = useState([]);
   const [loading, setLoading] = useState(true);

   const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.post(url+"/api/order/userOrders",{},{headers:{token}});
      if (response.data.success) {
        setData(response.data.data || []);
      } else {
        setData([]);
        showNotification(response.data.message || "Unable to load your orders.", "error");
      }
    } catch (error) {
      setData([]);
      showNotification(error.response?.data?.message || "Unable to load your orders.", "error");
    } finally {
      setLoading(false);
    }
   }
  useEffect (()=>{
     if (token) {
        fetchOrders();
     }
  },[token])

  return (
    <div className='my-orders'>
       <h2>My Orders</h2>
       <div className="container">
        {loading ? <p>Loading your orders...</p> : null}
        {!loading && !data.length ? <p>You have not placed any orders yet.</p> : null}
        {data.map((order,index)=>{
         return (
          <div key={index} className='my-orders-order'>
             <img src={assets.parcel_icon} alt="" />
             <p>{order.items.map((item,index) =>{
                 if (index === order.items.length-1) {
                   return item.name+" x "+item.quantity
                 } 
                 else{
                  return item.name+" x "+item.quantity+","
                 }
             })}</p>
             <p>${order.amount}.00</p>
             <p>Items: {order.items.length}</p>
             <p><span>&#x25cf;</span> <b>{order.status}</b></p>
             <button onClick={fetchOrders}>Track Order</button>
          </div>
         )
        })}
       </div>
    </div>
  )
}

export default MyOrders
