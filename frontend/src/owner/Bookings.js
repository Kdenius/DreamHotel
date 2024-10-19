import React, { useEffect, useState } from 'react';
import { useHttpClient } from '../shared/hooks/http-hook';
import Loading from '../shared/components/Loading';
import { useLocation, useNavigate } from 'react-router-dom';

const Bookings = () => {
    const [bookings, setBookings] = useState([]);
    const { isLoading, error, sendRequest, clearError } = useHttpClient();
    const navigate = useNavigate();
    const location = useLocation();
  const { propertyId, propertyTitle } = location.state || {};

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const responseData = await sendRequest(`http://localhost:1204/booking/${propertyId}`);
                setBookings(responseData);
            } catch (err) {
                console.error(err);
            }
        };

        fetchBookings();
    }, [sendRequest, propertyId]);

    const handleComplete = async (bookingId) => {
        // Implement completion logic here
        try {
            await sendRequest(`http://localhost:1204/booking/${bookingId}/complete`);
            setBookings((prevBookings) => prevBookings.filter(booking => booking._id !== bookingId));
        } catch (err) {
            console.error(err);
        }
    };

    const handleRefund = async (booking) => {
        // Implement refund logic here
        const bookingDetails = {
            bookingId : booking._id,
            propertyTitle,
            startDate: booking.startDate,
            endDate: booking.endDate,
            numberOfRooms: booking.totalRoom,
            totalPrice: booking.totalPrice,
          };
          
        //   closeRef.current.click();
          navigate('/payment', { state: { bookingDetails } });
        // try {
        //     await sendRequest(`http://localhost:1204/bookings/refund/${bookingId}`, 'PATCH');
        //     setBookings((prevBookings) => prevBookings.filter(booking => booking._id !== bookingId));
        // } catch (err) {
        //     console.error(err);
        // }
    };

    return (
        <div>
            {isLoading && <Loading />}
            <h2>Bookings for {propertyTitle}</h2>
            <div className="row">
                {bookings.map(booking => (
                    <div key={booking._id} className="col-md-4 mb-3">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">Booking by: {booking.renter.firstName} {booking.renter.lastName}</h5>
                                <p className="card-text">
                                    <strong>Email:</strong> {booking.renter.email}<br />
                                    <strong>Mobile:</strong> {booking.renter.phone}<br />
                                    <strong>Start Date:</strong> {new Date(booking.startDate).toLocaleDateString()}<br />
                                    <strong>End Date:</strong> {new Date(booking.endDate).toLocaleDateString()}<br />
                                    <strong>Total Price:</strong> ₹{booking.totalPrice.toFixed(2)}<br />
                                </p>
                                <button className="btn btn-success" onClick={() => handleComplete(booking._id)}>Complete</button>
                                <button className="btn btn-danger ms-2" onClick={() => handleRefund(booking)}>Refund</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Bookings;
