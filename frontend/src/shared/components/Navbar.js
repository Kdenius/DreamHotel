import React, { useState, useContext, useRef, useEffect, } from 'react'
import { NavLink } from 'react-router-dom'
import Auth from '../../user/Auth'
import { AuthContext } from '../context/auth-context';
import AddNew from '../../owner/AddNew';
import { useHttpClient } from '../hooks/http-hook';
import { toast } from 'react-toastify';
import Detail from '../../property/Detail';


export default function Navbar() {
  const auth = useContext(AuthContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const popup = useRef(null);
  const [selectedProperty, setSelectedProperty] = useState(null); // State for selected property


  const handleSearchChange = async (event) => {
    const term = event.target.value;
    setSearchTerm(term);

    if (term.length > 2) { // Trigger search when more than 2 characters are typed
      try {
        const responseData = await sendRequest(`http://localhost:1204/property/search?q=${term}`);
        // console.log(responseData);
        setSearchResults(responseData.properties);
      } catch (err) {
        // Handle error
        toast.error(err.message);
      }
    } else {
      setSearchResults([]); // Clear results if input is too short
    }
  };

  const handleResultClick = (property) => {
    // Navigate to the property details page or fetch the full property data
    // For example, redirect to a details page:
    // history.push(`/property/${propertyId}`);
    setSelectedProperty(property);
    console.log(property);
    popup.current.click();
  };


  return (
    <>
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
              {auth.isLoggedIn ?
                <li className="nav-item">
                  {auth.isRenter ? <NavLink className="nav-link" to="/wishlist">Wishlist</NavLink> : <button className="nav-link btn text-success" data-bs-toggle="modal" data-bs-target="#addPropertyModal">Add</button>}
                </li> : ''
              }
              {auth.isLoggedIn ?
                <li className="nav-item">
                  {auth.isRenter ? <NavLink className="nav-link" to="/triplist">Booking</NavLink> : <NavLink className="nav-link" to="/allBookings">AllBookings</NavLink>}
                </li> : ''
              }
              <li className="nav-item ">
                {!auth.isLoggedIn ? <button className="nav-link btn text-success" data-bs-toggle="modal" data-bs-target="#signInModal">Authenticate</button> : <button className="nav-link btn text-danger" onClick={() => auth.logout()}>Logout</button>}
              </li>
            </ul>
            <form className="d-flex">
              <input
                className="form-control me-2"
                type="search"
                placeholder="Search"
                aria-label="Search"
                value={searchTerm}
                onChange={handleSearchChange}
              />
              {searchResults.length > 0 && (
                <div className="search-results position-absolute mt-5" style={{ zIndex: 1050, }}>
                  <ul className="list-group">
                    {searchResults.map(property => (
                      <li
                        key={property._id}
                        className="list-group-item list-group-item-action"
                        onClick={() => handleResultClick(property)}
                      >
                        {property.title}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

            </form>
          </div>
        </div>
        <Auth />
        {!auth.isRenter && <AddNew />}
      </nav>
      <button className="nav-link btn text-success d-none" data-bs-toggle="modal" data-bs-target="#detailModal" ref={popup}>Hide button</button>
      {selectedProperty !== null ? (
        <Detail data={selectedProperty} />
      ) : ''}
    </>
  )
}
