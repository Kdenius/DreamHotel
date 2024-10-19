import './App.css';
import { React, useCallback, useEffect, useState, createContext } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Navbar from './shared/components/Navbar';
import Card from './property/Card';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../node_modules/bootstrap/dist/js/bootstrap.bundle';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Carousel from './property/Carousel';
import Footer from './shared/components/Footer';
import Auth from './user/Auth';
import { AuthContext } from './shared/context/auth-context';
import Property from './property/Property';
import WishList from './renter/WishList';
import Payment from './renter/Payment';
import { useHttpClient } from './shared/hooks/http-hook';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TripList from './renter/TripList';
import Loading from './shared/components/Loading';
import Property2 from './owner/AllBookings';
import AllBookings from './owner/AllBookings';
import Bookings from './owner/Bookings';





function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(false);
  const [isRenter, setIsRenter] = useState(true);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const login = useCallback((uid, authToken) => {
    localStorage.setItem("authToken", authToken);
    setIsLoggedIn(true);
    setUserId(uid);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("authToken");
    setIsLoggedIn(false);
    setIsRenter(true);
    setUserId(null);
  }, []);

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('authToken');
      // console.log(token);
      if (token) {
        try {
          const responseData = await sendRequest(
            'http://localhost:1204/verify',
            'GET',
            null,
            {
              'Authorization': `${token}`
            }
          );
          // console.log('before '+isRenter);
          setIsRenter(responseData.data.isRenter);
          login(responseData.data._id, token);
          // console.log(responseData.data.isRenter);
          // console.log('after '+isRenter);
          // console.log(responseData.data.isRenter);
        } catch (err) { }
      }
      // else 
      // console.log('fhaifhaoi')
    }
    verifyToken();
  }, []);

  let routes;
  if (isLoading) {
    // Optionally render a loading spinner or component while checking auth
    routes = <Loading />;
  } else if (isLoggedIn)  {
    routes = (
      <Routes>
        <Route exact path="/" element={<Property />} />
        {/* <Route path="/" element={<>hello world</>} /> */}
        <Route path="/wishlist" element={<WishList />} />
        <Route path="/triplist" element={<TripList />} />
        <Route path="/allBookings" element={<AllBookings />} />
        <Route path="/bookings" element={<Bookings />} />


        <Route exact path="/payment" element={<Payment />} />


        {/* <Route path="/:userId/places" element={<UserPlaces />} />
        <Route path="/places/new" element={<NewPlace />} />
        <Route path="/places/:placeId" element={<UpdatePlace />} />
        <Route path="*" element={<Navigate to="/" />} /> */}
      </Routes>
    );
  } else {
    routes = (
      <Routes>
        <Route exact path="/" element={<Property />} />

        {/* <Route path="/:userId/places" element={<UserPlaces />} /> */}
        {/* <Route path="/auth" element={<Auth/>} /> */}
        {/* <Route path="*" element={<Navigate to="/auth" />} /> */}
      </Routes>
    );
  }

  return (
    <>
    <AuthContext.Provider
      value={{
        isLoggedIn: isLoggedIn,
        userId: userId,
        login: login,
        logout: logout,
        isRenter: isRenter,
        setIsRenter: setIsRenter,
      }}
    >
      <Router>
        <Navbar />
        <main>{routes}</main>
        <ToastContainer
    position="bottom-center"
    autoClose={3000} // duration in ms
    hideProgressBar={false}
    closeOnClick
    pauseOnHover
    draggable
    pauseOnFocusLoss
/>
      </Router>
    </AuthContext.Provider>
    
    </>
    
  );
}

export default App;
