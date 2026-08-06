import axios from "axios";
import { createContext, useEffect, useRef, useState } from "react";


export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [cartItems, setCartItems] = useState({});
  const url = import.meta.env.VITE_API_URL || "http://localhost:4002";
  const [token, setToken] = useState("");
  const [food_list, setFoodList] = useState([]);
  const [isBootstrapping, setIsBootstrapping] = useState(true);
  const [appLoading, setAppLoading] = useState({ active: false, message: "" });
  const [notification, setNotification] = useState(null);
  const notificationTimeoutRef = useRef(null);

  const hideNotification = () => {
    setNotification(null);
    if (notificationTimeoutRef.current) {
      clearTimeout(notificationTimeoutRef.current);
      notificationTimeoutRef.current = null;
    }
  };

  const showNotification = (message, type = "info") => {
    if (!message) {
      return;
    }

    setNotification({ message, type });

    if (notificationTimeoutRef.current) {
      clearTimeout(notificationTimeoutRef.current);
    }

    notificationTimeoutRef.current = setTimeout(() => {
      setNotification(null);
      notificationTimeoutRef.current = null;
    }, 3200);
  };

  const showLoading = (message = "Loading...") => {
    setAppLoading({ active: true, message });
  };

  const hideLoading = () => {
    setAppLoading({ active: false, message: "" });
  };


  const addToCart = async (itemId) => {
    if (!cartItems[itemId]) {
      setCartItems((prev) => ({ ...prev, [itemId]: 1 }));
    } else {
      setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
    }

    if (token) {
      try {
        const response = await axios.post(url + "/api/cart/add", { itemId }, { headers: { token } });
        if (!response.data.success) {
          showNotification(response.data.message || "Unable to update your cart.", "error");
        }
      } catch (error) {
        showNotification(error.response?.data?.message || "Unable to update your cart.", "error");
      }
    }
  };

  const removeFromCart = async (itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
    if (token) {
      try {
        const response = await axios.post(url + "/api/cart/remove", { itemId }, { headers: { token } });
        if (!response.data.success) {
          showNotification(response.data.message || "Unable to update your cart.", "error");
        }
      } catch (error) {
        showNotification(error.response?.data?.message || "Unable to update your cart.", "error");
      }
    }
  };
  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        let itemInfo = food_list.find((product) => product._id === item);
        if (itemInfo) {
          totalAmount += itemInfo.price * cartItems[item];
        }
      }
    }
    return totalAmount;
  };

  const fetchFoodList = async () => {
    try {
      const response = await axios.get(url + "/api/food/list");
      if (response.data.success) {
        setFoodList(response.data.data);
      } else {
        setFoodList([]);
        showNotification(response.data.message || "Unable to load the menu right now.", "error");
      }
    } catch (error) {
      setFoodList([]);
      showNotification(error.response?.data?.message || "Unable to load the menu right now.", "error");
    }
  };

  const loadCartData = async (userToken) => {
    try {
      const response = await axios.post(url + "/api/cart/get", {}, { headers: { token: userToken } });
      if (response.data.success) {
        setCartItems(response.data.cartData || {});
      } else {
        setCartItems({});
        localStorage.removeItem("token");
        setToken("");
        showNotification(response.data.message || "Please sign in again to access your cart.", "error");
      }
    } catch (error) {
      setCartItems({});
      showNotification(error.response?.data?.message || "Unable to load your cart right now.", "error");
    }
  };

  useEffect(()=>{
    async function loadData() {
      setIsBootstrapping(true);
      await fetchFoodList();
      const savedToken = localStorage.getItem("token");

      if (savedToken) {
        setToken(savedToken);
        await loadCartData(savedToken);
      }

      setIsBootstrapping(false);
    }

    loadData();

    return () => {
      if (notificationTimeoutRef.current) {
        clearTimeout(notificationTimeoutRef.current);
      }
    };
  },[])

  const contextValue = {
    food_list,
    cartItems,
    addToCart,
    setCartItems,
    removeFromCart,
    getTotalCartAmount,
    url,
    token,
    setToken,
    isBootstrapping,
    appLoading,
    showLoading,
    hideLoading,
    notification,
    showNotification,
    hideNotification
  };
  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
