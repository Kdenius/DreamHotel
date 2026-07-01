import React from 'react'

export default function Carousel(props) {
  const baseUrl = 'http://localhost:1204/images/';
  return (
    <div id="carouselExampleCaptions" className="carousel slide" data-bs-ride="carousel">
  <div className="carousel-indicators">
    <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
    <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="1" aria-label="Slide 2"></button>
    <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="2" aria-label="Slide 3"></button>
  </div>
  <div className="carousel-inner">
    <div className="carousel-item active">
      <img src={`${baseUrl}${props.data[0]}`} className="d-block w-100" alt="..." style={{ height: '400px', objectFit: 'cover' }}/>
      <div className="carousel-caption d-none d-md-block">
        <h5>Enjoy everyWhere everythings !</h5>
        <p>Experience luxury and tranquility in our stunning beachfront hotel.</p>
        </div>
    </div>
    <div className="carousel-item">
      <img src={`${baseUrl}${props.data[1]}`} className="d-block w-100" alt="..." style={{ height: '400px', objectFit: 'cover' }}/>
      <div className="carousel-caption d-none d-md-block">
        <h5>Your Home Away from Home</h5>
        <p>Discover the perfect blend of comfort and style.</p>
      </div>
    </div>
    <div className="carousel-item">
      <img src={`${baseUrl}${props.data[2]}`} className="d-block w-100" alt="..." style={{ height: '400px', objectFit: 'cover' }}/>
      <div className="carousel-caption d-none d-md-block">
      <h5>Unforgettable Experiences Await</h5>
      <p>Relax, unwind, and let the ocean breeze rejuvenate your spirit!</p>
      </div>
    </div>
  </div>
  <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="prev">
    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
    <span className="visually-hidden">Previous</span>
  </button>
  <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="next">
    <span className="carousel-control-next-icon" aria-hidden="true"></span>
    <span className="visually-hidden">Next</span>
  </button>
</div>
  )
}
