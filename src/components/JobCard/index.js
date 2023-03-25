import {Link} from 'react-router-dom'

import {MdLocationOn} from 'react-icons/md'

import {BsFillBriefcaseFill} from 'react-icons/bs'

import {AiFillStar} from 'react-icons/ai'

import './index.css'

const JobCard = props => {
  const {jobDetails} = props
  const {
    companyLogoUrl,
    employmentType,
    jobDescription,
    location,
    packagePerAnnum,
    id,
    rating,
    title,
  } = jobDetails

  return (
    <>
      <li className="job-container">
        <Link to={`/jobs/${id}`}>
          <div className="h-line-up-description">
            <div className="img-container">
              <img
                src={companyLogoUrl}
                alt="company logo"
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
            <h1 className="heading-description">Description</h1>
            <p className="description">{jobDescription}</p>
          </div>
        </Link>
      </li>
    </>
  )
}
export default JobCard
