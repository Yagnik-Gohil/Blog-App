import React, { Fragment, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";

function Login() {

    const navigate = useNavigate();
    const [show, setShow] = useState(false);
    const [type, setType] = useState("primary");
    const [alertMessage, setAlertMessage] = useState("")

    const [details, setDetails] = useState({
        email: "",
        password: ""
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
            const { email, password } = details;
            // send the username and password to the server
            const response = await axios.post(
                "http://localhost:8000/api/v1/user/login",
                { email, password }
            );
            if (response.data.status === "success") {
                // console.log(response.data)
                localStorage.setItem('jwt', response.data.token);
                localStorage.setItem('user', response.data.data.user.email);

                ShowAlert("success", "Logged in successfully!");
                window.setTimeout(() => {
                    navigate("/");
                }, 2000);
            }

        } catch (err: any) {
            // console.log(err.response.data.message)
            ShowAlert("danger", err.response.data.message);
        }

    };

    function ShowAlert(type: string, message: string) {
        setType(type)
        setAlertMessage(message);
        setShow(true)
        window.setTimeout(() => {
            setShow(false);
            setAlertMessage("");
        }, 2000);
    }

    return (
        <Fragment>
            {show &&
                <div className='alert-parent'>
                    <div className={`alert alert-${type}`} role="alert">
                        {alertMessage}
                        <div className="progress mt-2 bg-white">
                            <div className={`progress-bar progress-bar-striped bg-${type} progress-bar-animated fill-2`} role="progressbar" aria-label="Animated striped example" aria-valuemin={0} aria-valuemax={100}></div>
                        </div>
                    </div>
                </div>

            }
            <div className='row m-5 p-5 rounded shadow vh-80'>
                <div className='col-md-6 col-sm-12 text-center d-flex align-items-center justify-content-center'>
                    <div>
                        <h1>Login to Blog App</h1>
                        <p className='small'>
                            If you're new to this website, <Link to='/signup'>Sign Up</Link> here
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
                        <button type='submit' className='btn text-white m-1 btn-dark' onClick={submitData}>Login</button>
                    </form>
                </div>
            </div>
        </Fragment>
    )
}

export default Login