import React, { Fragment, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";

function Signup() {

    const navigate = useNavigate();
    const [show, setShow] = useState(false);
    const [type, setType] = useState("primary");
    const [alertMessage, setAlertMessage] = useState("")

    const [details, setDetails] = useState({
        email: "",
        password: "",
        passwordConfirm: ""
    });

    const handleInput = (e: any) => {
        const { name, value } = e.target
        setDetails((old) => {
            return {
                ...old,
                [name]: value
            }
        })
    }

    const submitData = async (e: any) => {
        try {
            e.preventDefault();
            const { email, password, passwordConfirm } = details;
            // send the username and password to the server
            const response = await axios.post(
                "http://localhost:8000/api/v1/user/signup",
                { email, password, passwordConfirm }
            );
            // console.log(response)
            if (response.data.status === "success") {
                // console.log(response)
                localStorage.setItem('jwt', response.data.token);
                localStorage.setItem('user', response.data.data.user.email);
                // setShowProgress(true)
                ShowAlert("success", "Sign Up successfully!, Please Complete your Profile");
                window.setTimeout(() => {
                    navigate("/account");
                }, 5000);
            }

        } catch (err: any) {
            if(err.response.data.error.code === 11000 && err.response.data.error.statusCode === 500){
                ShowAlert("danger", "User already exists!");
            } else {
                ShowAlert("danger", err.response.data.message.replace("User validation failed: ", "").replace("email: ", "").replace("passwordConfirm: ", "").replace("password: ", ""));
            }
        }

    };

    function ShowAlert(type: string, message: string) {
        setType(type)
        setAlertMessage(message);
        setShow(true)
        window.setTimeout(() => {
            setShow(false);
            setAlertMessage("");
        }, 5000);
    }
    return (
        <Fragment>
            {show &&
                    <div className='alert-parent'>
                        <div className={`alert alert-${type}`} role="alert">
                            {alertMessage}
                            <div className="progress mt-2 bg-white">
                                <div className={`progress-bar progress-bar-striped bg-${type} progress-bar-animated fill-5`} role="progressbar" aria-label="Animated striped example" aria-valuemin={0} aria-valuemax={100}></div>
                            </div>
                        </div>
                    </div>
                    
            }
            <div className='row m-5 p-5 rounded shadow'>
                <div className='col-md-6 col-sm-12 text-center d-flex align-items-center justify-content-center'>
                    <div>
                        <h1>Sign Up to Blog App</h1>
                        <p className='small'>
                            Already have an account? <Link to='/login'>Login</Link> here
                        </p>
                    </div>
                </div>
                <div className='col-md-6 col-sm-12'>
                    <form>
                        <div className='mb-3'>
                            <label className='form-label'>Email address</label>
                            <input type='email' name='email' className='form-control' id='exampleInputEmail1' aria-describedby='emailHelp' value={details.email} onChange={handleInput} />
                        </div>
                        <div className='mb-3'>
                            <label className='form-label'>Password</label>
                            <input type='password' name='password' className='form-control' id='exampleInputPassword1' value={details.password} onChange={handleInput} />
                        </div>
                        <div className='mb-3'>
                            <label className='form-label'>Confirm Password</label>
                            <input type='password' name='passwordConfirm' className='form-control' id='exampleInputPassword2' value={details.passwordConfirm} onChange={handleInput} />
                        </div>
                        <button type='submit' className='btn text-white m-1 btn-dark' onClick={submitData}>Sign Up</button>
                    </form>
                </div>
            </div>
        </Fragment>
    )
}

export default Signup