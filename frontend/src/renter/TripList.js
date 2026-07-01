import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../shared/context/auth-context";
import { useHttpClient } from '../shared/hooks/http-hook';
import Loading from "../shared/components/Loading";
import { toast } from "react-toastify";

export default function TripList() {
  const auth = useContext(AuthContext);
  const [tripList, setTripList] = useState([]);
  const [showPolicy, setShowPolicy] = useState(false);
  const [selectedTripId, setSelectedTripId] = useState(null);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const fetchTripList = async () => {
    try {
      const responseData = await sendRequest(`http://localhost:1204/renter/trip/${auth.userId}`);
      setTripList(responseData.tripList);
    } catch (err) { }
  };

  const handleCancelBooking = async (tripId) => {
    const confirmCancel = window.confirm("Are you sure you want to cancel this booking?");
    if (confirmCancel) {
      try {
        setShowPolicy(true);
        setSelectedTripId(tripId);
      } catch (err) {
        toast.error("Failed to cancel booking");
      }
    }
  };

  const confirmCancellation = async () => {
    if (selectedTripId) {
      try {
        const responseData = await sendRequest(
          `http://localhost:1204/booking/${selectedTripId}/makerefund`,
        );
        toast.success("Booking canceled successfully");
        fetchTripList(); // Refresh the trip list after cancellation
      } catch (err) {
        toast.error("Failed to cancel booking");
      } finally {
        setShowPolicy(false);
        setSelectedTripId(null);
      }
    }
  };

  useEffect(() => {
    fetchTripList();
  }, [sendRequest]);

  return (
    <>
      {isLoading && <Loading />}
      {tripList && (
        <div className="container">
          <h2>Your Trip List</h2>
          <div className="row">
            {tripList.length > 0 ? (
              tripList.map((trip) => (
                <div className="col-md-12" key={trip._id}>
                  <div className="card m-2">
                    <div className="card-header fw-bold text-capitalize">
                      {trip.property.title} <small className="fw-lighter small me-5">({trip.property.address.streetAddress}, {trip.property.address.city}, {trip.property.address.state})</small>
                      ₹{trip.totalPrice}
                    </div>
                    {trip.status == 'current' ?<button className="btn btn-outline-warning position-absolute top-0 end-0" onClick={() => handleCancelBooking(trip._id)} >
                      Cancel Booking
                    </button>: <p className="position-absolute top-0 end-0 text-warning">{trip.status}</p>}
                    <div className="row g-0">
                      <div className="col-8 ps-3">
                        <p className="fst-italic"><strong>Resources : </strong>{trip.property.resources.length > 0 ? trip.property.resources.join(', ') : "very good place"}</p>
                        <span><strong>Capacity : </strong>{trip.property.capacity}<small className='fw-light text-lowercase me-5'>/room</small>
                          <strong>Booked Rooms : </strong>{trip.totalRoom}
                        </span>
                        <p className="fw-light text-center mt-1">{trip.property.description}</p>
                      </div>
                      <div className="col-md-2 text-danger ">
                        {new Date(trip.startDate).toLocaleDateString()}
                      </div>
                      <div className="col-md-2 text-danger">
                        {new Date(trip.endDate).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>No bookings found.</p>
            )}
          </div>
          {showPolicy && (
            <div className="alert alert-info mt-3">
              <h5>Return Policy</h5>
              <p>Your booking is subject to our return policy. Are you sure you want to proceed with cancellation?</p>
              <button className="btn btn-danger" onClick={confirmCancellation}>Confirm Cancellation</button>
              <button className="btn btn-secondary" onClick={() => setShowPolicy(false)}>Cancel</button>
            </div>
          )}
        </div>
      )}
    </>
  );
}
