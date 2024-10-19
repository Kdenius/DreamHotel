import React, { useContext, useEffect, useState } from 'react'
import { useHttpClient } from '../shared/hooks/http-hook';
import { AuthContext } from '../shared/context/auth-context';
import Loading from '../shared/components/Loading';
import { useNavigate } from 'react-router-dom';


export default function AllBookings() {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const auth = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchBookings = async () => {
        try {
            const responseData = await sendRequest(`http://localhost:1204/booking/all/${auth.userId}`);
            setBookings(responseData);
        } catch (err) {}
    };

    fetchBookings();
}, [auth.userId]);

const getStatusClass = (status) => {
  switch (status) {
      case 'completed':
          return 'text-dark fst-italic';
      case 'current':
          return 'text-success';
      case 'refund':
          return 'text-danger fw-bolder';
      default:
          return 'text-secondary'; // Default style for other statuses
  }
};

  return (
    <>
    {isLoading && <Loading/>}
    <div className="container-fluid mt-4">
            <table className="table table-hover caption-top">
                <caption>List of Bookings</caption>
                <thead className="thead-dark">
                    <tr>
                        <th scope="col">Property Name</th>
                        <th scope="col">Renter Name</th>
                        <th scope="col">Start Date</th>
                        <th scope="col">End Date</th>
                        <th scope="col">Total Room</th>
                        <th scope="col">Price</th>
                        <th scope="col">Renter Email</th>
                        <th scope="col">Renter Phone</th>
                        <th scope="col">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {bookings.map((booking) => (
                        <tr key={booking._id}>
                            <td>
                                <button
                                    className="btn btn-outline-warning"
                                    onClick={() => navigate('/bookings', { state: { propertyId: booking.property._id, propertyTitle: booking.property.title } })}
                                >
                                    {booking.property?.title}
                                </button>
                            </td>
                            <td>{`${booking.renter?.firstName} ${booking.renter?.lastName}`}</td>
                            <td>{new Date(booking.startDate).toLocaleDateString()}</td>
                            <td>{new Date(booking.endDate).toLocaleDateString()}</td>
                            <td>{booking.totalRoom}</td>
                            <td>₹ {booking.totalPrice.toFixed(2)}</td>
                            <td>{booking.renter?.email}</td>
                            <td>{booking.renter.phone || 'N/A'}</td>
                            <td className={getStatusClass(booking.status)}>
                                {booking.status || 'N/A'}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        </>
    );
};
