import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../shared/context/auth-context";
import { useHttpClient } from '../shared/hooks/http-hook';
import Loading from "../shared/components/Loading";
import { toast } from "react-toastify";

export default function TripList() {
  const auth = useContext(AuthContext);
  const [tripList, setTripList] = useState([]);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const fetchTripList = async () => {
    try {
      const userId = auth.userId;
      const responseData = await sendRequest(`http://localhost:1204/renter/trip/${auth.userId}`);
      setTripList(responseData.tripList);
    } catch (err) {}
  };

  useEffect(() => {
    fetchTripList();
  }, [sendRequest]);

  return (
    <div>
      {isLoading && <Loading /> }
        <div className="container">
          <h2>Your Trip List</h2>
          <div className="row">
            {tripList.length > 0 ? (
              tripList.map((trip) => (
                <div className="col-md-12" key={trip._id}>
                  <div className="card m-2">
                    <div className="card-header fw-bold text-capitalize">
                      {trip.property.title} 
                      <small className="fw-lighter small me-5">
                        ({trip.property.address.streetAddress}, {trip.property.address.city}, {trip.property.address.state})
                      </small>
                      ₹{trip.totalPrice}
                      <small className='fw-light text-lowercase'>/total</small>
                      {trip.totalRoom}
                    </div>
                    <div className="row g-0">
                      <div className="col-8">
                        <p>{trip.property.resources.length > 0 ? trip.property.resources.join(', ') : "No resources available"}</p>
                        <p>{trip.property.description}</p>
                      </div>
                      <div className="col-md-2">
                       {new Date(trip.startDate).toLocaleDateString()}
                        {/* <img src={(trip.photos && trip.photos.length > 0) ? `images/${trip.photos[0]}` : "images/image.png"} className="img-fluid" alt="..." /> */}
                      </div>
                      <div className="col-md-2">
                      {new Date(trip.endDate).toLocaleDateString()}
                        {/* <img src={(trip.photos && trip.photos.length > 0) ? `images/${trip.photos[0]}` : "images/image.png"} className="img-fluid" alt="..." /> */}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>No bookings found.</p>
            )}
          </div>
        </div>
    </div>
  );
}
