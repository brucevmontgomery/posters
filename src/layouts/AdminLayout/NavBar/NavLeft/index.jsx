import React, { useContext } from 'react';
import { Link } from 'react-router-dom';

// react-bootstrap
import { ListGroup, Dropdown } from 'react-bootstrap';

// project import
import useWindowSize from '../../../../hooks/useWindowSize';
import { ConfigContext } from '../../../../contexts/ConfigContext';
import NavSearch from './NavSearch';

// ==============================|| NAV LEFT ||============================== //

const NavLeft = () => {
  const windowSize = useWindowSize();

  const configContext = useContext(ConfigContext);
  const { rtlLayout } = configContext.state;
  let dropdownAlign = 'start';
  if (rtlLayout) {
    dropdownAlign = 'end';
  }

  let navItemClass = ['nav-item'];
  if (windowSize.width <= 575) {
    navItemClass = [...navItemClass, 'd-none'];
  }

  return (
    <React.Fragment>
      <ListGroup as="ul" bsPrefix=" " className="navbar-nav mr-auto">
        <ListGroup.Item as="li" bsPrefix=" " className={navItemClass.join(' ')}>
          <Dropdown align={dropdownAlign}>
            <Dropdown.Toggle variant={'link'} id="dropdown-basic">
              Dropdown
            </Dropdown.Toggle>
            <ul>
              <Dropdown.Menu>
                <li>
                  <Link to="#" className="dropdown-item">
                    Action
                  </Link>
                </li>
                <li>
                  <Link to="#" className="dropdown-item">
                    Another action
                  </Link>
                </li>
                <li>
                  <Link to="#" className="dropdown-item">
                    Something else here
                  </Link>
                </li>
              </Dropdown.Menu>
            </ul>
          </Dropdown>
        </ListGroup.Item>
        <ListGroup.Item as="li" bsPrefix=" " className="nav-item">
          <NavSearch windowWidth={windowSize.width} />
        </ListGroup.Item>
      </ListGroup>
    </React.Fragment>
  );
};

export default NavLeft;