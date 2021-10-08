import {Component} from 'react'

import {BsFillBriefcaseFill, BsStarFill} from 'react-icons/bs'
import {MdLocationOn} from 'react-icons/md'
import {FiExternalLink} from 'react-icons/fi'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import Header from '../Header'
import './index.css'

const apiRequest = {
  isLoading: 'LOADING',
  isSuccess: 'SUCCESS',
  isFailure: 'FAILURE',
}

class JobItemDetails extends Component {
  state = {
    jobData: {
      jobDetails: {},
      similarJobs: [],
    },
    apiStatus: apiRequest.isLoading,
  }

  componentDidMount() {
    this.getJobData()
  }

  getJobData = async () => {
    this.setState({apiStatus: apiRequest.isLoading})
    const {apiStatus} = this.state
    const token = Cookies.get('jwt_token')
    const {match} = this.props
    const {params} = match
    const {id} = params
    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method: 'GET',
    }
    const response = await fetch(`https://apis.ccbp.in/jobs/${id}`, options)
    console.log(response.status)
    if (response.ok) {
      const data = await response.json()
      const updatedData = {
        jobDetails: {
          companyLogoUrl: data.job_details.company_logo_url,
          companyWebsiteUrl: data.job_details.company_website_url,
          employmentType: data.job_details.employment_type,
          id: data.job_details.id,
          jobDescription: data.job_details.job_description,
          lifeAtCompany: {
            description: data.job_details.life_at_company.description,
            imageUrl: data.job_details.life_at_company.image_url,
          },
          location: data.job_details.location,
          packagePerAnnum: data.job_details.package_per_annum,
          rating: data.job_details.rating,
          title: data.job_details.title,
          skills: data.job_details.skills.map(item => ({
            imageUrl: item.image_url,
            name: item.name,
          })),
        },
        similarJobs: data.similar_jobs.map(job => ({
          companyLogoUrl: job.company_logo_url,
          employmentType: job.employment_type,
          id: job.id,
          jobDescription: job.job_description,
          location: job.location,
          rating: job.rating,
          title: job.title,
        })),
      }

      this.setState({
        jobData: {...updatedData},
        apiStatus: apiRequest.isSuccess,
      })
    } else {
      this.setState({apiStatus: apiRequest.isFailure})
    }
  }

  renderSimilarProducts = () => {
    const {jobData} = this.state
    const {similarJobs} = jobData

    return (
      <ul className="similar-ul">
        {similarJobs.map(item => (
          <li className="similar-li" key={item.id}>
            <div className="similar-job-head-card">
              <img
                alt="similar job company logo"
                className="company-logo"
                src={item.companyLogoUrl}
              />
              <div className="similar-head-content">
                <h4>{item.title}</h4>
                <div className="star-div">
                  <BsStarFill color="#fbbf24" />
                  <p>{item.rating}</p>
                </div>
              </div>
            </div>
            <div>
              <h4>Description</h4>
              <p>{item.jobDescription}</p>
            </div>
            <div className="location-type-div">
              <div className="align-card">
                <MdLocationOn />
                <p className="location-para">{item.location}</p>
              </div>
              <div className="align-card">
                <BsFillBriefcaseFill />
                <p className="type-para">{item.employmentType}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    )
  }

  renderJobCard = () => {
    const {jobData} = this.state
    const {jobDetails} = jobData
    const {
      companyLogoUrl,
      companyWebsiteUrl,
      employmentType,
      id,
      title,
      jobDescription,
      lifeAtCompany,
      location,
      packagePerAnnum,
      rating,
      skills,
    } = jobDetails
    const {description, imageUrl} = lifeAtCompany
    return (
      <>
        <Header />
        <div className="job-details-container">
          <div className="job-details-card">
            <div className="job-card">
              <div className="job-img-head-card">
                <img
                  className="company-logo"
                  src={companyLogoUrl}
                  alt="job details company logo"
                />
                <div className="job-head-card">
                  <h1 className="job-title">{title}</h1>
                  <div className="star-div">
                    <BsStarFill color="#fbbf24" />
                    <p>{rating}</p>
                  </div>
                </div>
              </div>
              <div className="location-type-salary-div">
                <div className="location-type-div">
                  <div className="align-card">
                    <MdLocationOn />
                    <p className="location-para">{location}</p>
                  </div>
                  <div className="align-card">
                    <BsFillBriefcaseFill />
                    <p className="type-para">{employmentType}</p>
                  </div>
                </div>
                <p>{packagePerAnnum}</p>
              </div>
              <hr />
              <div>
                <div className="description-link-div">
                  <h4>Description</h4>
                  <a className="anchor" href={companyWebsiteUrl}>
                    Visit
                    <FiExternalLink className="link-icon" />
                  </a>
                </div>

                <p>{jobDescription}</p>
              </div>
            </div>
            <div className="skills-card">
              <h1>skills</h1>
              <ul className="skill-ul">
                {skills.map(skill => (
                  <li className="skill-li" key={skill.name}>
                    <img
                      alt={skill.name}
                      className="skill-img"
                      src={skill.imageUrl}
                    />
                    <p>{skill.name}</p>
                  </li>
                ))}
              </ul>
            </div>
            <div className="life-at-company-card">
              <h3>Life at Company</h3>
              <div className="life-at-company-description-div">
                <p>{description}</p>
                <img
                  alt="life at company"
                  className="life-at-company-img"
                  src={imageUrl}
                />
              </div>
            </div>
          </div>
          <div className="similar-jobs-div">
            <h3>Similar Jobs</h3>
            {this.renderSimilarProducts()}
          </div>
        </div>
      </>
    )
  }

  render() {
    const {apiStatus, jobData} = this.state
    if (apiRequest.isLoading === apiStatus) {
      return (
        <>
          <Header />
          <div className="job-details-loader" testid="loader">
            <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
          </div>
        </>
      )
    }

    switch (apiStatus) {
      case apiRequest.isSuccess:
        return this.renderJobCard()
      case apiRequest.isFailure:
        return (
          <>
            <Header />
            <div className="failure-div">
              <img
                alt="failure view"
                src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
              />
              <h1>Oops! Something Went Wrong</h1>
              <p>We cannot seem to find the page you are looking for.</p>
              <button onClick={this.getJobData} className="retry-btn">
                Retry
              </button>
            </div>
          </>
        )
      default:
        return null
    }
  }
}

export default JobItemDetails
