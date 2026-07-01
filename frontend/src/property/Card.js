import React, { useContext } from 'react'
import { AuthContext } from '../shared/context/auth-context';

export default function Card(props) {


  // console.log(props);
  const baseUrl = 'http://localhost:1204/images/';
  const auth = useContext(AuthContext);
  return (
    <div className="col-md-4"><div className="card m-2">
      <div className="row g-0">
        <div className="col-md-4" onClick={() => props.onCardClick(props.data)}>
          <img src={(props.data.photos && props.data.photos.length > 0) ? `${baseUrl}${props.data.photos[0]}` : "images/image.png"} className="img-fluid rounded-start w-100 h-100" alt="..." />
        </div>

        <div className="col-md-8 text-capitalize">
          <div className="card-body" onClick={() => props.onCardClick(props.data)}>
            <h5 className="card-title">{props.data.title}</h5>
            <h5 className="fw-lighter small">{props.data.address.streetAddress}, {props.data.address.city}, {props.data.address.state}</h5>
            {/* <p className="card-text"></p> */}
            <span>Price : {props.data.price}<small className='fw-light text-lowercase'>/day</small></span><span className="small m-2">Capacity : {props.data.capacity}<small className='fw-light text-lowercase'>/room</small></span>
            <p className="card-text"><small className="text-body-secondary">{props.data.resources.length > 0 ? props.data.resources.join(', ') : "very good place"}</small></p>
          </div>
           {!auth.isRenter && auth.isLoggedIn ? <strong className='text-warning position-absolute top-0 end-0' >{props.data.status}</strong> :  <button className="btn btn-link position-absolute top-0 end-0 m-2" onClick={() => props.onLike(props.data._id)} >
            <i className="bi bi-heart "></i>
          </button>}
        </div>

      </div>
    </div></div>
  )
}
