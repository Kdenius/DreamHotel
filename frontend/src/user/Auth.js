import bootstrapBundle from 'bootstrap/dist/js/bootstrap.bundle'
import { React, useEffect, useState,useContext, useRef } from 'react'
import { json, Link, Navigate } from 'react-router-dom'
import { AuthContext } from '../shared/context/auth-context'
import {useHttpClient} from '../shared/hooks/http-hook'
import Loading from '../shared/components/Loading'
import { toast } from 'react-toastify'
// import axios from 'axios';


export default function Auth() {

  const [values, setValues] = useState({
    email: '',
    password: '',
    name: '',
    lastname: '',
    mobile: ''
  });
  const [errors, setErrors] = useState({});
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const closeButtonRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
    validate({ ...values, [name]: value });
  };

  useEffect(() => {
    validate(values);
  }, [values]);

  const validate = (values) => {
    let tempErrors = {};
    if (!values.email) tempErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(values.email)) tempErrors.email = 'Email is invalid';
    if (!values.password) tempErrors.password = 'Password is required';
    else if(values.password.length < 6) tempErrors.password = 'Password must be at least size of 6';
    if (!values.name) tempErrors.name = 'Name is required';
    if (!values.lastname) tempErrors.lastname = 'Last name is required';
    if (!values.mobile) tempErrors.mobile = 'Mobile number is required';
    else if (!/^\+?\d{10,15}$/.test(values.mobile)) tempErrors.mobile = 'Mobile number is invalid';
    setErrors(tempErrors);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    let str = auth.isRenter ? "renter": "owner";
    // console.log(str);
    try{
      const responseData = await sendRequest(
                'http://localhost:1204/'+str+'/signup',
                "POST",
                JSON.stringify({
                  firstName: values.name,
                  lastName: values.lastname,
                  email: values.email,
                  password: values.password,
                  phone: values.mobile,
                  profilePath : '/images/user.png'
                }),
                {
                  "Content-Type": "application/json",
                }
              );

              // auth.isRenter ? auth.login(responseData.renter._id) : auth.login(responseData.owner._id);
              // console.log(responseData);
              auth.login(responseData.user._id, responseData.authToken);
              // localStorage.setItem("authToken", responseData.authToken);
              closeButtonRef.current.click();
              toast.success("Signup successfully",{autoClose: 500, hideProgressBar:true});

              
              // Navigate('/');
    }catch(err){}

    setValues({
      email: '',
      password: '',
      name: '',
      lastname: '',
      mobile: ''
    });
    setErrors({});
    
    // Navigate('/');
    // if (Object.keys(errors).length === 0 && Object.keys(values).every(key => values[key])) {
    //   console.log('Form is valid');
    // } else {
    //   console.log('Form has errors');
    // }
  };

  const handleSignin = async(e) =>{
    e.preventDefault();
    let str = auth.isRenter ? "renter": "owner";
    
    try{
      const responseData = await sendRequest(
                'http://localhost:1204/'+str+'/login',
                "POST",
                JSON.stringify({
                  email: values.email,
                  password: values.password,
                }),
                {
                  "Content-Type": "application/json",
                }
              );
              auth.login(responseData.user._id, responseData.authToken);
              // localStorage.setItem("authToken", responseData.authToken);
              // let token = localStorage.getItem("authToken");
              // const decoded = jwt.decode(token);
              // console.log(decoded);
              closeButtonRef.current.click();

              toast.success("Login successfully",{autoClose: 500, hideProgressBar:true});
    }catch(err){}
    setValues({
      email: '',
      password: '',
      name: '',
      lastname: '',
      mobile: ''
    });
    setErrors({});
  }


  return (
    
    <div>
      {isLoading && <Loading/>}
      <div className="modal fade" id="signInModal" tabindex="-1" aria-labelledby="signInModalLabel" aria-hidden="true" >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <ul className="nav nav-tabs" id="myTab" role="tablist">
                <li className="nav-item">
                  <button className="nav-link active" id="singin-tab" data-bs-toggle="tab" data-bs-target="#singin" role="tab" aria-controls="singin" aria-selected="true">Sign In</button>
                </li>
                <li className="nav-item">
                  <button className="nav-link" id="signup-tab" data-bs-toggle="tab" data-bs-target="#signup" role="tab" aria-controls="signup" aria-selected="false">Sign Up</button>
                </li>
              </ul>

              <input type="radio" className="btn-check" name="options-outlined" id="success-outlined" autocomplete="off" checked={auth.isRenter} onClick={() => auth.setIsRenter(true)}/>
              <label className="btn btn-outline-success" for="success-outlined">Renter</label>
              <input type="radio" className="btn-check" name="options-outlined" id="Warning-outlined" autocomplete="off" checked={!auth.isRenter} onClick={() =>auth.setIsRenter(false)}/>
              <label className="btn btn-outline-warning" for="Warning-outlined">Owner</label>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" ref={closeButtonRef}></button>
            </div>



            <div className="modal-body">
              <div className="tab-content" id="myTabContent">

                <form className="tab-pane fade show active" id="singin" role="tabpanel" aria-labelledby="singin-tab">
                  <div className="mb-3">
                    <label for="email" className="form-label">Email</label>
                    <input type="text" className={`form-control ${errors.email !== undefined ? 'is-invalid' : 'is-valid'}`} name='email' id="email" value={values.email} onChange={handleChange} placeholder="Enter your email" />
                    <div className="invalid-feedback">{errors.email}</div>
                  </div>
                  <div className="mb-3">
                    <label for="password" className="form-label">Password</label>
                    <input type="password" className={`form-control ${errors.password !== undefined ? 'is-invalid' : 'is-valid'}`} name='password' value={values.password} onChange={handleChange} id="password" placeholder="Enter your password" />
                    <div className="invalid-feedback">{errors.password}</div>
                  </div>
                  <button type="submit" disabled={(errors.email || errors.password)} className="btn btn-primary" onClick={handleSignin}>Log in</button>
                </form>

                <form className="tab-pane fade" id="signup" role="tabpanel" aria-labelledby="signup-tab">
                  <div className="mb-3">
                    <label for="name" className="form-label">Name</label>
                    <input type="text" className={`form-control ${errors.name !== undefined ? 'is-invalid' : 'is-valid'}`} name='name' value={values.name} onChange={handleChange} id="name" placeholder="Enter your Name" />
                    <div className="invalid-feedback">{errors.name}</div>
                  </div>
                  <div className="mb-3">
                    <label for="lastname" className="form-label">Last Name</label>
                    <input type="text" className={`form-control ${errors.lastname !== undefined ? 'is-invalid' : 'is-valid'}`} name='lastname' value={values.lastname} onChange={handleChange} id="lastname" placeholder="Enter your Last name" />
                    <div className="invalid-feedback">{errors.lastname}</div>
                  </div>
                  <div className="mb-3">
                    <label for="email" className="form-label">Email</label>
                    <input type="text" className={`form-control ${errors.email !== undefined ? 'is-invalid' : 'is-valid'}`} name='email' value={values.email} onChange={handleChange} id="email" placeholder="Enter your email" />
                    <div className="invalid-feedback">{errors.email}</div>
                  </div>
                  <div className="mb-3">
                    <label for="password" className="form-label">Password</label>
                    <input type="password" className={`form-control ${errors.password !== undefined ? 'is-invalid' : 'is-valid'}`} name='password' value={values.password} onChange={handleChange} id="password" placeholder="Enter your password" />
                    <div className="invalid-feedback">{errors.password}</div>
                  </div>
                  <div className="mb-3">
                    <label for="mobile" className="form-label">Mobile</label>
                    <input type="tel" className={`form-control ${errors.mobile !== undefined ? 'is-invalid' : 'is-valid'}`} name='mobile' value={values.mobile} onChange={handleChange} id="mobile" placeholder="+91" />
                    <div className="invalid-feedback">{errors.mobile}</div>
                  </div>
                  <div className="input-group mb-3">
                    <input type="file" className="form-control" id="inputGroupFile02"/>
                    <label className="input-group-text" for="inputGroupFile02">Upload</label>
                  </div>
                  <button type="submit" disabled={Object.keys(errors).length !== 0} className="btn btn-primary" onClick={handleSignup}>Submit</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
