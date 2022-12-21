import React, { useState, useEffect, Fragment } from 'react'
import { useLocation } from 'react-router-dom'
import { format } from 'date-fns'
import axios from "axios";

function BlogPost() {
  const location = useLocation().pathname.split('/').slice(1)[0];

  const backgroundPath = "http://localhost:8000/images/";
  const autherPath = "http://localhost:8000/users/";
  const [data, setData] = useState<any>();
  const [show, setShow] = useState(false);
  const [type, setType] = useState("primary");
  const [loading, setLoading] = useState(true);
  const [alertMessage, setAlertMessage] = useState("")

  const getData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/v1/blog/" + location,
      );
      
      if (response.data.status === "success") {
        setData(response.data.data)
        setLoading(false)
      }
    } catch (err: any) {
      // console.log(err.response.data.message)
      ShowAlert("danger", err.response.data.message);
    }
  }

  useEffect(() => {
    getData();
  }, [])

  function ShowAlert(type: string, message: string) {
    setType(type)
    setAlertMessage(message);
    setShow(true)
    window.setTimeout(() => {
      setShow(false);
      setAlertMessage("");
    }, 3000);
  }
  return (
    <Fragment>
      {
        show &&
        <div className='alert-parent'>
          <div className={`alert alert-${type}`} role="alert">
            {alertMessage}
            <div className="progress mt-2 bg-white">
              <div className={`progress-bar progress-bar-striped bg-${type} progress-bar-animated fill-3`} role="progressbar" aria-label="Animated striped example" aria-valuemin={0} aria-valuemax={100}></div>
            </div>
          </div>
        </div>
      }
      { !loading &&
        <Fragment>
          <div className='container-fluid text-center p-0'>
            <img src={backgroundPath + data.background} className='blog-bg' alt='blog-background'></img>
          </div>
          <div className='text-center my-5'>
            <h4 className='text-muted'>{format(new Date(data.date),'PPP')}</h4>
            <h1 className='blog-title text-gradient'>{data.title}</h1>
            <div className='d-flex justify-content-center align-items-center py-2'>
              <img src={autherPath + data.auther.image} className='auther-image' alt="auther"></img>
              <span className='mx-2'></span>
              <h6>{data.auther.name}</h6>
            </div>
          </div>
          <div className='d-flex justify-content-center'>
            <p className='blog-content'>
              {data.description}
            </p>
          </div>
        </Fragment>
      }
      <br></br>
      <br></br>
      <br></br>
    </Fragment>
  )
}

export default BlogPost