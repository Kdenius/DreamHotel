import React, { useEffect, useState, useContext, useRef } from 'react';
import { AuthContext } from '../shared/context/auth-context';
import { useHttpClient } from '../shared/hooks/http-hook';
import Loading from '../shared/components/Loading';
import { useNavigate } from 'react-router-dom';

export default function AddNew() {
    const [values, setValues] = useState({
        title: '',
        address: {
            streetAddress: '',
            pincode: '',
            city: '',
            state: '',
            country: ''
        },
        rooms: '',
        price: '',
        capacity: '',
        photos: [],
        description: '',
        categorie: [],
        resources: []
    });
    const [errors, setErrors] = useState({});
    const auth = useContext(AuthContext);
    const { isLoading, error, sendRequest, clearError } = useHttpClient();
    const closeButtonRef = useRef(null);
    // const navigate = useNavigate();
    // console.log('inside newadd',data);
    // useEffect(() => {
    //     if (data) {
    //         setValues({
    //             title: data.title || '',
    //             address: {
    //                 streetAddress: data.address.streetAddress || '',
    //                 pincode: data.address.pincode || '',
    //                 city: data.address.city || '',
    //                 state: data.address.state || '',
    //                 country: data.address.country || ''
    //             },
    //             rooms: data.rooms || '',
    //             price: data.price || '',
    //             capacity: data.capacity || '',
    //             photos: data.photos || [],
    //             description: data.description || '',
    //             categorie: data.categorie || [],
    //             resources: data.resources || []
    //         });
    //     }
    // }, [data]);
    // console.log(values.address.pincode);
// console.log(values.title)
    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setValues((prevValues) => ({
                ...prevValues,
                [parent]: {
                    ...prevValues[parent],
                    [child]: value
                }
            }));
            //  } else if (name === 'photos') {
            //  setValues({ ...values, photos: [...e.target.files].map(file => URL.createObjectURL(file)) });
        } else {
            setValues({ ...values, [name]: value });
        }
        validate({ ...values, [name]: value });
    };

    useEffect(() => {
        validate(values);
    }, [values]);

    const validate = (values) => {
        // console.log('inside validate',values);
        let tempErrors = {};
        if (!values.title) tempErrors.title = 'Title is required';
        if (!values.address.streetAddress) tempErrors.streetAddress = 'Street address is required';
        if (!values.address.pincode) tempErrors.pincode = 'Pincode is required';
        if (!values.address.city) tempErrors.city = 'City is required';
        if (!values.address.state) tempErrors.state = 'State is required';
        if (!values.address.country) tempErrors.country = 'Country is required';
        if (!values.rooms) tempErrors.rooms = 'Number of rooms is required';
        if (!values.price) tempErrors.price = 'Price is required';
        if (!values.capacity) tempErrors.capacity = 'Capacity is required';
        if (!values.description) tempErrors.description = 'Description is required';
        if (!values.categorie.length) tempErrors.categorie = 'At least one category is required';

        setErrors(tempErrors);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (Object.keys(errors).length === 0) {
            try {
                const responseData = await sendRequest(
                    'http://localhost:1204/property/new',
                    'POST',
                    JSON.stringify({
                        ...values,
                        owner: auth.userId
                    }),
                    {
                        'Content-Type': 'application/json'
                    }
                );
                console.log(responseData);
                closeButtonRef.current.click(); 
                // navigate('/');

            } catch (err) {
                console.error(err);
            }
        }
    };
    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     if (Object.keys(errors).length === 0) {
    //         try {
    //             const url = data 
    //                 ? `http://localhost:1204/property/${data._id}` 
    //                 : 'http://localhost:1204/property/new';
    //             const method = data ? 'PATCH' : 'POST';
                
    //             await sendRequest(url, method, JSON.stringify({
    //                 ...values,
    //                 owner: auth.userId
    //             }), {
    //                 'Content-Type': 'application/json'
    //             });
                
    //             closeButtonRef.current.click();
    //         } catch (err) {
    //             console.error(err);
    //         }
    //     }
    // };

    return (
        <div>
            {isLoading && <Loading />}
            {/* { data ? ( */}
            <div className="modal fade" id="addPropertyModal" tabIndex="-1" aria-labelledby="addPropertyModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="addPropertyModalLabel">Add New Property</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" ref={closeButtonRef}></button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleSubmit}>
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="title" className="form-label">Title</label>
                                        <input type="text" className={`form-control ${errors.title ? 'is-invalid' : 'is-valid'}`} name='title' id="title" value={values.title} onChange={handleChange} placeholder="Enter property title" />
                                        <div className="invalid-feedback">{errors.title}</div>
                                    </div>

                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="streetAddress" className="form-label">Street Address</label>
                                        <input type="text" className={`form-control ${errors.streetAddress ? 'is-invalid' : 'is-valid'}`} name='address.streetAddress' id="streetAddress" value={values.address.streetAddress} onChange={handleChange} placeholder="Enter street address" />
                                        <div className="invalid-feedback">{errors.streetAddress}</div>
                                    </div>

                                    <div className="col-md-4 mb-3">
                                        <label htmlFor="pincode" className="form-label">Pincode</label>
                                        <input type="number" className={`form-control ${errors.pincode ? 'is-invalid' : 'is-valid'}`} name='address.pincode' id="pincode" value={values.address.pincode} onChange={handleChange} placeholder="Enter pincode" />
                                        <div className="invalid-feedback">{errors.pincode}</div>
                                    </div>

                                    <div className="col-md-4 mb-3">
                                        <label htmlFor="city" className="form-label">City</label>
                                        <input type="text" className={`form-control ${errors.city ? 'is-invalid' : 'is-valid'}`} name='address.city' id="city" value={values.address.city} onChange={handleChange} placeholder="Enter city" />
                                        <div className="invalid-feedback">{errors.city}</div>
                                    </div>

                                    <div className="col-md-4 mb-3">
                                        <label htmlFor="state" className="form-label">State</label>
                                        <input type="text" className={`form-control ${errors.state ? 'is-invalid' : 'is-valid'}`} name='address.state' id="state" value={values.address.state} onChange={handleChange} placeholder="Enter state" />
                                        <div className="invalid-feedback">{errors.state}</div>
                                    </div>

                                    <div className="col-md-4 mb-3">
                                        <label htmlFor="country" className="form-label">Country</label>
                                        <input type="text" className={`form-control ${errors.country ? 'is-invalid' : 'is-valid'}`} name='address.country' id="country" value={values.address.country} onChange={handleChange} placeholder="Enter country" />
                                        <div className="invalid-feedback">{errors.country}</div>
                                    </div>

                                    <div className="col-md-4 mb-3">
                                        <label htmlFor="rooms" className="form-label">Rooms</label>
                                        <input type="number" className={`form-control ${errors.rooms ? 'is-invalid' : 'is-valid'}`} name='rooms' id="rooms" value={values.rooms} onChange={handleChange} placeholder="Enter number of rooms" />
                                        <div className="invalid-feedback">{errors.rooms}</div>
                                    </div>

                                    <div className="col-md-4 mb-3">
                                        <label htmlFor="price" className="form-label">Price</label>
                                        <input type="number" className={`form-control ${errors.price ? 'is-invalid' : 'is-valid'}`} name='price' id="price" value={values.price} onChange={handleChange} placeholder="Enter price" />
                                        <div className="invalid-feedback">{errors.price}</div>
                                    </div>

                                    <div className="col-md-3 mb-3">
                                        <label htmlFor="capacity" className="form-label">Capacity</label>
                                        <input type="number" className={`form-control ${errors.capacity ? 'is-invalid' : 'is-valid'}`} name='capacity' id="capacity" value={values.capacity} onChange={handleChange} placeholder="Enter capacity" />
                                        <div className="invalid-feedback">{errors.capacity}</div>
                                    </div>

                                    <div className="col-9 mb-3">
                                        <label htmlFor="categorie" className="form-label">Categories</label>
                                        <input type="text" className={`form-control ${errors.categorie ? 'is-invalid' : 'is-valid'}`} name='categorie' id="categorie" value={values.categorie} onChange={(e) => setValues({ ...values, categorie: e.target.value.split(',') })} placeholder="Enter categories separated by commas" />
                                        <div className="invalid-feedback">{errors.categorie}</div>
                                    </div>
                                    <div className="col-12 mb-3">
                                        <label htmlFor="description" className="form-label">Description</label>
                                        <textarea className={`form-control ${errors.description ? 'is-invalid' : 'is-valid'}`} name='description' id="description" value={values.description} onChange={handleChange} placeholder="Enter property description"></textarea>
                                        <div className="invalid-feedback">{errors.description}</div>
                                    </div>
                                    <div className="col-12 mb-3">
                                        <label htmlFor="resources" className="form-label">Resources</label>
                                        <input type="text" className="form-control" name='resources' id="resources" value={values.resources} onChange={(e) => setValues({ ...values, resources: e.target.value.split(',') })} placeholder="Enter resources separated by commas" />
                                    </div>


                                    <div className="col-12 mb-3">
                                        <label htmlFor="photos" className="form-label">Photos</label>
                                        <input type="file" className="form-control" name="photos" id="photos" multiple onChange={handleChange} />
                                    </div>
                                </div>

                                <button type="submit" className="btn btn-primary" disabled={Object.keys(errors).length !== 0}>Add Property</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            {/* ): ''} */}
        </div>
        
    );
}
