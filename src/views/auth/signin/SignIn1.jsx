import React from 'react';

// react-bootstrap
import { Card, CardText } from 'react-bootstrap';

// project import
import Breadcrumb from '../../../layouts/AdminLayout/Breadcrumb';
import useAuth from 'hooks/useAuth';

import AuthLogin from './FacebookLogin';


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
              <Card.Title as="h5">Crazy Joe's</Card.Title>
              <AuthLogin/>              
            </Card.Body>
          </Card>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Signin1;
