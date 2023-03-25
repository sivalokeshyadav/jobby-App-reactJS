import './index.css'

const UserProfile = props => {
  const {userDetails} = props
  const {profileImageUrl, name, shortBio} = userDetails

  return (
    <>
      <div className="profile-container">
        <img src={profileImageUrl} alt="profile" className="user-img" />
        <h1 className="name">{name}</h1>
        <p className="short-bio">{shortBio}</p>
      </div>
    </>
  )
}

export default UserProfile
