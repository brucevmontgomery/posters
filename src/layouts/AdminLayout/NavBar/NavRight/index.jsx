import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';

// react-bootstrap
import { ListGroup, Dropdown } from 'react-bootstrap';

// project import
import { ConfigContext } from '../../../../contexts/ConfigContext';
import useAuth from '../../../../hooks/useAuth';
import * as actionType from '../../../../store/actions';

// assets
import avatar1 from '../../../../assets/images/user/avatar-1.jpg';
import avatar2 from '../../../../assets/images/user/avatar-2.jpg';
import avatar3 from '../../../../assets/images/user/avatar-3.jpg';
import avatar4 from '../../../../assets/images/user/avatar-4.jpg';


// ==============================|| NAV RIGHT ||============================== //

const NavRight = () => {
  const configContext = useContext(ConfigContext);
  const auth = useAuth()
  const { logout } = useAuth();
  const { rtlLayout } = configContext.state;
  const { dispatch } = configContext;

  let userName = "unknown"
  if(auth?.user?.userName) {
    userName = auth.user.userName
  }

  const handleChange = (lang) => {
    dispatch({ type: actionType.THEME_LOCALE, i18n: lang });
  };

  const handleLogout = async () => {
    try {
      //handleClose();
      await logout();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <React.Fragment>
      <ListGroup as="ul" bsPrefix=" " className="navbar-nav ms-auto" id="navbar-right" >                      
        <ListGroup.Item as="li" bsPrefix=" ">
          <Dropdown align={!rtlLayout ? 'end' : 'start'} className="drp-user">
            <Dropdown.Toggle as={Link} variant="link" to="#" id="dropdown-basic">
              <i className="icon feather icon-settings" />
            </Dropdown.Toggle>
            <Dropdown.Menu align="end" className="profile-notification">
              <div className="pro-head">
                <img src={avatar1} className="img-radius" alt="User Profile" />
                <span>{userName}</span>
                <Link to="#" className="dud-logout" title="Logout">
                  <i className="feather icon-log-out" />
                </Link>
              </div>
              <ListGroup as="ul" bsPrefix=" " variant="flush" className="pro-body">                
                <ListGroup.Item as="li" bsPrefix=" ">
                  <Link to="#" className="dropdown-item" onClick={handleLogout}>
                    <i className="feather icon-log-out" /> Logout
                  </Link>
                </ListGroup.Item>
              </ListGroup>
            </Dropdown.Menu>
          </Dropdown>
        </ListGroup.Item>
      </ListGroup>
      
    </React.Fragment>
  );
};

export default NavRight;
