import React from 'react';
import { NavLink, Link } from 'react-router-dom';

// react-bootstrap
import { Card, Button, Alert } from 'react-bootstrap';

// third party
import { CopyToClipboard } from 'react-copy-to-clipboard';

// project import
import useAuth from 'hooks/useAuth';
import AuthLogin from './JWTLogin';
import Breadcrumb from '../../../layouts/AdminLayout/Breadcrumb';

// ==============================|| SIGN IN 1 ||============================== //

const Signin1 = () => {
  const { isLoggedIn } = useAuth();

  return (
    <React.Fragment>
      <Breadcrumb />
      <div className="auth-wrapper">
        <div className="auth-content">
          <div className="auth-bg">
            <span className="r" />
            <span className="r s" />
            <span className="r s" />
            <span className="r" />
          </div>
          <Card className="borderless text-center">
            <Card.Body>
              <div className="mb-4">
                <i className="feather icon-unlock auth-icon" />
              </div>
              <AuthLogin />
              <p className="mb-2 text-muted">
                Forgot password?{' '}
                <NavLink to={isLoggedIn ? '/auth/reset-password-1' : '/reset-password'} className="f-w-400">
                  Reset
                </NavLink>
              </p>
              <p className="mb-0 text-muted">
                Don’t have an account?{' '}
                <NavLink to={isLoggedIn ? '/auth/signup-1' : '/signup'} className="f-w-400">
                  Signup
                </NavLink>
              </p>
              <Alert variant="primary" className="text-start mt-3">
                User:
                <CopyToClipboard text="info@codedthemes.com">
                  <Button variant="outline-primary" as={Link} to="#" className="badge mx-2 mb-2" size="sm">
                    <i className="fa fa-user" /> info@codedthemes.com
                  </Button>
                </CopyToClipboard>
                <br />
                Password:
                <CopyToClipboard text="123456">
                  <Button variant="outline-primary" as={Link} to="#" className="badge mx-2" size="sm">
                    <i className="fa fa-lock" /> 123456
                  </Button>
                </CopyToClipboard>
              </Alert>
            </Card.Body>
          </Card>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Signin1;
