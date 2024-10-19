import React, { useEffect, useState, useContext, useRef } from 'react'
import { useHttpClient } from '../shared/hooks/http-hook'
import Card from './Card';
import Loading from '../shared/components/Loading';
import { AuthContext } from '../shared/context/auth-context';
import Detail from './Detail';
import Auth from '../user/Auth';
import { toast } from 'react-toastify';
import AddNew from '../owner/AddNew';
import Update from '../owner/Update';



export default function Property() {

  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [property, setProperty] = useState([]);
  const auth = useContext(AuthContext);
  const [selectedProperty, setSelectedProperty] = useState(null); // State for selected property
  const popup = useRef(null);
  const popup2 = useRef(null);
  const authref = useRef(null);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const url = (auth.isLoggedIn && !auth.isRenter) ? `http://localhost:1204/property/all/${auth.userId}` : 'http://localhost:1204/property/all';
        console.log('nodrre'+auth.isRenter);
        const responseData = await sendRequest(url);
        setProperty(responseData);
        if(responseData.length > 0)
          setSelectedProperty(responseData[0]);
        else
          toast.success("Not any Property Added", {autoClose: 1000, hideProgressBar:true});

        console.log(responseData);
      } catch (err) { }
    }
    fetchProperty();
  }, [auth.login, auth.isLoggedIn])

  const addWishList = async(p_id) => {
    if(!auth.isLoggedIn){
      authref.current.click();
      toast.error('authentication is require');
      return;
    }
    try{
      const responseData = await sendRequest('http://localhost:1204/renter/add/'+auth.userId+'/'+p_id);
      toast.success(responseData.message, {autoClose: 500, hideProgressBar:true});
    }catch (err) { 
      toast.error(err);
    }
  }

  const handleCardClick = (prop) => {
    setSelectedProperty(prop); 
    popup.current.click();
  };

  const handelUpdate = () =>{
    // setSelectedProperty(prop); 
    popup2.current.click();
  }
  // useEffect(()=>{
  //   popup.current.click();
  // },[setSelectedProperty]);

  // const handleCloseDetail = () => {
  //   // setSelectedProperty(null); // Clear selected property to close the detail view
  // };

  return (
    <>
      {isLoading && <Loading />}
      <div>
        <div className="container-fluid">
          <div className="row">
            {!isLoading && property.length > 0 ? (
              property.map((prop) => (
                <Card key={prop._id} data={prop} onLike={addWishList} onCardClick={handleCardClick} />
              ))) : ''}
          </div>
        </div>
      </div>
      <button className="nav-link btn text-success d-none" data-bs-toggle="modal" data-bs-target="#detailModal" ref={popup}>Hide button</button>
      {selectedProperty !== null ? (
        <Detail data={selectedProperty} onUpdate={handelUpdate} /> 
        ) : '' }
      <button className="nav-link btn text-success d-none" data-bs-toggle="modal" data-bs-target="#UpdateModal" ref={popup2}>Hide button</button>
        {/* <AddNew selectedProperty={selectedProperty} /> */}
        {selectedProperty !== null ? (
        <Update data={selectedProperty} /> 
        ) : '' }
        <button className="btn d-none" data-bs-toggle="modal" data-bs-target="#signInModal" ref={authref}></button>
    </>

  )
}
