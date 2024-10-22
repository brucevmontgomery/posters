import React from 'react';
import { NavLink } from 'react-router-dom';

// react-bootstrap
import { Card, Row, Col } from 'react-bootstrap';

// project import
import useAuth from 'hooks/useAuth';
import Breadcrumb from '../../../layouts/AdminLayout/Breadcrumb';

// ==============================|| RESET PASSWORD 1 ||============================== //

const ResetPassword1 = () => {
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
            <Row className="align-items-center text-center">
              <Col>
                <Card.Body className="card-body">
                  <div className="mb-4">
                    <i className="feather icon-mail auth-icon" />
                  </div>
                  <h3 className="mb-3 f-w-400">Reset Password</h3>
                  <div className="input-group mb-4">
                    <input type="email" className="form-control" placeholder="Email address" />
                  </div>
                  <button className="btn btn-primary mb-4">Reset password</button>
                  <p className="mb-0 text-muted">
                    Don’t have an account?{' '}
                    <NavLink to={isLoggedIn ? '/auth/signup-1' : '/signup'} className="f-w-400">
                      Signup
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

export default ResetPassword1;
