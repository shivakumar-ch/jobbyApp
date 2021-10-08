import {Component} from 'react'
import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'
import './index.css'

class Login extends Component {
  state = {
    userName: '',
    password: '',
    errMsg: '',
    showErrMsg: false,
  }

  onSubmitForm = async event => {
    event.preventDefault()
    const {userName, password} = this.state
    const {history} = this.props
    const credentials = {
      username: userName,
      password,
    }
    const options = {
      method: 'POST',
      body: JSON.stringify(credentials),
    }
    const response = await fetch('https://apis.ccbp.in/login', options)
    const data = await response.json()
    if (response.ok) {
      Cookies.set('jwt_token', data.jwt_token, {expires: 30, path: '/'})
      history.replace('/')
    } else {
      this.setState({errMsg: data.error_msg, showErrMsg: true})
    }
  }

  onChangeUserName = event => this.setState({userName: event.target.value})

  onChangePassword = event => this.setState({password: event.target.value})

  render() {
    const token = Cookies.get('jwt_token')

    const {errMsg, showErrMsg} = this.state
    if (token !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <div className="login-container">
        <div className="login-card">
          <img
            className="logo"
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
          />
          <form onSubmit={this.onSubmitForm} className="login-form">
            <label htmlFor="username">USERNAME</label>
            <input
              onChange={this.onChangeUserName}
              className="input"
              type="text"
              id="username"
              placeholder="Username"
            />
            <label htmlFor="password">PASSWORD</label>
            <input
              onChange={this.onChangePassword}
              className="input"
              type="password"
              id="password"
              placeholder="Password"
            />
            <button type="submit" className="login-btn">
              Login
            </button>
          </form>
          {showErrMsg && <p className="err-msg">* {errMsg}</p>}
        </div>
      </div>
    )
  }
}

export default Login
