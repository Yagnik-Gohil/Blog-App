import React from 'react'

function Footer() {
    return (
        <div className="container-fluid sticky-bottom">
            <footer className="d-flex flex-wrap justify-content-between align-items-center py-3 my-4 border-top">
                <div className="col-md-4 d-flex align-items-center">
                    <a href="/" className="mb-3 me-2 mb-md-0 text-muted text-decoration-none lh-1">
                        SolGuruz
                    </a>
                    <span className="mb-3 mb-md-0 text-muted">&copy; 2022 Company, Inc</span>
                </div>

                <ul className="nav col-md-4 justify-content-end list-unstyled d-flex">
                    <li className="ms-3"><a className="text-muted" href="#">A</a></li>
                    <li className="ms-3"><a className="text-muted" href="#">B</a></li>
                    <li className="ms-3"><a className="text-muted" href="#">C</a></li>
                </ul>
            </footer>
        </div>
    )
}

export default Footer