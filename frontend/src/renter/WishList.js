import { useContext, useState, useEffect, useRef } from "react";
import React from 'react'
import { AuthContext } from "../shared/context/auth-context";
import { useHttpClient } from '../shared/hooks/http-hook'
import Loading from "../shared/components/Loading";
import { toast } from "react-toastify";
import Detail from "../property/Detail";



export default function WishList() {
  const auth = useContext(AuthContext);
  const [property, setProperty] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null); // State for selected property
  const popup = useRef(null);


  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const fetchProperty = async () => {
    try {
      const userId = auth.userId;
      const responseData = await sendRequest(`http://localhost:1204/renter/wishlist/${userId}`);
      setProperty(responseData.wishList);
      setSelectedProperty(responseData.wishList[0]);
      console.log(responseData);
    } catch (err) { 
    }
  }
  useEffect(() => {
    fetchProperty();
  }, [])

  const pullWishList = async (p_id) => {
    try {
      const responseData = await sendRequest('http://localhost:1204/renter/remove/' + auth.userId + '/' + p_id);
      // console.log("removed");
      // fetchProperty();
      setProperty((prevProperty) => prevProperty.filter(ele => ele._id !== p_id));
      toast.success("Removed from WishList", {autoClose: 500, hideProgressBar:true});
    } catch (err) { }
  }

  const handleCardClick = (prop) => {
    setSelectedProperty(prop); 
    popup.current.click();
  };

  return (
    <>
      {isLoading && <Loading />}
        <div className="container">
          <div className="row">
            {property.length > 0 ? (
              property.map((ele) => (
                <div className="col-md-12" key={ele._id}><div className="card m-2" >
                  <div className="card-header fw-bold text-capitalize" >
                    {ele.title} <small className="fw-lighter small me-5">({ele.address.streetAddress}, {ele.address.city}, {ele.address.state})</small>
                    ₹{ele.price}<small className='fw-light text-lowercase'>/day</small>
                    
                  </div>
                  <button className="btn position-absolute top-0 end-0" onClick={() => pullWishList(ele._id)} >
                      <i className="bi bi-trash-fill"></i>
                    </button>
                  <div className="row g-0" onClick={() => handleCardClick(ele)}>
                    <div className="col-8">
                      {/* <blockquote className="blockquote mb-0">
                        <p>A well-known quote, contained in a blockquote element.</p>
                        <footer className="blockquote-footer">Someone famous in <cite title="Source Title">Source Title</cite></footer>
                      </blockquote> */}
                      <p>{ele.resources.length > 0 ? ele.resources.join(', ') : "very good place"}</p>
                        <p>{ele.description}</p>
                        <p>{ele.resources.length > 0 ? ele.resources.join(', ') : ''}</p>
                    </div>
                    <div className="col-md-2">
                      <img src={(ele.photos && ele.photos.length > 0) ? `images/${ele.photos[0]}` : "images/image.png"} className="img-fluid " alt="..." />
                    </div>
                    <div className="col-md-2">
                      <img src={(ele.photos && ele.photos.length > 0) ? `images/${ele.photos[0]}` : "images/image.png"} className="img-fluid " alt="..." />
                    </div>
                  </div>
                </div>
                </div>
              ))) : (
              <p>No properties in your wishlist.</p>
            )}
          </div>
        </div>
        
<button className="nav-link btn text-success d-none" data-bs-toggle="modal" data-bs-target="#detailModal" ref={popup}>Hide button</button>
      {selectedProperty !== null ? (
        <Detail data={selectedProperty} /> 
        ) : '' }
    </>
  )

  {/* <div>
<h1>Wishlist</h1>
<div className="row">
  {property.length > 0 ? (
    property.map((item) => (
      <div className="col-md-4" key={item.id}>
        <div className="card m-2">
          <img
            src={item.photos.length > 0 ? `images/${item.photos[0]}` : "images/image.png"}
            className="card-img-top"
            alt={item.title}
          />
          <div className="card-body">
            <h5 className="card-title">{item.title}</h5>
            <p className="card-text">
              {item.address.streetAddress}, {item.address.city}, {item.address.state}
            </p>
            <p className="card-text">
              <strong>Price:</strong> {item.price} <small>/day</small>
            </p>
            <p className="card-text">
              <strong>Capacity:</strong> {item.capacity} <small>/room</small>
            </p>
            <p className="card-text">
              <small>{item.resources.length > 0 ? item.resources.join(', ') : "No resources available."}</small>
            </p>
          </div>
        </div>
      </div>
    ))
  ) : (
    <p>No properties in your wishlist.</p>
  )}
</div>
</div> */}

}
