import React, { useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../shared/context/auth-context';
import { useHttpClient } from '../shared/hooks/http-hook';
import Loading from '../shared/components/Loading';


const Payment = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [cardNumber, setCardNumber] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [errors, setErrors] = useState('');
  const [paymentSuccessful, setPaymentSuccessful] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { bookingDetails } = location.state || {};

  if (!bookingDetails) {
    toast.error('No Booking details Availabel');
    navigate('/')
  }

  const handlePayment = async (e) => {
    e.preventDefault();

    // Simple validation
    if (!cardNumber || !expirationDate || !cvv) {
      setErrors('Please fill in all fields.');
      return;
    }

    // Simulate payment processing and send data to the server
    try {
    //   const response = await axios.post('http://localhost:1204/payment', {
    //     cardNumber,
    //     expirationDate,
    //     cvv,
    //     bookingDetails,
    //   });
      const responseData = await sendRequest(
        'http://localhost:1204/booking/new',
        "POST",
        JSON.stringify({
          renter: auth.userId,
          property: bookingDetails.propertyId,
          startDate: bookingDetails.startDate,
          endDate: bookingDetails.endDate,
          totalRoom: bookingDetails.numberOfRooms
        }),
        {
          "Content-Type": "application/json",
        }
      );

      // if (response.data.success) {
        setPaymentSuccessful(true);
        toast.success("Payment successfull", {autoClose: 500, hideProgressBar:true});
        console.log(responseData);

    //     setError('');
      // } else {
    //     setError('Payment failed. Please try again.');
      // }
    } catch (err) {

    }   

  };

  const handleRefund = async (e)=>{
    e.preventDefault();

    // Simple validation
    if (!cardNumber || !expirationDate || !cvv) {
      setErrors('Please fill in all fields.');
      return;
    }

    // Simulate payment processing and send data to the server
    try {
    //   const response = await axios.post('http://localhost:1204/payment', {
    //     cardNumber,
    //     expirationDate,
    //     cvv,
    //     bookingDetails,
    //   });
      const responseData = await sendRequest(`http://localhost:1204/booking/${bookingDetails.bookingId}/refund`);

      // if (response.data.success) {
        setPaymentSuccessful(true);
        toast.success("Payment successfull", {autoClose: 500, hideProgressBar:true});
        console.log(responseData);

    //     setError('');
      // } else {
    //     setError('Payment failed. Please try again.');
      // }
    } catch (err) {

    }   

  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
    {isLoading ? <Loading/> :(
    <div className="container">
      <h2>{auth.isRenter ? 'Payment' : 'Refund Payment' }</h2>
      {!paymentSuccessful ? (
        <form onSubmit={auth.isRenter ? handlePayment : handleRefund}>
          <div className="mb-3">
            <label htmlFor="cardNumber" className="form-label">Card Number</label>
            <input
              type="text"
              className="form-control"
              id="cardNumber"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              required
              placeholder="1234 5678 9012 3456"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="expirationDate" className="form-label">Expiration Date (MM/YY)</label>
            <input
              type="text"
              className="form-control"
              id="expirationDate"
              value={expirationDate}
              onChange={(e) => setExpirationDate(e.target.value)}
              required
              placeholder="MM/YY"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="cvv" className="form-label">CVV</label>
            <input
              type="text"
              className="form-control"
              id="cvv"
              value={cvv}
              onChange={(e) => setCvv(e.target.value)}
              required
              placeholder="123"
            />
          </div>
          {errors && <div className="text-danger">{errors}</div>}
          <button type="submit" className="btn btn-primary">Complete Payment</button>
        </form>
      ) : (
        <div className="mt-4">
          <h3>{auth.isRenter ? 'Payment' : 'Refund'} Successful!</h3>
          <h4>Booking Details:</h4>
          {!auth.isRenter && <p><strong>Booking id:</strong> {bookingDetails.bookingId}</p>}
          <p><strong>Property:</strong> {bookingDetails.propertyTitle}</p>
          <p><strong>Start Date:</strong> {bookingDetails.startDate}</p>
          <p><strong>End Date:</strong> {bookingDetails.endDate}</p>
          <p><strong>Number of Rooms:</strong> {bookingDetails.numberOfRooms}</p>
          <p><strong>Total Price:</strong> ${bookingDetails.totalPrice.toFixed(2)}</p>
          <button onClick={handlePrint} className="btn btn-success">Print Bill</button>
          <button onClick={() => navigate('/')} className="btn btn-secondary mt-2">Go to Home</button>
        </div>
      )}
    </div>
    )}
    </>
    
  );
}

export default Payment;
