import React from 'react';
import { NavLink } from 'react-router-dom';

// project import
import Breadcrumb from '../../layouts/AdminLayout/Breadcrumb';

// ==============================|| COMING SOON ||============================== //

const ComingSoon = () => {
  return (
    <React.Fragment>
      <Breadcrumb />
      <div className="auth-wrapper offline">
        <div className="text-center">
          <h1 className="mb-4">Coming Soon</h1>
          <h5 className="text-muted mb-4">Our site is under construction - 10 days to go</h5>
          <NavLink to="/" className="btn btn-primary mb-4 text-white">
            <i className="feather icon-home me-2" />
            Back to Home
          </NavLink>
        </div>
      </div>
    </React.Fragment>
  );
};

export default ComingSoon;
