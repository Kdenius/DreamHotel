import React, { useState, useRef,useContext } from 'react';
import {useHttpClient} from '../shared/hooks/http-hook'
import { AuthContext } from '../shared/context/auth-context'
import Carousel from './Carousel';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function Detail({ data, onUpdate }) {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [errors, setErrors] = useState('');
  const [availableBookings, setAvailableBookings] = useState(null);
  const [numberOfRooms, setNumberOfRooms] = useState(1); // For room count
  const [totalPrice, setTotalPrice] = useState();
  const closeRef = useRef(null);

  const handleCheckAvailability = async() => {
    let s;
    let today = new Date();
    if (!startDate || !endDate) {
      s = 'Both start and end dates are required.';
    } else if (startDate <= today.toISOString()) {
      s = 'Start date must be after today.';
    } else if (endDate <= startDate) {
      s = 'End date must be after start date.';
    }
    if (s) {
      setErrors(s);
      setAvailableBookings(null); // Reset available bookings
      return;
    } 
      try{
        const responseData = await sendRequest(
          'http://localhost:1204/property/'+data._id,
          "POST",
          JSON.stringify({
            startDate: startDate,
            endDate: endDate,
          }),
          {
            "Content-Type": "application/json",
          }
        );
        setAvailableBookings(responseData.availableRoom);
      }catch(err){}
      // const randomAvailable = Math.floor(Math.random() * 10); // Example logic
      // setAvailableBookings(randomAvailable);
      const days = (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24);
                    setTotalPrice(days * data.price);
  };
  const onCancle = () => {
    setErrors('');
    setStartDate('');
    setEndDate('');
    setAvailableBookings(null);
  }
  const handleConfirmBooking = () =>{
    const bookingDetails = {
      propertyId: data._id,
      propertyTitle: data.title,
      startDate,
      endDate,
      numberOfRooms,
      totalPrice,
    };
    
    closeRef.current.click();
    navigate('/payment', { state: { bookingDetails } });
  }

  const handleViewBookings = () => {
    closeRef.current.click();
    navigate('/bookings', { state: { propertyId: data._id, propertyTitle: data.title } });
  };
  const handleDelete = async () => {
    // closeRef.current.click();
    try{
      const responseData = await sendRequest(`http://localhost:1204/property/${data._id}`, 'DELETE');
      toast.success(responseData.message,{autoClose: 500, hideProgressBar:true});
      closeRef.current.click();
    }catch(err){
      toast.error(err.message);
      handleViewBookings();
    }


  }

  return (
    <div className="modal fade" id="detailModal" tabIndex="-1" aria-labelledby="detailModalLabel" aria-hidden="true">
      <div className="modal-dialog modal-lg" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="detailModalLabel">{data.title}</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={onCancle} ref={closeRef}></button>
          </div>

          <div className="modal-body">

            <Carousel />

            <p>{data.address.streetAddress}, {data.address.city}, {data.address.state}</p>
            <p><strong>Price:</strong> {data.price} <small>/day</small></p>
            <p><strong>Capacity:</strong> {data.capacity} <small>/room</small></p>
            <p><strong>Resources:</strong> {data.resources.length > 0 ? data.resources.join(', ') : "No resources available."}</p>
            {auth.isRenter ? (
            <div className='row g-0'>
              <div className="col-3">
                <label htmlFor="startDate" className="form-label">Start Date</label>
                <input type="date" className="form-control" id="startDate" value={startDate} onChange={e => {setStartDate(e.target.value); setAvailableBookings(null);}} />
              </div>
              <div className="col-3 mx-2">
                <label htmlFor="endDate" className="form-label">End Date</label>
                <input type="date" className="form-control" id="endDate" value={endDate} onChange={e => {setEndDate(e.target.value); setAvailableBookings(null);}} />
              </div>
              <button className="btn btn-outline-primary col-3" onClick={handleCheckAvailability}>
                Check Availability
              </button>
              {availableBookings !== null ? (
                <div className="col-2 ms-3 fw-bold text-success">Available Rooms<p className='text-center fst-italic'>{availableBookings}</p> </div>
              ) : <div className="col-2 ms-3 fw-bold text-danger">{errors}</div>}
            </div>

            ):(
            <div className="mt-3">
              <button className="btn btn-primary" onClick={()=>onUpdate()}>Edit</button>
              <button className="btn btn-danger ms-2" onClick={()=>handleDelete()}>Delete</button>
              <button className="btn btn-success ms-2" onClick={()=>handleViewBookings()}>Bookings</button>
            </div>
            )}
            {availableBookings !== null && (
              <div className="mt-3">
                <label htmlFor="numberOfRooms" className="form-label">Number of Rooms</label>
                <input
                  type="number"
                  className="form-control"
                  id="numberOfRooms"
                  value={numberOfRooms}
                  min="1"
                  max={availableBookings} // Limit to available bookings
                  onChange={e => {
                    const value = Math.min(Math.max(Number(e.target.value), 1), availableBookings);
                    setNumberOfRooms(value);
                    const days = (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24);
                    setTotalPrice(days * data.price * value);
                  }}
                />
                <p className="mt-2"><strong>Total Price: </strong>₹{totalPrice.toFixed(2)}</p>
                <button className="btn btn-success" onClick={handleConfirmBooking}>Confirm Booking</button>
              </div>)}

          </div>
        </div>
      </div>
    </div>
  );
}
