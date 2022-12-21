import React, { Fragment, useState, useEffect } from "react";
import axios from "axios";

function Account() {
  const path = "http://localhost:8000/users/";
  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState(false);
  const [type, setType] = useState("primary");
  const [alertMessage, setAlertMessage] = useState("");
  const [details, setDetails] = useState({
    name: "",
    email: "",
    image: "default.png"
  });
  const [passwordDetails, setPasswordDetails] = useState({
    passwordCurrent: "",
    password: "",
    passwordConfirm: "",
  });
  const [file, setFile] = useState<any>("default.png");
  const [isFileChange, setIsFileChange] = useState(false);

  const config = localStorage.getItem("jwt")
    ? { headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` } }
    : {};
  const getDetails = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8000/api/v1/account/",
        config
      );
      if (res.data.status === "success") {
        setDetails(res.data.data);
        setFile(res.data.data.image);
        setIsFileChange(false);
        setLoading(false)
      } else {
        ShowAlert("danger", "Data not available");
      }
    } catch (err: any) {
      // console.log(err.message)
      if (err.code === "ERR_NETWORK") {
        ShowAlert("danger", err.message + ", Check your Internet Connection.");
      } else if (err.response.data.error.statusCode === 401) {
        window.location.replace("http://localhost:3000");
      } else {
        ShowAlert("danger", err.response.data.message);
      }
    }
  };

  useEffect(() => {
    getDetails();
  }, []);

  const handleInput = (e: any) => {
    const { name, value } = e.target;
    setDetails((old: any) => {
      return {
        ...old,
        [name]: value,
      };
    });
  };
  function handleFile(e: any) {
    setFile(e.target.files[0]);
    setIsFileChange(true);
  }
  const submitData = async (e: any) => {
    try {
      e.preventDefault();

      // form works only with file upload 🤷‍♂️
      let form = new FormData();
      form.append("name", details.name);
      form.append("image", file);
      form.append("isUpdate", "true");

      const response = await axios({
        method: "patch",
        url: "http://localhost:8000/api/v1/account/",
        data: form,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.status === "success") {
        ShowAlert("success", "Data Updated successfully!");
        getDetails();
      }
    } catch (err: any) {
      // console.log(err)
      ShowAlert("danger", err.response.data.message);
    }
  };

  const handlePasswordInput = (e: any) => {
    const { name, value } = e.target;
    setPasswordDetails((old) => {
      return {
        ...old,
        [name]: value,
      };
    });
  };

  const submitPasswordData = async (e: any) => {
    try {
      e.preventDefault();

      // console.log(passwordDetails)
      const response = await axios({
        method: "patch",
        url: "http://localhost:8000/api/v1/account/updatePassword",
        data: passwordDetails,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          "Content-Type": "application/json",
        },
      });

      if (response.data.status === "success") {
        ShowAlert("success", "Password Updated successfully!");
        setPasswordDetails({
          passwordCurrent: "",
          password: "",
          passwordConfirm: "",
        });
      }
    } catch (err: any) {
      // console.log(err)
      ShowAlert("danger", err.response.data.message.replace("User validation failed: ", "").replace("email: ", "").replace("passwordConfirm: ", "").replace("password: ", ""));
    }
  };

  function ShowAlert(type: string, message: string) {
    setType(type);
    setAlertMessage(message);
    setShow(true);
    window.setTimeout(() => {
      setShow(false);
      setAlertMessage("");
    }, 3000);
  }

  return (
    <Fragment>
      {show &&
        <div className='alert-parent'>
          <div className={`alert alert-${type}`} role="alert">
            {alertMessage}
            <div className="progress mt-2 bg-white">
              <div className={`progress-bar progress-bar-striped bg-${type} progress-bar-animated fill-3`} role="progressbar" aria-label="Animated striped example" aria-valuemin={0} aria-valuemax={100}></div>
            </div>
          </div>
        </div>

      }
      {!loading && (
        <div className="container">
          <h2>My Account</h2>
          <hr />
          <div className="d-flex align-items-start flex-wrap">
            <div className="p-3 mw-fc shadow-sm m-2 bg-light rounded-3">
              <div className="d-flex justify-content-center mb-3">
                <img className="account-image" src={isFileChange ? URL.createObjectURL(file) : path + file} alt="User" ></img>
              </div>
              <p>
                <span className="fw-bold">Name:</span> {details.name}
              </p>
              <p>
                <span className="fw-bold">Email:</span> {details.email}
              </p>
              <div className="d-flex flex-row-reverse">
                <button
                  className="btn text-white m-1 btn-dark fs-12"
                  data-bs-toggle="modal"
                  data-bs-target="#exampleModal2"
                >
                  Update
                </button>
              </div>
            </div>
            <div className="p-3 mw-fc shadow-sm m-2 bg-light rounded-3">
              <div>
                <button
                  className="btn text-white m-1 btn-dark"
                  data-bs-toggle="modal"
                  data-bs-target="#exampleModal3"
                >
                  Update Password
                </button>
              </div>
              <div>
                <button
                  className="btn text-white m-1 btn-dark"
                  data-bs-toggle="modal"
                  data-bs-target="#exampleModal4"
                >
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {!loading && (
        <div
          className="modal fade"
          id="exampleModal2"
          tabIndex={-1}
          aria-labelledby="exampleModalLabel2"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel2">
                  Accoutnt Details
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <form className="p-4 pt-0">
                <div className="row my-3">
                  <div className="col-md-4 col-sm-12">
                    <label className="col-form-label">Name</label>
                  </div>
                  <div className="col-md-8 col-sm-12">
                    <input
                      type="text"
                      name="name"
                      className="form-control"
                      value={details.name}
                      onChange={handleInput}
                    />
                  </div>
                </div>
                <div className="row my-3">
                  <div className="col-md-4 col-sm-12">
                    <label className="col-form-label">Email</label>
                  </div>
                  <div className="col-md-8 col-sm-12">
                    <input
                      type="text"
                      name="email"
                      className="form-control"
                      disabled
                      value={details.email}
                    />
                  </div>
                </div>

                <div className="row my-3">
                  <div className="col-md-4 col-sm-12">
                    <label className="col-form-label">Profile Picture</label>
                  </div>
                  <div className="col-md-2 col-sm-12">
                    <img
                      src={
                        isFileChange ? URL.createObjectURL(file) : path + file
                      }
                      className="img-thumbnail w-100"
                      alt="..."
                    ></img>
                  </div>
                  <div className="col-md-6 col-sm-12">
                    <input
                      type="file"
                      className="form-control"
                      onChange={handleFile}
                    />
                  </div>
                </div>

                <div className="d-flex flex-column">
                  <div className="align-self-end">
                    <button
                      type="button"
                      className="btn text-white m-1 btn-dark fs-12"
                      data-bs-dismiss="modal"
                      onClick={submitData}
                    >
                      Save
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      <div
        className="modal fade"
        id="exampleModal3"
        tabIndex={-1}
        aria-labelledby="exampleModalLabel3"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header mb-2">
              <h5 className="modal-title" id="exampleModalLabel3">
                Update Password
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <form className="p-4">
              <div className="row my-3">
                <div className="col-md-4 col-sm-12">
                  <label className="col-form-label">Old Password</label>
                </div>
                <div className="col-md-8 col-sm-12">
                  <input
                    type="password"
                    name="passwordCurrent"
                    className="form-control"
                    value={passwordDetails.passwordCurrent}
                    onChange={handlePasswordInput}
                  />
                </div>
              </div>
              <div className="row my-3">
                <div className="col-md-4 col-sm-12">
                  <label className="col-form-label">New Password</label>
                </div>
                <div className="col-md-8 col-sm-12">
                  <input
                    type="password"
                    name="password"
                    className="form-control"
                    value={passwordDetails.password}
                    onChange={handlePasswordInput}
                  />
                </div>
              </div>
              <div className="row my-3">
                <div className="col-md-4 col-sm-12">
                  <label className="col-form-label">Confirm New Password</label>
                </div>
                <div className="col-md-8 col-sm-12">
                  <input
                    type="password"
                    name="passwordConfirm"
                    className="form-control"
                    value={passwordDetails.passwordConfirm}
                    onChange={handlePasswordInput}
                  />
                </div>
              </div>

              <div className="d-flex flex-column">
                <div className="align-self-end">
                  <button
                    type="button"
                    className="btn text-white m-1 btn-dark fs-12"
                    data-bs-dismiss="modal"
                    onClick={submitPasswordData}
                  >
                    Save
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div
        className="modal fade"
        id="exampleModal4"
        tabIndex={-1}
        aria-labelledby="exampleModalLabel4"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header mb-2">
              <h5 className="modal-title" id="exampleModalLabel4">
                Delete Account
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <form className="p-4">
              <div className="row my-3">
                <div className="col-md-4 col-sm-12">
                  <label className="col-form-label">Enter Password</label>
                </div>
                <div className="col-md-8 col-sm-12">
                  <input type="password" name="name" className="form-control" />
                </div>
              </div>

              <div className="d-flex flex-column">
                <div className="align-self-end">
                  <button
                    type="button"
                    className="btn text-white m-1 btn-dark fs-12"
                    data-bs-dismiss="modal"
                  >
                    Delete Account
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default Account;
