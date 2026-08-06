import React, { useContext, useState } from "react";
import Navbar from "./components/Navbar/Navbar";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home/Home";
import Cart from "./pages/Cart/Cart";
import PlaceOrder from "./pages/PlaceOrder/PlaceOrder";
import Footer from "./components/Footer/Footer";
import { LoginPopup } from "./components/LoginPopup/LoginPopup";
import Verify from "./pages/Verify/Verify"
import MyOrders from "./pages/MyOrders/MyOrders";
import AppNotification from "./components/AppNotification/AppNotification";
import LoadingOverlay from "./components/LoadingOverlay/LoadingOverlay";
import { StoreContext } from "./context/StoreContext";

const App = () => {
  const [showLogin, setShowLogin ] = useState(false)
  const { appLoading, notification, hideNotification } = useContext(StoreContext);

  return (
    <>
    {showLogin?<LoginPopup setShowLogin= {setShowLogin}/>: <></>}
      <LoadingOverlay active={appLoading.active} message={appLoading.message} />
      <AppNotification notification={notification} onClose={hideNotification} />
      <div className="app">
        <Navbar setShowLogin = {setShowLogin}/>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/order" element={<PlaceOrder />} />
          <Route path="/verify" element={<Verify/>}/>
          <Route path="/myorders" element={<MyOrders/>}/>
        </Routes>
      </div>
      <Footer />
    </>
  );
};

export default App;
