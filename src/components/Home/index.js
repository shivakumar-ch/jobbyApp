import {Link} from 'react-router-dom'
import Header from '../Header'
import './index.css'

const Home = props => {
  const onClickFindJobs = () => {
    const {history} = props
    history.push('/jobs')
  }

  return (
    <div className="container">
      <Header />
      <div className="card">
        <h1 className="head">Find The Job That Fits Your Life</h1>
        <p>
          Millions of people are searching for jobs, salary information,company
          reviews. Find the job that fits your abilities and potential.
        </p>
        <Link to="/jobs">
          <button className="find-jobs-btn">Find Jobs</button>
        </Link>
      </div>
    </div>
  )
}

export default Home
