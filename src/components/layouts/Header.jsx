import React, { useState } from "react";
// import { Link } from 'react-router-dom';
import { MdNotifications } from "react-icons/md";
import { TiArrowSortedDown } from "react-icons/ti";

import UserAvater from "../../assets/images/user-avater.png";
// import HeaderSearch from "../inputs/HeaderSearch";

// import { formatFileUrl } from "../../utility/general";

const Header = ({ history, details = {}, navList = [] }) => {
  const [userPix, setUserPix] = useState("");
  const [imgHasError, setImgHasError] = useState(false);



  // useEffect(() => {
  //   !imgHasError && setUserPix(formatFileUrl(details.userProfilePicture));
  // }, [imgHasError, details]);

  const handleImgError = () => {
    setUserPix("");
    setImgHasError(true);
  };

  return (
    <header>
      <div className="content header-content space-between flex-v-center">
        <div className="header-left">
          {/* <HeaderSearch placeholder="Search transactions or invoices" /> */}
        </div>
        <div className="header-right flex flex-v-center">
          <div className="right-item notification flex p-r">
            <MdNotifications />
            <span className="indicator" />
          </div>
          <div className="right-item">
            <ul className="nav-menu">
              {navList && navList.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
          <div className="right-item">
            <div
              role="presentation"
              onClick={() => { }}
              className="user-avater-details flex flex-v-center pointer"
            >
              <div className="m-r-5 right-text" style={{ paddingTop: "3px" }}>
                <p className="name">
                  {localStorage.getItem("name") || "Osagie Osaigbovo"}
                </p>
                <p className="role">
                  {localStorage.getItem("role") || "Officer 1"}
                </p>
              </div>
              <div className="flex">
                <img
                  onError={handleImgError}
                  src={userPix || UserAvater}
                  alt="user avater"
                />
              </div>
              <div className="flex arrow">
                <TiArrowSortedDown />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
