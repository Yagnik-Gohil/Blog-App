import React, { useState, useEffect, Fragment } from 'react'
import Thumbnail from './Thumbnail';
import axios from "axios";

function BlogGrid() {

  const [list, setList] = useState([]);
  const [show, setShow] = useState(false);
  const [type, setType] = useState("primary");
  const [loading, setLoading] = useState(true);
  const [alertMessage, setAlertMessage] = useState("")

  const getList = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/v1/blog/",
      );
      if (response.data.status === "success") {
        setList(response.data.data)
        setLoading(false)
      }

    } catch (err: any) {
      // console.log(err.response.data.message)
      ShowAlert("danger", err.response.data.message);
    }
  }
  useEffect(() => {
    getList();
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
      <div className='container'>
        <div className='row'>
          {
            !loading && list.length > 0 &&
            list.map((data, index) => {
              return (<Thumbnail key={index} array={[data, false]}></Thumbnail>)
            }
            )
          }
        </div>
      </div>
    </Fragment>
  )
}

export default BlogGrid