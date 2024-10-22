import PropTypes from 'prop-types';
import React, { useContext, useEffect, useRef } from 'react';

// project import
import Navigation from './Navigation';
import NavBar from './NavBar';
import Breadcrumb from './Breadcrumb';

import useWindowSize from '../../hooks/useWindowSize';
import useOutsideClick from '../../hooks/useOutsideClick';
import { ConfigContext } from '../../contexts/ConfigContext';
import * as actionType from '../../store/actions';

// ==============================|| ADMIN LAYOUT ||============================== //

const AdminLayout = ({ children }) => {
  const windowSize = useWindowSize();
  const ref = useRef();
  const configContext = useContext(ConfigContext);

  const { collapseMenu, layout, subLayout, headerFixedLayout } = configContext.state;
  const { dispatch } = configContext;

  useOutsideClick(ref, () => {
    if (collapseMenu) {
      dispatch({ type: actionType.COLLAPSE_MENU });
    }
  });

  useEffect(() => {
    if (windowSize.width > 992 && windowSize.width <= 1024 && layout !== 'horizontal') {
      dispatch({ type: actionType.COLLAPSE_MENU });
    }

    if (layout === 'horizontal' && windowSize.width < 992) {
      dispatch({ type: actionType.CHANGE_LAYOUT, layout: 'vertical' });
    }
  }, [dispatch, layout, windowSize]);

  const mobileOutClickHandler = () => {
    if (windowSize.width < 992 && collapseMenu) {
      dispatch({ type: actionType.COLLAPSE_MENU });
    }
  };

  let mainClass = ['pcoded-wrapper'];
  if (layout === 'horizontal' && subLayout === 'horizontal-2') {
    mainClass = [...mainClass, 'container'];
  }

  let common = (
    <React.Fragment>
      <Navigation />
      <NavBar />
    </React.Fragment>
  );

  let mainContainer = (
    <React.Fragment>
      <div className="pcoded-main-container">
        <div className={mainClass.join(' ')}>
          <div className="pcoded-content">
            <div className="pcoded-inner-content">
              <Breadcrumb />
              {children}
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );

  if (windowSize.width < 992) {
    let outSideClass = ['nav-outside'];
    if (collapseMenu) {
      outSideClass = [...outSideClass, 'mob-backdrop'];
    }
    if (headerFixedLayout) {
      outSideClass = [...outSideClass, 'mob-fixed'];
    }

    common = (
      <div className={outSideClass.join(' ')} ref={ref}>
        {common}
      </div>
    );

    mainContainer = (
      <div
        role="button"
        tabIndex="0"
        className="pcoded-outside"
        onClick={() => mobileOutClickHandler}
        onKeyDown={() => mobileOutClickHandler}
      >
        {mainContainer}
      </div>
    );
  }

  return (
    <React.Fragment>
      {common}
      {mainContainer}
    </React.Fragment>
  );
};

AdminLayout.propTypes = {
  children: PropTypes.node
};
export default AdminLayout;