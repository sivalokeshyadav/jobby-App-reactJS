import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {MdLocationOn} from 'react-icons/md'
import {BiLinkExternal} from 'react-icons/bi'
import {BsFillBriefcaseFill} from 'react-icons/bs'
import {AiFillStar} from 'react-icons/ai'
import Header from '../Header'
import SimilarJob from '../SimilarJob'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class JobItem extends Component {
  state = {
    jobDetails: {},
    similarJobsList: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getProductData()
  }

  getFormattedData = job => ({
    companyLogoUrl: job.job_details.company_logo_url,
    companyWebsiteUrl: job.job_details.company_website_url,
    employmentType: job.job_details.employment_type,
    jobDescription: job.job_details.job_description,
    id: job.job_details.id,
    skills: job.job_details.skills,
    lifeAtCompany: job.job_details.life_at_company,
    location: job.job_details.location,
    packagePerAnnum: job.job_details.package_per_annum,
    rating: job.job_details.rating,
    title: job.job_details.title,
  })

  getSimilarData = jobData => ({
    companyLogoUrl: jobData.company_logo_url,
    employmentType: jobData.employment_type,
    jobDescription: jobData.job_description,
    id: jobData.id,
    location: jobData.location,
    rating: jobData.rating,
    title: jobData.title,
  })

  getProductData = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params

    this.setState({apiStatus: apiStatusConstants.inProgress})

    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const apiUrl = `https://apis.ccbp.in/jobs/${id}`

    const response = await fetch(apiUrl, options)
    if (response.ok === true) {
      const fetchedData = await response.json()
      const updatedData = await this.getFormattedData(fetchedData)
      const similarData = await fetchedData.similar_jobs
      const modifiedSimilarData = similarData.map(eachData =>
        this.getSimilarData(eachData),
      )

      this.setState({
        jobDetails: updatedData,
        similarJobsList: [...modifiedSimilarData],
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderSimilarJobs = () => {
    const {similarJobsList} = this.state
    return (
      <>
        <div className="similar-jobs-container">
          <h1 className="similar-job-heading">Similar jobs</h1>
          <ul className="similar-jobs-lists-container">
            {similarJobsList.map(eachItem => (
              <SimilarJob similarJobDetails={eachItem} key={eachItem.id} />
            ))}
          </ul>
        </div>
      </>
    )
  }

  renderLoader = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  onClickJobItemRetry = () => {
    this.getProductData()
  }

  renderJobItemFailure = () => (
    <div className="no-jobs-failure">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="job-details-failure-img"
      />
      <h1 className="heading">Oops! Something Went Wrong</h1>
      <p className="no-jobs-para">
        We cannot seem to find the page you are looking for.
      </p>
      <button
        className="failure-btn"
        type="button"
        onClick={this.onClickJobItemRetry}
      >
        Retry
      </button>
    </div>
  )

  renderJobItemView = () => {
    const {jobDetails} = this.state
    const {
      companyLogoUrl,
      companyWebsiteUrl,
      rating,
      location,
      lifeAtCompany,
      jobDescription,
      skills,
      packagePerAnnum,
      employmentType,
      title,
    } = jobDetails

    return (
      <>
        <div className="job-item-container">
          <div className="h-line-up-description">
            <div className="img-container">
              <img
                src={companyLogoUrl}
                alt="job details company logo"
                className="img-company"
              />
              <div className="company-role">
                <h1 className="role-heading">{title}</h1>
                <div className="rating">
                  <AiFillStar className="star" />
                  <p className="rating-number">{rating}</p>
                </div>
              </div>
            </div>
            <div className="location-salary-container">
              <div className="location-container">
                <MdLocationOn />
                <p className="location-name">{location}</p>
              </div>
              <div className="employment-container">
                <BsFillBriefcaseFill />
                <p className="employment-name">{employmentType}</p>
              </div>
              <div className="salary-container">
                <p className="salary-name">{packagePerAnnum}</p>
              </div>
            </div>
          </div>
          <hr className="h-line" />
          <div className="h-line-down-description">
            <div className="description-visit-container">
              <h1 className="heading-description">Description</h1>
              <a href={companyWebsiteUrl} className="web-link">
                Visit
                <BiLinkExternal />
              </a>
            </div>
            <p className="description">{jobDescription}</p>
          </div>
          <div className="skills-main-container">
            <h1 className="heading-skill">Skills</h1>
            <ul className="skills-container">
              {skills.map(eachSkill => (
                <li className="skill-container">
                  <img
                    src={eachSkill.image_url}
                    alt={eachSkill.name}
                    className="skill-img"
                    value={eachSkill.name}
                  />
                  <p className="skill-name">{eachSkill.name}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="life-style-container">
            <h2 className="company-life-heading">Life at Company</h2>
            <div className="life-company-container">
              <p className="para-company-life">{lifeAtCompany.description}</p>
              <img
                src={lifeAtCompany.image_url}
                alt="life at company"
                className="company-life-img"
              />
            </div>
          </div>
        </div>
        {this.renderSimilarJobs()}
      </>
    )
  }

  renderJobItemStatus = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderJobItemView()
      case apiStatusConstants.failure:
        return this.renderJobItemFailure()
      case apiStatusConstants.inProgress:
        return this.renderLoader()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="job-item-view-container">
          {this.renderJobItemStatus()}
        </div>
      </>
    )
  }
}
export default JobItem
