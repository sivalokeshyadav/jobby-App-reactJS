import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'

import {BsSearch} from 'react-icons/bs'

import Header from '../Header'
import UserProfile from '../UserProfile'
import JobCard from '../JobCard'

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

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Jobs extends Component {
  state = {
    searchInput: '',
    employeeType: [],
    profileDetails: {},
    jobsList: [],
    profileApiStatus: apiStatusConstants.initial,
    jobsApiStatus: apiStatusConstants.initial,
    minimumPackage: '',
  }

  componentDidMount() {
    this.getJobs()
    this.getUserDetails()
  }

  getJobs = async () => {
    this.setState({jobsApiStatus: apiStatusConstants.inProgress})
    const {searchInput, employeeType, minimumPackage} = this.state

    const jwtToken = Cookies.get('jwt_token')

    let minimumPackageSelected = ''
    if (minimumPackage !== '') {
      minimumPackageSelected = parseInt(minimumPackage)
    }

    const employeeFilterString = employeeType.join(',')

    const apiUrl = `https://apis.ccbp.in/jobs?employment_type=${employeeFilterString}&minimum_package=${minimumPackageSelected}&search=${searchInput}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch(apiUrl, options)
    if (response.ok === true) {
      const fetchedData = await response.json()

      const updatedData = fetchedData.jobs.map(eachJob => ({
        companyLogoUrl: eachJob.company_logo_url,
        employmentType: eachJob.employment_type,
        jobDescription: eachJob.job_description,
        location: eachJob.location,
        id: eachJob.id,
        packagePerAnnum: eachJob.package_per_annum,
        rating: eachJob.rating,
        title: eachJob.title,
      }))

      this.setState({
        jobsList: updatedData,
        jobsApiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({jobsApiStatus: apiStatusConstants.failure})
    }
  }

  getUserDetails = async () => {
    this.setState({profileApiStatus: apiStatusConstants.inProgress})

    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/profile`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok === true) {
      const fetchedData = await response.json()
      const updatedData = {
        profileImageUrl: fetchedData.profile_details.profile_image_url,
        name: fetchedData.profile_details.name,
        shortBio: fetchedData.profile_details.short_bio,
      }
      this.setState({
        profileDetails: updatedData,
        profileApiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({profileApiStatus: apiStatusConstants.failure})
    }
  }

  renderUserProfile = () => {
    const {profileDetails} = this.state
    return (
      <>
        <div className="user-profile-container">
          <UserProfile userDetails={profileDetails} />
        </div>
      </>
    )
  }

  renderUserFailure = () => (
    <>
      <div className="user-failure-container">
        <button
          className="failure-btn"
          type="button"
          onClick={this.onClickUserRetry}
        >
          Retry
        </button>
      </div>
    </>
  )

  onClickUserRetry = () => {
    this.getUserDetails()
  }

  renderLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderUserProfileStatus = () => {
    const {profileApiStatus} = this.state

    switch (profileApiStatus) {
      case apiStatusConstants.success:
        return this.renderUserProfile()
      case apiStatusConstants.failure:
        return this.renderUserFailure()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  onClickSearch = () => {
    this.getJobs()
  }

  onChangeSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }

  searchElement = () => {
    const {searchInput} = this.state

    return (
      <>
        <input
          className="search-input"
          type="search"
          value={searchInput}
          placeholder="Search"
          onChange={this.onChangeSearchInput}
        />
        <button
          className="input-btn"
          type="button"
          onClick={this.onClickSearch}
          data-testid="searchButton"
        >
          <BsSearch className="search-icon" />
        </button>
      </>
    )
  }

  onClickJobsRetry = () => {
    this.getJobs()
  }

  renderJobDetails = () => {
    const {jobsList} = this.state
    const showJobs = jobsList.length > 0

    return showJobs ? (
      <ul className="unordered-list-container">
        {jobsList.map(job => (
          <JobCard jobDetails={job} key={job.id} />
        ))}
      </ul>
    ) : (
      <div className="no-jobs">
        <img
          src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
          alt="no jobs"
          className="no-jobs"
        />
        <h1 className="heading">No Jobs Found</h1>
        <p className="no-jobs-para">
          We could not find any jobs. Try other filters
        </p>
      </div>
    )
  }

  renderJobFailure = () => (
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
        onClick={this.onClickJobsRetry}
      >
        Retry
      </button>
    </div>
  )

  renderJobStatus = () => {
    const {jobsApiStatus} = this.state

    switch (jobsApiStatus) {
      case apiStatusConstants.success:
        return this.renderJobDetails()
      case apiStatusConstants.failure:
        return this.renderJobFailure()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  onSelectEmploymentOption = event => {
    const {employeeType} = this.state

    if (event.target.checked) {
      this.setState(
        {employeeType: [...employeeType, event.target.value]},
        this.getJobs,
      )
    } else {
      const updatedEmployeeType = employeeType.filter(
        each => each !== event.target.value,
      )
      this.setState({employeeType: updatedEmployeeType}, this.getJobs)
    }
  }

  onSalaryRange = event => {
    const {minimumPackage} = this.state
    const target = event.currentTarget
    if (target.checked && minimumPackage === target.value) {
      target.checked = false
      target.click()
      this.setState({minimumPackage: ''}, this.getJobs)
    }
  }

  onSalaryChange = event => {
    const {minimumPackage} = this.state
    if (minimumPackage !== event.target.value) {
      this.setState({minimumPackage: event.target.value}, this.getJobs)
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="jobs-container">
          <div className="profile-container">
            <div className="search-mobile-container">
              {this.searchElement()}
            </div>
            <div className="profile-container">
              {this.renderUserProfileStatus()}
            </div>
            <hr className="h-line" />
            <div className="filter-employee-container">
              <h1 className="employee-heading">Type of Employment</h1>
              <ul className="employee-items-container">
                {employmentTypesList.map(eachEmployee => (
                  <li className="employee-item">
                    <input
                      className="input-employee"
                      type="checkbox"
                      value={eachEmployee.employmentTypeId}
                      id={eachEmployee.employmentTypeId}
                      onChange={this.onSelectEmploymentOption}
                    />
                    <label
                      className="employee-label"
                      htmlFor={eachEmployee.employmentTypeId}
                    >
                      {eachEmployee.label}
                    </label>
                  </li>
                ))}
              </ul>

              <hr className="h-line" />
              <div className="salary-container">
                <h1 className="main-heading">Salary Range</h1>
                <ul className="salary-container">
                  {salaryRangesList.map(eachSalary => (
                    <li className="salary-list">
                      <input
                        type="radio"
                        id={eachSalary.salaryRangeId}
                        value={eachSalary.salaryRangeId}
                        name={eachSalary.salaryRangeId}
                        onClick={this.onSalaryRange}
                        onChange={this.onSalaryChange}
                        className="salary-input"
                      />

                      <label
                        className="salary-label"
                        htmlFor={eachSalary.salaryRangeId}
                      >
                        {eachSalary.label}
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div className="job-section">
            <div className="search-desktop-container">
              {this.searchElement()}
            </div>
            <div className="main-job-list-container">
              {this.renderJobStatus()}
            </div>
          </div>
        </div>
      </>
    )
  }
}

export default Jobs
