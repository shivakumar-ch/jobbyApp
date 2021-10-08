import {Component} from 'react'
import {Link} from 'react-router-dom'
import {BsSearch, BsFillBriefcaseFill, BsStarFill} from 'react-icons/bs'
import {MdLocationOn} from 'react-icons/md'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'

import Header from '../Header'

import './index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const apiRequest = {
  isIntialised: 'INTIALISE',
  isLoading: 'LOADING',
  noProducts: 'NOPRODUCTS',
  isFailure: 'FAIL',
  isSuccess: 'SUCCESS',
}

class Jobs extends Component {
  state = {
    jobsList: [],
    profileData: {},
    profileRequestStatus: apiRequest.isIntialised,
    jobRequestStatus: apiRequest.isIntialised,
    typeFilter: [],
    salaryRangeFilter: '',
    searchFilter: '',
  }

  componentDidMount() {
    this.getProfileDetails()
    this.getJobDetails()
  }

  onSearchJobs = event => this.setState({searchFilter: event.target.value})

  getJobDetails = async () => {
    this.setState({jobRequestStatus: apiRequest.isLoading})
    const {searchFilter, typeFilter, salaryRangeFilter} = this.state
    const jobsType = typeFilter.join(',')

    const token = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/jobs?employment_type=${jobsType}&minimum_package=${salaryRangeFilter}&search=${searchFilter}`
    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
    const response = await fetch(url, options)
    if (response.ok) {
      const data = await response.json()
      const updatedJobsList = data.jobs.map(job => ({
        companyLogoUrl: job.company_logo_url,
        employmentType: job.employment_type,
        id: job.id,
        jobDescription: job.job_description,
        location: job.location,
        packagePerAnnum: job.package_per_annum,
        rating: job.rating,
        title: job.title,
      }))
      if (updatedJobsList.length === 0) {
        this.setState({jobRequestStatus: apiRequest.noProducts})
      } else if (response.ok) {
        this.setState({
          jobsList: [...updatedJobsList],
          jobRequestStatus: apiRequest.isSuccess,
        })
      }
    } else {
      this.setState({jobRequestStatus: apiRequest.isFailure})
    }
  }

  getProfileDetails = async () => {
    this.setState({profileRequestStatus: apiRequest.isLoading})
    const token = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
    const response = await fetch('https://apis.ccbp.in/profile', options)
    console.log(response)
    if (response.ok) {
      const data = await response.json()
      const profileDetails = data.profile_details
      const updatedProfileData = {
        name: profileDetails.name,
        profileImageUrl: profileDetails.profile_image_url,
        shortBio: profileDetails.short_bio,
      }
      console.log(data)
      this.setState({
        profileData: {...updatedProfileData},
        profileRequestStatus: apiRequest.isSuccess,
      })
    } else {
      this.setState({profileRequestStatus: apiRequest.isFailure})
    }
  }

  onEnter = event => {
    const {searchFilter} = this.state
    if (event.key === 'Enter') {
      this.getJobDetails()
    }
  }

  changeRange = event => {
    this.setState({salaryRangeFilter: event.target.value}, this.getJobDetails)
  }

  renderJobsList = () => {
    const {jobRequestStatus, jobsList} = this.state
    switch (jobRequestStatus) {
      case apiRequest.isLoading:
        return (
          <div className="jobs-loader-container" testid="loader">
            <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
          </div>
        )
      case apiRequest.isSuccess:
        return (
          <ul className="job-ul">
            {jobsList.map(job => (
              <Link key={job.id} to={`/jobs/${job.id}`} className="link">
                <li className="job-li">
                  <div className="job-img-head-card">
                    <img
                      alt="company logo"
                      className="company-logo"
                      src={job.companyLogoUrl}
                    />
                    <div className="job-head-card">
                      <h1 className="job-title">{job.title}</h1>
                      <div className="star-div">
                        <BsStarFill color="#fbbf24" />
                        <p>{job.rating}</p>
                      </div>
                    </div>
                  </div>
                  <div className="location-type-salary-div">
                    <div className="location-type-div">
                      <div className="align-card">
                        <MdLocationOn />
                        <p className="location-para">{job.location}</p>
                      </div>
                      <div className="align-card">
                        <BsFillBriefcaseFill />
                        <p className="type-para">{job.employmentType}</p>
                      </div>
                    </div>
                    <p>{job.packagePerAnnum}</p>
                  </div>
                  <hr />
                  <div>
                    <h4>Description</h4>
                    <p>{job.jobDescription}</p>
                  </div>
                </li>
              </Link>
            ))}
          </ul>
        )
      case apiRequest.isFailure:
        return (
          <div className="job-fail-div">
            <img
              src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
              alt="failure view"
            />
            <h1>Oops! Something Went Wrong</h1>
            <p>We cannot seem to find the page you are looking for.</p>
            <button className="profile-btn" onClick={this.getJobDetails}>
              Retry
            </button>
          </div>
        )
      case apiRequest.noProducts:
        return (
          <div className="no-job-div">
            <img
              className="no-jobs-img"
              src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
              alt="no jobs"
            />
            <h1>No Jobs Found</h1>
            <p>We could not find any jobs. Try other filters.</p>
          </div>
        )
      default:
        return null
    }
  }

  renderProfileDiv = () => {
    const {profileData, profileRequestStatus} = this.state
    const {name, profileImageUrl, shortBio} = profileData
    switch (profileRequestStatus) {
      case apiRequest.isLoading:
        return (
          <div className="profile-loader-container" testid="loader">
            <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
          </div>
        )
      case apiRequest.isSuccess:
        return (
          <div className="profile-div">
            <img alt="profile" src={profileImageUrl} />
            <h1 className="profile-head">{name}</h1>
            <p>{shortBio}</p>
          </div>
        )
      case apiRequest.isFailure:
        return (
          <div className="profile-btn-div">
            <button onClick={this.getProfileDetails} className="profile-btn">
              Retry
            </button>
          </div>
        )

      default:
        return null
    }
  }

  render() {
    const {profileData, typeFilter, searchFilter, jobsList} = this.state
    const {
      companyLogoUrl,
      employmentType,
      id,
      jobDescription,
      location,
      packagePerAnnum,
      rating,
      title,
    } = jobsList

    return (
      <div className="jobs-container">
        <Header />
        <div className="jobs-card">
          <div className="sm-search-div">
            <input
              onChange={this.onSearchJobs}
              onKeyDown={this.onEnter}
              className="sm-search-input"
              type="search"
              value={searchFilter}
            />
            <button
              className="search-btn"
              onClick={this.getJobDetails}
              type="button"
              testid="searchButton"
            >
              <BsSearch className="search-icon" />
            </button>
          </div>
          <div className="filter">
            {this.renderProfileDiv()}
            <hr />
            <div className="employment-type-div">
              <h4>Type Of Employment</h4>
              <ul className="type-ul">
                {employmentTypesList.map(type => {
                  const onCheckedTypeFilter = () => {
                    if (typeFilter.includes(type.employmentTypeId)) {
                      const index = typeFilter.indexOf(type.employmentTypeId)
                      typeFilter.splice(index, 1)
                      this.setState(
                        {typeFilter: [...typeFilter]},
                        this.getJobDetails,
                      )
                    } else {
                      this.setState(
                        prevState => ({
                          typeFilter: [
                            ...prevState.typeFilter,
                            type.employmentTypeId,
                          ],
                        }),
                        this.getJobDetails,
                      )
                    }
                  }
                  return (
                    <li key={type.employmentTypeId}>
                      <input
                        onClick={onCheckedTypeFilter}
                        type="checkbox"
                        id={type.employmentTypeId}
                      />
                      <label htmlFor={type.employmentTypeId}>
                        {type.label}
                      </label>
                    </li>
                  )
                })}
              </ul>
            </div>
            <hr />
            <div className="salary-div">
              <h4>Salary Range</h4>
              <ul className="salary-ul">
                {salaryRangesList.map(range => (
                  <li key={range.salaryRangeId}>
                    <input
                      value={range.salaryRangeId}
                      onClick={this.changeRange}
                      id={range.label}
                      type="radio"
                      name="salary"
                    />
                    <label htmlFor={range.label}>{range.label}</label>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="jobs-list">
            <div className="lg-search-div">
              <input
                onChange={this.onSearchJobs}
                onKeyDown={this.onEnter}
                className="lg-search-input"
                placeholder="Search"
                type="search"
                value={searchFilter}
              />
              <button
                className="search-btn"
                onClick={this.getJobDetails}
                type="button"
                testid="searchButton"
              >
                <BsSearch className="search-icon" />
              </button>
            </div>
            {this.renderJobsList()}
          </div>
        </div>
      </div>
    )
  }
}

export default Jobs
