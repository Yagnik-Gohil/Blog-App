import React, { Fragment } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { format } from 'date-fns'
import { FiEdit } from "react-icons/fi";

function Thumbnail({ array }: { array: any }) {

    const navigate = useNavigate();
    const data = array[0];
    const isEdit = array[1];

    const path = "http://localhost:8000/images/";
    const edit = () => {
        navigate("/edit/" + data.slug);
    }
    return (
        <div className='col-lg-4 col-md-4 col-sm-6 my-2'>
            {
                isEdit ?

                    <div>
                        <div className='thumbnail-div text-center'>
                            <div className='date-posted p-2 bg-light'>
                                <h6 className='text-secondary m-0'>{format(new Date(data.date), 'PPP')}</h6>
                            </div>
                            <img className='blog-thumbnail rounded-3 shadow-sm' src={path + data.thumbnail}></img>
                            <FiEdit className='bg-light p-1 edit-icon rounded' size={40} onClick={edit}></FiEdit>
                        </div>
                        <Link to={`/${data.slug}`} className='text-decoration-none text-dark'><h5 className='my-4'>{data.title}</h5></Link>
                    </div>

                    :

                    <Link to={`/${data.slug}`} className='text-decoration-none text-dark'>
                        <div className='thumbnail-div text-center'>
                            <div className='date-posted p-2 bg-light'>
                                <h6 className='text-secondary m-0'>{format(new Date(data.date), 'PPP')}</h6>
                            </div>
                            <img className='blog-thumbnail' src={path + data.thumbnail}></img>
                        </div>
                        <h5 className='my-4'>{data.title}</h5>
                    </Link>
            }

        </div>
    )
}

export default Thumbnail