import React, { Fragment, useState } from 'react'
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Navbar() {

    const userEmail = localStorage.getItem('user');
    const navigate = useNavigate();

    const [show, setShow] = useState(false);
    const [type, setType] = useState("primary");
    const [alertMessage, setAlertMessage] = useState("")

    const logout = async () => {
        try {
            const res = await axios({
                method: "GET",
                url: "http://localhost:8000/api/v1/user/logout",
            });
            if (res.data.status === "success") {
                ShowAlert("success", "Log out successfully!");
                window.setTimeout(() => {
                    navigate("/login");
                }, 1000);
                localStorage.clear()
            }
        } catch (err) {
            // console.log(err)
            ShowAlert("danger", "Error logging out! Try again.");
        }
    }

    function ShowAlert(type: string, message: string) {
        setType(type)
        setAlertMessage(message);
        setShow(true)
        window.setTimeout(() => {
            setShow(false);
            setAlertMessage("");
        }, 1000);
    }
    return (
        <Fragment>
            {
                show &&
                <div className='alert-parent'>
                    <div className={`alert alert-${type}`} role="alert">
                        {alertMessage}
                        <div className="progress mt-2 bg-white">
                            <div className={`progress-bar progress-bar-striped bg-${type} progress-bar-animated fill-1`} role="progressbar" aria-label="Animated striped example" aria-valuemin={0} aria-valuemax={100}></div>
                        </div>
                    </div>
                </div>
            }
            <nav className="navbar navbar-expand-md navbar-light bg-light top-navbar shadow-sm">
                <div className="container">
                    <Link to="/" className="navbar-brand">Blog App</Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#collapsibleNavbar">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="collapsibleNavbar">
                        <span className='me-auto'></span>
                        <ul className="d-flex align-items-center navbar-nav">
                            {
                                userEmail &&
                                <li className="nav-item dropdown">
                                    
                                    <button type="button" className="btn nav-link dropdown-toggle fw-bold" id="navbarDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                                        {userEmail}
                                    </button >
                                    <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                                        <li><Link className="dropdown-item" to="/account">My Account</Link></li>
                                        <li><Link className="dropdown-item" to="/create-blog">Create Blog</Link></li>
                                        <li><Link className="dropdown-item" to="/my-blogs">My Blogs</Link></li>
                                        {/* <li><Link className="dropdown-item" to="/home">Favourits</Link></li> */}
                                        <li><hr className="dropdown-divider" /></li>
                                        <li><span className="dropdown-item" onClick={logout}>Log Out</span></li>
                                    </ul>
                                </li>
                            }
                            {!userEmail &&
                                <li className="nav-item">
                                    <Link to="/login" className="nav-link fw-bold">
                                        Login
                                    </Link >
                                </li>
                            }
                        </ul>
                    </div>
                </div>
            </nav>
        </Fragment>
    )
}

export default Navbar