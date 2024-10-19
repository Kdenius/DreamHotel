import React from 'react'

export default function Footer() {
  return (
    <footer className="d-flex flex-wrap justify-content-between align-items-center py-3 my-4 border-top">
    <div className="col-md-4 d-flex align-items-center">
      <a href="/" className="mb-3 me-2 mb-md-0 text-muted text-decoration-none lh-1">
      <img src="/logo.png" alt="" width="40" height="40"/>
      </a>
      <span className="text-muted">© 2021 Company, Inc</span>
    </div>

    <ul className="nav col-md-4 justify-content-end list-unstyled d-flex">
      <li className="ms-4"><a className="text-muted" href="#"><img src="/insta.png" alt="" width="25" height="25"/></a></li>
      <li className="ms-4"><a className="text-muted" href="#"><img src="/x.png" alt="" width="25" height="25"/></a></li>
      <li className="ms-4"><a className="text-muted" href="#"><img src="/facebook.png" alt="" width="25" height="25"/></a></li>
      <li className="ms-4"><a className="text-muted" href="#"><img src="/mail.png" alt="" width="25" height="25"/></a></li>
    </ul>
  </footer>
  )
}
