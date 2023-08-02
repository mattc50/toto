import { useState } from 'react';
import Wrapper from '../assets/wrappers/Navbar';
import { MdMenu } from 'react-icons/md'
import { FaCaretDown } from 'react-icons/fa';
import { useAppContext } from '../context/appContext';
import defaultUser from '../assets/images/defaultUser.svg'

const Navbar = () => {
  const [showLogout, setShowLogout] = useState(false);
  const { toggleSidebar, logoutUser, user } = useAppContext();

  return (
    <Wrapper>
      <div className="nav-center">
        {/* first column */}
        <button
          type="button"
          className="toggle-btn"
          onClick={toggleSidebar}
        >
          <MdMenu />
        </button>

        {/* second column */}
        {/* <div>
          <Logo />
          <h3 className="logo-text">Dashboard</h3>
        </div> */}

        {/* third column */}
        <div className="btn-container">
          <button
            type="button"
            className="btn"
            onClick={() => setShowLogout(!showLogout)}
            style={showLogout ? { backgroundColor: "var(--grey-200)" } : { backgroundColor: "var(--white)" }}
          >
            <img
              className="user-pic"
              src={user.profPic?.compSmall || defaultUser}
              alt="profile"
            />
            {user?.name}
            <FaCaretDown style={!showLogout ? {} : { rotate: '180deg' }} />
          </button>
          <div className={showLogout ? "dropdown show-dropdown" : "dropdown"}>
            <button
              type="button"
              className="dropdown-btn"
              onClick={logoutUser}
            >
              logout
            </button>
          </div>
        </div>
      </div>
    </Wrapper>
  )
}

export default Navbar