import React, { Fragment, useState, useEffect } from 'react'
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios"

function EditBlog() {

    const path = "http://localhost:8000/images/";
    const navigate = useNavigate();
    const location = useLocation().pathname.split('/').slice(1)[1];

    const [show, setShow] = useState(false);
    const [type, setType] = useState("primary");
    const [alertMessage, setAlertMessage] = useState("");

    const [details, setDetails] = useState({
        _id: "",
        title: "",
        description: ""
    });
    
    const [thumbnail, setThumbnail] = useState<any>("thumbnail.png");
    const [backgroung, setBackground] = useState<any>("background.png");
    const [isThumbnailChange, setIsThumbnailChange] = useState(false);
    const [isBackgroundChange, setIsBackgroundChange] = useState(false);

    const getData = async () => {
        try {
          const response = await axios.get(
            "http://localhost:8000/api/v1/blog/" + location,
          );
          if (response.data.status === "success") {
            setDetails(response.data.data)
            setThumbnail(response.data.data.thumbnail)
            setBackground(response.data.data.background)
            // console.log(response.data.data.thumbnail)
          }
        } catch (err: any) {
          // console.log(err.response.data.message)
          ShowAlert("danger", err.response.data.message);
        }
      }

      useEffect(() => {
        getData();
      }, [])
      
    const handleInput = (e: any) => {
        const { name, value } = e.target
        setDetails((old) => {
            return {
                ...old,
                [name]: value
            }
        })
    }
    function handleFile(e: any) {
        if (e.target.name === "thumbnail") {
            setThumbnail(e.target.files[0]);
            setIsThumbnailChange(true);
        } else if (e.target.name === "background") {
            setBackground(e.target.files[0]);
            setIsBackgroundChange(true);
        }
    }

    const submitData = async (e: any) => {
        try {
            e.preventDefault();
            // form works only with file upload 🤷‍♂️
            let form = new FormData();
            form.append("title", details.title);
            form.append("description", details.description);
            form.append("thumbnail", thumbnail);
            form.append("background", backgroung);
            form.append("isThumbnailChange", isThumbnailChange.toString());
            form.append("isBackgroundChange", isBackgroundChange.toString());

            const response = await axios({
                method: "patch",
                url: "http://localhost:8000/api/v1/blog/edit/"+details._id,
                data: form,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("jwt")}`,
                    "Content-Type": "multipart/form-data",
                },
            });
            if (response.data.status === "success") {
                ShowAlert("success", "Blog Saved & Posted Successfully!");
                window.setTimeout(() => {
                    navigate("/");
                }, 2000);
            }
        } catch (err: any) {
            // console.log(err)
            ShowAlert("danger", err.response.data.message);
        }
    };

    function ShowAlert(type: string, message: string) {
        setType(type);
        setAlertMessage(message);
        setShow(true);
        window.setTimeout(() => {
            setShow(false);
            setAlertMessage("");
        }, 2000);
    }
    return (
        <Fragment>
            {
                show &&
                <div className='alert-parent'>
                    <div className={`alert alert-${type}`} role="alert">
                        {alertMessage}
                        <div className="progress mt-2 bg-white">
                            <div className={`progress-bar progress-bar-striped bg-${type} progress-bar-animated fill-2`} role="progressbar" aria-label="Animated striped example" aria-valuemin={0} aria-valuemax={100}></div>
                        </div>
                    </div>
                </div>
            }
            <div className='container mb-5'>
                <h2>Create Blog</h2>
                <hr></hr>
                <div className="mb-3">
                    <label className="form-label">Blog Title</label>
                    <input type="text" name="title" className="form-control form-control-lg" id="exampleFormControlInput1" placeholder="Enter Blog Title" value={details.title} onChange={handleInput} />
                </div>
                <div className="mb-3">
                    <label className="form-label">Blog Content</label>
                    <textarea name="description" className="form-control form-control-lg" id="exampleFormControlTextarea1" rows={5} value={details.description} onChange={handleInput}></textarea>
                </div>
                <div>
                    <img className="form-control edit-image mt-2" src={isThumbnailChange ? URL.createObjectURL(thumbnail) : path + thumbnail} alt="Thumbnail" ></img>
                    <label className="form-label">Thumbnail Image</label>
                    <input className="form-control form-control-lg" id="formFileLg" type="file" name="thumbnail" onChange={handleFile}/>
                </div>
                <div>
                    <img className="form-control edit-image mt-2" src={isBackgroundChange ? URL.createObjectURL(backgroung) : path + backgroung} alt="Background" ></img>
                    <label className="form-label">Background Image</label>
                    <input className="form-control form-control-lg" id="formFileLg" type="file" name="background" onChange={handleFile}/>
                </div>
                <button type="button" className="mt-4 btn btn-dark btn-lg" onClick={submitData}>Save & Publish</button>
            </div>
        </Fragment>
    )
}

export default EditBlog