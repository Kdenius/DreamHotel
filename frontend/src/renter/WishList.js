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
      if(responseData.wishList.length > 0)
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
  const baseUrl = 'http://localhost:1204/images/';
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
                    <div className="col-8 ps-3">
                      <p className="fst-italic"><strong>Resources : </strong>{ele.resources.length > 0 ? ele.resources.join(', ') : "very good place"}</p>
                        <span><strong>Capacity : </strong>{ele.capacity}<small className='fw-light text-lowercase me-5'>/room</small>
                        <strong>Total Rooms : </strong>{ele.rooms}
                        </span>
                        <p className="fw-light text-center mt-1">{ele.description}</p>
                    </div>
                    <div className="col-md-2">
                      <img src={(ele.photos && ele.photos.length > 0) ? `${baseUrl}${ele.photos[0]}` : "images/image.png"} className="img-fluid w-100 h-100" alt="..." />
                    </div>
                    <div className="col-md-2">
                      <img src={(ele.photos && ele.photos.length > 0) ? `${baseUrl}${ele.photos[1]}` : "images/image.png"} className="img-fluid w-100 h-100 " alt="..." />
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

}
