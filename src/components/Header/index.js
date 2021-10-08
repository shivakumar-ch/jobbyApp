import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'
import {AiFillHome} from 'react-icons/ai'
import {FiLogOut} from 'react-icons/fi'
import {BsFillBriefcaseFill} from 'react-icons/bs'
import './index.css'

const Header = props => {
  const onLogout = () => {
    Cookies.remove('jwt_token')
    const {history} = props
    history.replace('/login')
  }

  return (
    <nav className="nav">
      <div className="sm-nav-div">
        <Link to="/">
          <img
            className="sm-nav-logo"
            alt="website logo"
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
          />
        </Link>
        <ul className="head-ul">
          <li>
            <Link to="/">
              <AiFillHome className="icon home" />
            </Link>
          </li>
          <li>
            <Link to="/jobs">
              <BsFillBriefcaseFill className="briefcase icon" />
            </Link>
          </li>
          <li>
            <button className="sm-btn-icon" onClick={onLogout}>
              <FiLogOut className="logout icon" />
            </button>
          </li>
        </ul>
      </div>

      <ul className="lg-nav-ul">
        <li className="home-link">
          <Link to="/">
            <img
              className="lg-logo"
              alt="website logo"
              src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            />
          </Link>
        </li>
        <li className="home-job-link">
          <Link className="link" to="/">
            <p>Home</p>
          </Link>
          <Link className="link" to="/jobs">
            <p>Jobs</p>
          </Link>
        </li>
        <li className="btn-link">
          <button type="button" className="logoutBtn" onClick={onLogout}>
            Logout
          </button>
        </li>
      </ul>
    </nav>
  )
}

export default withRouter(Header)
