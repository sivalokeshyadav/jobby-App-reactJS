import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'

import {AiFillHome} from 'react-icons/ai'
import {BsFillBriefcaseFill} from 'react-icons/bs'
import {FiLogOut} from 'react-icons/fi'

import './index.css'

const Header = props => {
  const onClickLogout = () => {
    const {history} = props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  return (
    <nav className="header">
      <div className="app-desktop-container">
        <Link to="/" className="nav-link">
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
            className="website-logo"
          />
        </Link>
        <ul className="header-items-container">
          <li className="header-item">
            <Link to="/" className="nav-link">
              Home
            </Link>
          </li>

          <li className="header-item">
            <Link to="/jobs" className="nav-link">
              Jobs
            </Link>
          </li>
        </ul>
        <button className="logout-btn" type="button" onClick={onClickLogout}>
          Logout
        </button>
      </div>
      <div className="app-mobile-container">
        <Link to="/" className="nav-link">
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
            className="website-logo-mobile"
          />
        </Link>
        <ul className="header-items-container">
          <li className="header-item">
            <Link to="/">
              <AiFillHome className="nav-icon" />
            </Link>
          </li>
          <li className="header-item">
            <Link to="/jobs">
              <BsFillBriefcaseFill className="nav-icon" />
            </Link>
          </li>
          <FiLogOut className="nav-icon" onClick={onClickLogout} />
        </ul>
      </div>
    </nav>
  )
}

export default withRouter(Header)
