import React, { useState, useContext, useRef, useEffect, } from 'react'
import { NavLink } from 'react-router-dom'
import Auth from '../../user/Auth'
import { AuthContext } from '../context/auth-context';
import AddNew from '../../owner/AddNew';
import { useHttpClient } from '../hooks/http-hook';


export default function Navbar() {
  const auth = useContext(AuthContext);
  // const { isLoading, error, sendRequest, clearError } = useHttpClient();


  // useEffect(() => {
  //   const verifyToken = async () => {
  //     const token = localStorage.getItem('authToken');
  //     // console.log(token);
  //     if (token) {
  //       try {
  //         const responseData = await sendRequest(
  //           'http://localhost:1204/verify',
  //           'GET',
  //           null,
  //           {
  //             'Authorization': `${token}`
  //           }
  //         );
  //         console.log('before '+auth.isRenter);
  //         auth.setIsRenter(responseData.data.isRenter);
  //         auth.login(responseData.data._id, token);
  //         console.log(responseData.data.isRenter);
  //         console.log('after '+auth.isRenter);
  //         // console.log(responseData.data.isRenter);
  //       } catch (err) { }
  //     }
  //     // else 
  //     // console.log('fhaifhaoi')
  //   }
  //   verifyToken();
  // }, []);

  return (
    <nav className="navbar navbar-expand-lg navbar-light" style={{ "background-color": "#e3f2fd" }}>
      <div className="container-fluid">
        <NavLink className="navbar-brand" to="#" style={{ "font-family": "cursive" }}>
          <img src="/logo.png" alt="" width="40" height="40" />
          DreamHotel
        </NavLink>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink className="nav-link active" aria-current="page" to="/">Home</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="#">Link</NavLink>
            </li>
            <li className="nav-item dropdown">
              <NavLink className="nav-link dropdown-toggle" to="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                Dropdown
              </NavLink>
              <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                <li><NavLink className="dropdown-item" to="#">Action</NavLink></li>
                <li><NavLink className="dropdown-item" to="#">Another action</NavLink></li>
                <li><NavLink className="dropdown-item" to="#">Something else here</NavLink></li>
              </ul>
            </li>
            { auth.isLoggedIn ?
            <li className="nav-item">
              {auth.isRenter ? <NavLink className="nav-link" to="/wishlist">Wishlist</NavLink> : <button className="nav-link btn text-success" data-bs-toggle="modal" data-bs-target="#addPropertyModal">Add</button>}
            </li> : ''
            }
            { auth.isLoggedIn ?
            <li className="nav-item">
              {auth.isRenter ? <NavLink className="nav-link" to="/triplist">Booking</NavLink> : <NavLink className="nav-link" to="/allBookings">AllBookings</NavLink>}
            </li> : ''
            }
            <li className="nav-item ">
            {!auth.isLoggedIn ? <button className="nav-link btn text-success" data-bs-toggle="modal" data-bs-target="#signInModal">Authenticate</button> : <button className="nav-link btn text-danger" onClick={()=>auth.logout()}>Logout</button>}
            </li>
          </ul>
          <form className="d-flex">
            <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
            <button className="btn btn-outline-success" type="submit">Search</button>
          </form>
        </div>
      </div>
      <Auth/>
      {!auth.isRenter && <AddNew/>}
      {/* {!auth.isLoggedIn && <Auth/>} */}
    </nav>
  )
}
