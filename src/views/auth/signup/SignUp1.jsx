import React from 'react';
import { NavLink, Link } from 'react-router-dom';

// react-bootstrap
import { Card, Row, Col } from 'react-bootstrap';

// project import
import useAuth from 'hooks/useAuth';
import Breadcrumb from '../../../layouts/AdminLayout/Breadcrumb';

// ==============================|| SIGN UP 1 ||============================== //

const SignUp1 = () => {
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
          <Card className="borderless">
            <Row className="align-items-center">
              <Col>
                <Card.Body className="text-center">
                  <div className="mb-4">
                    <i className="feather icon-user-plus auth-icon" />
                  </div>
                  <h3 className="mb-4">Sign up</h3>
                  <div className="input-group mb-3">
                    <input type="text" className="form-control" placeholder="Username" />
                  </div>
                  <div className="input-group mb-3">
                    <input type="email" className="form-control" placeholder="Email address" />
                  </div>
                  <div className="input-group mb-4">
                    <input type="password" className="form-control" placeholder="Password" />
                  </div>
                  <div className="form-check  text-start mb-4 mt-2">
                    <input type="checkbox" className="form-check-input" id="customCheck1" defaultChecked={false} />
                    <label className="form-check-label" htmlFor="customCheck1">
                      Send me the <Link to="#"> Newsletter</Link> weekly.
                    </label>
                  </div>
                  <button className="btn btn-primary mb-4">Sign up</button>
                  <p className="mb-2">
                    Already have an account?{' '}
                    <NavLink to={isLoggedIn ? '/auth/signin-1' : '/login'} className="f-w-400">
                      Login
                    </NavLink>
                  </p>
                </Card.Body>
              </Col>
            </Row>
          </Card>
        </div>
      </div>
    </React.Fragment>
  );
};

export default SignUp1;
