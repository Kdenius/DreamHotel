import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import './Home.css'; 

const Home = () => {
    const [properties, setProperties] = useState([]);
    const baseUrl = 'http://localhost:1204/images/';
    
    useEffect(() => {
        const fetchProperties = async () => {
            try {
                const response = await fetch('http://localhost:1204/property/all', {
                    method: 'GET'
                });
                const data = await response.json();
                const propertiesWithOwner = await Promise.all(
                    data.map(async (property) => {
                        const ownerResponse = await fetch(`http://localhost:1204/owner/${property.owner}`);
                        const ownerData = await ownerResponse.json();
                        return { ...property, ownerName: ownerData.firstName }; 
                    })
                );  
                setProperties(propertiesWithOwner); 
            } catch (error) {
                console.error('Error fetching properties:', error);
            }
        };

        fetchProperties();
    }, []);

    const changeStatus = async (id, newStatus) => {
        try {
            await axios.patch(`http://localhost:1204/property/${id}/${newStatus}`); 
            const updatedProperties = properties.map(property =>
                property._id === id ? { ...property, status: newStatus } : property
            );
            setProperties(updatedProperties);
        } catch (error) {
            console.error('Error changing status:', error);
        }
    };

    return (
        <div className="properties-container">
            <h1>Properties</h1>
            <div className="properties-grid">
                {properties.map((property, index) => (
                    <div key={index} className="property-card">
                        <h2>{property.title}</h2>
                        <Carousel 
                            showThumbs={false}
                            infiniteLoop
                            useKeyboardArrows
                            autoPlay
                        >
                            {property.photos.map((photo, idx) => (
                                <div key={idx}>
                                    <img src={`${baseUrl}${photo}`} alt={`Property ${property.title}`} />
                                </div>
                            ))}
                        </Carousel>
                        <p><strong>Description:</strong> {property.description}</p>
                        <p><strong>Status:</strong> {property.status}</p>
                        <p><strong>Price:</strong> {property.price}</p>
                        <p><strong>Rooms:</strong> {property.rooms}</p>
                        <p><strong>Capacity:</strong> {property.capacity}</p>
                        <p><strong>Resources:</strong> {property.resources.join(", ")}</p>
                        <p><strong>Categories:</strong> {property.categorie.join(", ")}</p>
                        <p><strong>Owner Name:</strong> {property.ownerName}</p>
                        <p><strong>Address:</strong> 
                            {`${property.address.streetAddress}, ${property.address.city}, ${property.address.state}, ${property.address.country}, ${property.address.pincode}`}
                        </p>
                        <div className="status-buttons">
                            {property.status === "pending" ? (
                                <button
                                    className="btn activate"
                                    onClick={() => changeStatus(property._id, property.status === "pending" ? "active" : "pending")}
                                >
                                    {property.status === "pending" ? "Activate" : "Set to Pending"}
                                </button>
                            ) : null }
                            <button
                                className={`btn ${property.status === "blocked" ? "unblock" : "block"}`}
                                onClick={() => changeStatus(property._id, property.status === "blocked" ? "active" : "blocked")}
                            >
                                {property.status === "blocked" ? "Unblock" : "Block"}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Home;
